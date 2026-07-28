import type {
  Store as StoreInterface
} from "../types/Store";


export abstract class Store
  implements StoreInterface {


  abstract get(
    key:string
  ): Promise<number[]>;



  abstract add(
    key:string,
    timestamp:number
  ): Promise<void>;



  abstract removeExpired(
    key:string,
    before:number
  ): Promise<void>;



  abstract count(
    key:string
  ): Promise<number>;



  abstract delete(
    key:string
  ): Promise<void>;

}