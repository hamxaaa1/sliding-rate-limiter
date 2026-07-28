# Sliding Rate Limiter

A production-ready **TypeScript sliding window rate limiter** for Node.js applications.

Supports:

* ✅ Sliding Window Algorithm
* ✅ Memory Store
* ✅ Redis Store
* ✅ Express Middleware
* ✅ TypeScript Support
* ✅ Custom Storage Adapters
* ✅ Rate Limit Headers
* ✅ ESM + CommonJS builds
* ✅ Fully Tested

---

# Installation

Install using npm:

```bash
npm install sliding-rate-limiter
```

or using yarn:

```bash
yarn add sliding-rate-limiter
```

or pnpm:

```bash
pnpm add sliding-rate-limiter
```

---

# Basic Usage

## SlidingWindow

The core limiter can be used without Express.

```typescript
import { SlidingWindow } from "sliding-rate-limiter";


const limiter = new SlidingWindow({

  max: 5,

  windowMs: 60000

});


async function test(){

  const result = await limiter.consume(
    "user-123"
  );


  console.log(result);

}


test();
```

Output:

```json
{
  "allowed": true,
  "remaining": 4,
  "limit": 5,
  "retryAfter": 0,
  "resetAt": 1785257675953
}
```

---

# Configuration

```typescript
new SlidingWindow({

  max: 100,

  windowMs: 60000

});
```

## Options

| Option   | Type   | Description                 |
| -------- | ------ | --------------------------- |
| max      | number | Maximum requests allowed    |
| windowMs | number | Time window in milliseconds |
| store    | Store  | Custom storage adapter      |

Example:

```typescript
{
  max: 10,
  windowMs: 10000
}
```

Allows:

```
10 requests every 10 seconds
```

---

# Express Middleware

Protect your Express routes.

Install Express:

```bash
npm install express
```

Example:

```typescript
import express from "express";

import {
  rateLimiter
} from "sliding-rate-limiter";


const app = express();


const limiter = rateLimiter({

  max: 5,

  windowMs: 60000

});


app.use(limiter);


app.get("/", (req,res)=>{

  res.json({

    message:"Request allowed"

  });

});


app.listen(3000);
```

---

# Response Headers

Every request receives rate limit headers:

```
RateLimit-Limit
RateLimit-Remaining
RateLimit-Reset
```

Example:

```
RateLimit-Limit: 5

RateLimit-Remaining: 2

RateLimit-Reset: 1785260130942
```

When limit is exceeded:

```
HTTP 429 Too Many Requests
```

Response:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

Header:

```
Retry-After: 60
```

---

# Multiple Users

Each key has its own limit.

Example:

```typescript
await limiter.consume("user-1");

await limiter.consume("user-2");
```

Output:

```
user-1
Request 1 allowed
Request 2 allowed
Request 3 blocked


user-2
Request 1 allowed
```

---

# Reset Limits

You can manually reset a user's rate limit.

```typescript
await limiter.reset(
  "user-123"
);
```

After reset:

```typescript
{
 allowed:true
}
```

---

# Memory Store

Default storage.

No setup required.

Example:

```typescript
import {
 SlidingWindow
} from "sliding-rate-limiter";


const limiter =
new SlidingWindow({

 max:10,

 windowMs:60000

});
```

Data is stored in application memory.

Useful for:

* Development
* Small applications
* Single server deployments

---

# Redis Store

Redis support is available for distributed applications.

Install Redis client:

```bash
npm install ioredis
```

Example:

```typescript
import Redis from "ioredis";

import {
 SlidingWindow,
 RedisStore
} from "sliding-rate-limiter";


const redis =
new Redis();


const limiter =
new SlidingWindow({

 max:100,

 windowMs:60000,


 store:
 new RedisStore(redis)

});
```

Redis allows:

* Multiple servers
* Horizontal scaling
* Shared rate limits

---

# Custom Storage

You can create your own storage adapter.

Extend:

```typescript
import {
 Store
} from "sliding-rate-limiter";


class CustomStore extends Store {


 async get(key:string){

 }


 async add(
  key:string,
  timestamp:number
 ){

 }


 async removeExpired(
  key:string,
  before:number
 ){

 }


 async count(
  key:string
 ){

 }


 async delete(
  key:string
 ){

 }


}
```

Then:

```typescript
const limiter =
new SlidingWindow({

 max:10,

 windowMs:60000,

 store:new CustomStore()

});
```

---

# Algorithm

This library uses the Sliding Window algorithm.

Flow:

```
Request
   |
   v
Remove expired timestamps
   |
   v
Count active requests
   |
   v
Check limit
   |
   +---- Allowed
   |
   +---- Blocked (429)
```

Example:

```
Window: 60 seconds

Limit: 5 requests


00s  Request
10s  Request
20s  Request
30s  Request
40s  Request


45s  Request blocked


70s
First request expires


New request allowed
```

---

# Testing

Clone repository:

```bash
git clone <repository-url>
```

Install:

```bash
npm install
```

Run tests:

```bash
npm test
```

Example output:

```
✓ SlidingWindow.test.ts
✓ MemoryStore.test.ts
✓ RedisStore.test.ts
✓ Express.test.ts

10 tests passed
```

---

# Building From Source

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Creates:

```
dist/

├── index.js
├── index.cjs
├── index.d.ts
└── source maps
```

---

# Requirements

* Node.js >= 18
* TypeScript >= 5

---

# Use Cases

Perfect for:

* API protection
* Authentication endpoints
* Login throttling
* Public APIs
* SaaS applications
* Microservices
* Distributed systems

---
# Open Source

# License

MIT License

---

# Author

Hamza Ashfaq
