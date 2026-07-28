"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_MESSAGE: () => DEFAULT_MESSAGE,
  HEADER_LIMIT: () => HEADER_LIMIT,
  HEADER_REMAINING: () => HEADER_REMAINING,
  HEADER_RESET: () => HEADER_RESET,
  HEADER_RETRY_AFTER: () => HEADER_RETRY_AFTER,
  MemoryStore: () => MemoryStore,
  RATE_LIMIT_STATUS_CODE: () => RATE_LIMIT_STATUS_CODE,
  RedisStore: () => RedisStore,
  SlidingWindow: () => SlidingWindow,
  Store: () => Store,
  defaultKeyGenerator: () => defaultKeyGenerator,
  getCurrentTime: () => getCurrentTime,
  getResetTime: () => getResetTime,
  getSeconds: () => getSeconds,
  rateLimiter: () => rateLimiter,
  setRateLimitHeaders: () => setRateLimitHeaders,
  validateOptions: () => validateOptions
});
module.exports = __toCommonJS(index_exports);

// src/stores/Store.ts
var Store = class {
};

// src/stores/MemoryStore.ts
var MemoryStore = class extends Store {
  constructor() {
    super(...arguments);
    this.storage = /* @__PURE__ */ new Map();
  }
  async get(key) {
    return this.storage.get(key) ?? [];
  }
  async add(key, timestamp) {
    const timestamps = this.storage.get(key) ?? [];
    timestamps.push(timestamp);
    this.storage.set(
      key,
      timestamps
    );
  }
  async removeExpired(key, before) {
    const timestamps = this.storage.get(key) ?? [];
    const filtered = timestamps.filter(
      (timestamp) => timestamp > before
    );
    this.storage.set(
      key,
      filtered
    );
  }
  async count(key) {
    return this.storage.get(key)?.length ?? 0;
  }
  async delete(key) {
    this.storage.delete(key);
  }
};

// src/stores/RedisStore.ts
var import_crypto = require("crypto");
var RedisStore = class extends Store {
  constructor(redis, windowMs) {
    super();
    this.redis = redis;
    this.windowMs = windowMs;
  }
  getKey(key) {
    return `rate-limit:${key}`;
  }
  async get(key) {
    const redisKey = this.getKey(key);
    const members = await this.redis.zrange(
      redisKey,
      0,
      -1
    );
    return members.map(
      (item) => Number(
        item.split(":")[0]
      )
    );
  }
  async add(key, timestamp) {
    const redisKey = this.getKey(key);
    const member = `${timestamp}:${(0, import_crypto.randomUUID)()}`;
    await this.redis.zadd(
      redisKey,
      timestamp,
      member
    );
    await this.redis.expire(
      redisKey,
      Math.ceil(
        this.windowMs / 1e3
      )
    );
  }
  async removeExpired(key, before) {
    const redisKey = this.getKey(key);
    await this.redis.zremrangebyscore(
      redisKey,
      0,
      before
    );
  }
  async count(key) {
    const redisKey = this.getKey(key);
    return await this.redis.zcard(
      redisKey
    );
  }
  async delete(key) {
    const redisKey = this.getKey(key);
    await this.redis.del(
      redisKey
    );
  }
};

// src/utils/time.ts
var getCurrentTime = () => {
  return Date.now();
};
var getSeconds = (milliseconds) => {
  return Math.ceil(milliseconds / 1e3);
};
var getResetTime = (timestamp, windowMs) => {
  return timestamp + windowMs;
};

// src/utils/constants.ts
var RATE_LIMIT_STATUS_CODE = 429;
var HEADER_LIMIT = "RateLimit-Limit";
var HEADER_REMAINING = "RateLimit-Remaining";
var HEADER_RESET = "RateLimit-Reset";
var HEADER_RETRY_AFTER = "Retry-After";
var DEFAULT_MESSAGE = "Too many requests. Please try again later.";

// src/utils/headers.ts
var setRateLimitHeaders = (res, result) => {
  res.setHeader(
    HEADER_LIMIT,
    result.limit
  );
  res.setHeader(
    HEADER_REMAINING,
    result.remaining
  );
  res.setHeader(
    HEADER_RESET,
    result.resetAt
  );
  if (result.retryAfter > 0) {
    res.setHeader(
      HEADER_RETRY_AFTER,
      result.retryAfter
    );
  }
};

// src/utils/keyGenerator.ts
var defaultKeyGenerator = (req) => {
  return req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
};

// src/utils/validation.ts
function validateOptions(max, windowMs) {
  if (max <= 0) {
    throw new Error(
      "max must be greater than 0"
    );
  }
  if (windowMs <= 0) {
    throw new Error(
      "windowMs must be greater than 0"
    );
  }
}

// src/core/SlidingWindow.ts
var SlidingWindow = class {
  constructor(options) {
    validateOptions(
      options.max,
      options.windowMs
    );
    this.max = options.max;
    this.windowMs = options.windowMs;
    this.store = options.store ?? new MemoryStore();
  }
  async consume(key) {
    const now = Date.now();
    const expiredBefore = now - this.windowMs;
    await this.store.removeExpired(
      key,
      expiredBefore
    );
    const currentCount = await this.store.count(key);
    if (currentCount >= this.max) {
      const timestamps = await this.store.get(key);
      const oldestRequest = timestamps[0];
      if (!oldestRequest) {
        await this.store.add(
          key,
          now
        );
        return {
          allowed: true,
          remaining: this.max - 1,
          limit: this.max,
          retryAfter: 0,
          resetAt: now + this.windowMs
        };
      }
      const retryAfter = Math.max(
        0,
        Math.ceil(
          (oldestRequest + this.windowMs - now) / 1e3
        )
      );
      return {
        allowed: false,
        remaining: 0,
        limit: this.max,
        retryAfter,
        resetAt: oldestRequest + this.windowMs
      };
    }
    await this.store.add(
      key,
      now
    );
    return {
      allowed: true,
      remaining: this.max - (currentCount + 1),
      limit: this.max,
      retryAfter: 0,
      resetAt: now + this.windowMs
    };
  }
  async reset(key) {
    await this.store.delete(
      key
    );
  }
};

// src/adapters/express.ts
var rateLimiter = (options) => {
  const limiter = new SlidingWindow(options);
  return async (req, res, next) => {
    try {
      const key = options.keyGenerator ? options.keyGenerator(req) : defaultKeyGenerator(req);
      const result = await limiter.consume(key);
      setRateLimitHeaders(
        res,
        result
      );
      if (!result.allowed) {
        return res.status(RATE_LIMIT_STATUS_CODE).json({
          success: false,
          message: DEFAULT_MESSAGE,
          retryAfter: result.retryAfter
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_MESSAGE,
  HEADER_LIMIT,
  HEADER_REMAINING,
  HEADER_RESET,
  HEADER_RETRY_AFTER,
  MemoryStore,
  RATE_LIMIT_STATUS_CODE,
  RedisStore,
  SlidingWindow,
  Store,
  defaultKeyGenerator,
  getCurrentTime,
  getResetTime,
  getSeconds,
  rateLimiter,
  setRateLimitHeaders,
  validateOptions
});
//# sourceMappingURL=index.cjs.map