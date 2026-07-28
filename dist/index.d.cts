import { Redis } from 'ioredis';

interface Store$1 {
    get(key: string): Promise<number[]>;
    add(key: string, timestamp: number): Promise<void>;
    removeExpired(key: string, before: number): Promise<void>;
    count(key: string): Promise<number>;
    delete(key: string): Promise<void>;
}

interface LimiterOptions {
    max: number;
    windowMs: number;
    store?: Store$1;
    keyGenerator?: (req: any) => string;
}

interface ConsumeResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    retryAfter: number;
    resetAt: number;
}

declare class SlidingWindow {
    private max;
    private windowMs;
    private store;
    constructor(options: LimiterOptions);
    consume(key: string): Promise<ConsumeResult>;
    reset(key: string): Promise<void>;
}

declare abstract class Store implements Store$1 {
    abstract get(key: string): Promise<number[]>;
    abstract add(key: string, timestamp: number): Promise<void>;
    abstract removeExpired(key: string, before: number): Promise<void>;
    abstract count(key: string): Promise<number>;
    abstract delete(key: string): Promise<void>;
}

declare class MemoryStore extends Store {
    private storage;
    get(key: string): Promise<number[]>;
    add(key: string, timestamp: number): Promise<void>;
    removeExpired(key: string, before: number): Promise<void>;
    count(key: string): Promise<number>;
    delete(key: string): Promise<void>;
}

declare class RedisStore extends Store {
    private redis;
    private windowMs;
    constructor(redis: Redis, windowMs: number);
    private getKey;
    get(key: string): Promise<number[]>;
    add(key: string, timestamp: number): Promise<void>;
    removeExpired(key: string, before: number): Promise<void>;
    count(key: string): Promise<number>;
    delete(key: string): Promise<void>;
}

declare const rateLimiter: (options: LimiterOptions) => (req: any, res: any, next: any) => Promise<any>;

declare const getCurrentTime: () => number;
declare const getSeconds: (milliseconds: number) => number;
declare const getResetTime: (timestamp: number, windowMs: number) => number;

declare const setRateLimitHeaders: (res: any, result: ConsumeResult) => void;

declare const defaultKeyGenerator: (req: any) => string;

declare const RATE_LIMIT_STATUS_CODE = 429;
declare const HEADER_LIMIT = "RateLimit-Limit";
declare const HEADER_REMAINING = "RateLimit-Remaining";
declare const HEADER_RESET = "RateLimit-Reset";
declare const HEADER_RETRY_AFTER = "Retry-After";
declare const DEFAULT_MESSAGE = "Too many requests. Please try again later.";

declare function validateOptions(max: number, windowMs: number): void;

export { type ConsumeResult, DEFAULT_MESSAGE, HEADER_LIMIT, HEADER_REMAINING, HEADER_RESET, HEADER_RETRY_AFTER, type LimiterOptions, MemoryStore, RATE_LIMIT_STATUS_CODE, RedisStore, SlidingWindow, Store, defaultKeyGenerator, getCurrentTime, getResetTime, getSeconds, rateLimiter, setRateLimitHeaders, validateOptions };
