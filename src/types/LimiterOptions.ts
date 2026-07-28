import type { Store } from "./Store";


export interface LimiterOptions {

  max: number;

  windowMs: number;


  store?: Store;


  keyGenerator?: (
    req: any
  ) => string;

}