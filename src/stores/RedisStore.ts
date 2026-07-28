import { randomUUID } from "crypto";
import type { Redis } from "ioredis";

import { Store } from "./Store";


export class RedisStore extends Store {


  constructor(
    private redis: Redis,
    private windowMs: number
  ) {

    super();

  }



  private getKey(
    key: string
  ): string {

    return `rate-limit:${key}`;

  }




  async get(
    key: string
  ): Promise<number[]> {


    const redisKey =
      this.getKey(key);



    const members =
      await this.redis.zrange(
        redisKey,
        0,
        -1
      );



    return members.map(
      (item:string) =>
        Number(
          item.split(":")[0]
        )
    );


  }





  async add(
    key:string,
    timestamp:number
  ):Promise<void>{


    const redisKey =
      this.getKey(key);



    const member =
      `${timestamp}:${randomUUID()}`;



    await this.redis.zadd(
      redisKey,
      timestamp,
      member
    );



    // Automatically remove inactive users
    await this.redis.expire(
      redisKey,
      Math.ceil(
        this.windowMs / 1000
      )
    );


  }






  async removeExpired(
    key:string,
    before:number
  ):Promise<void>{


    const redisKey =
      this.getKey(key);



    await this.redis.zremrangebyscore(
      redisKey,
      0,
      before
    );


  }





  async count(
    key:string
  ):Promise<number>{


    const redisKey =
      this.getKey(key);



    return await this.redis.zcard(
      redisKey
    );


  }





  async delete(
    key:string
  ):Promise<void>{


    const redisKey =
      this.getKey(key);



    await this.redis.del(
      redisKey
    );


  }


}