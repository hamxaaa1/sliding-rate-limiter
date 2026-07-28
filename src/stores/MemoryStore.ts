import { Store } from "./Store";


export class MemoryStore extends Store {


  private storage =
    new Map<string, number[]>();



  async get(
    key:string
  ):Promise<number[]> {

    return this.storage.get(key) ?? [];

  }



  async add(
    key:string,
    timestamp:number
  ):Promise<void>{

    const timestamps =
      this.storage.get(key) ?? [];


    timestamps.push(timestamp);


    this.storage.set(
      key,
      timestamps
    );

  }



  async removeExpired(
    key:string,
    before:number
  ):Promise<void>{


    const timestamps =
      this.storage.get(key) ?? [];



    const filtered =
      timestamps.filter(
        timestamp =>
          timestamp > before
      );



    this.storage.set(
      key,
      filtered
    );

  }



  async count(
    key:string
  ):Promise<number>{


    return (
      this.storage.get(key)?.length
      ?? 0
    );

  }



  async delete(
    key:string
  ):Promise<void>{

    this.storage.delete(key);

  }

}