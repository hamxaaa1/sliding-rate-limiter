import type {
  ConsumeResult,
  LimiterOptions,
} from "../types";

import {
  MemoryStore,
  Store,
} from "../stores";

import {
  validateOptions
} from "../utils";


export class SlidingWindow {


  private max: number;

  private windowMs: number;

  private store: Store;



  constructor(
    options: LimiterOptions
  ) {


    // Validate configuration
    validateOptions(
      options.max,
      options.windowMs
    );



    this.max = options.max;

    this.windowMs = options.windowMs;

    this.store =
      options.store ?? new MemoryStore();

  }




  async consume(
    key:string
  ):Promise<ConsumeResult>{


    const now =
      Date.now();



    const expiredBefore =
      now - this.windowMs;



    // Remove expired requests
    await this.store.removeExpired(
      key,
      expiredBefore
    );



    // Count active requests
    const currentCount =
      await this.store.count(key);




    // Limit reached
    if(currentCount >= this.max){


      const timestamps =
        await this.store.get(key);



      const oldestRequest =
        timestamps[0];



      // Safety check
      if(!oldestRequest){


        await this.store.add(
          key,
          now
        );


        return {

          allowed:true,

          remaining:
            this.max - 1,

          limit:this.max,

          retryAfter:0,

          resetAt:
            now + this.windowMs

        };

      }




      const retryAfter =
        Math.max(
          0,
          Math.ceil(
            (
              oldestRequest +
              this.windowMs -
              now
            ) / 1000
          )
        );



      return {

        allowed:false,

        remaining:0,

        limit:this.max,

        retryAfter,

        resetAt:
          oldestRequest +
          this.windowMs

      };


    }





    // Add current request
    await this.store.add(
      key,
      now
    );



    return {

      allowed:true,

      remaining:
        this.max -
        (currentCount + 1),

      limit:this.max,

      retryAfter:0,

      resetAt:
        now + this.windowMs

    };


  }





  async reset(
    key:string
  ):Promise<void>{


    await this.store.delete(
      key
    );


  }


}