import { SlidingWindow } from "../core";
import type { LimiterOptions } from "../types";

import {
  defaultKeyGenerator,
  setRateLimitHeaders,
  RATE_LIMIT_STATUS_CODE,
  DEFAULT_MESSAGE
} from "../utils";


export const rateLimiter = (
  options: LimiterOptions
) => {

  const limiter = new SlidingWindow(options);


  return async (
    req:any,
    res:any,
    next:any
  ) => {

    try {

      const key = options.keyGenerator
        ? options.keyGenerator(req)
        : defaultKeyGenerator(req);


      const result =
        await limiter.consume(key);


      setRateLimitHeaders(
        res,
        result
      );


      if(!result.allowed){

        return res
          .status(RATE_LIMIT_STATUS_CODE)
          .json({

            success:false,

            message: DEFAULT_MESSAGE,

            retryAfter:
              result.retryAfter

          });

      }


      next();


    } catch(error){

      next(error);

    }

  };

};