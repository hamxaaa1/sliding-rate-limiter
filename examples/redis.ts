import Redis from "ioredis";

import {
  SlidingWindow
} from "../src";

import {
  RedisStore
} from "../src/stores";



const redis = new Redis();



const store =
  new RedisStore(
    redis,
    60000
  );



const limiter =
  new SlidingWindow({

    max: 100,

    windowMs: 60000,

    store

  });



async function test(){


  const result =
    await limiter.consume(
      "user-123"
    );


  console.log(result);


}



test();