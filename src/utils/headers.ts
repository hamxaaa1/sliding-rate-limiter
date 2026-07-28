import type { ConsumeResult } from "../types";

import {
  HEADER_LIMIT,
  HEADER_REMAINING,
  HEADER_RESET,
  HEADER_RETRY_AFTER,
} from "./constants";


export const setRateLimitHeaders = (
  res: any,
  result: ConsumeResult
) => {

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