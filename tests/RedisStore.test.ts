import {
  describe,
  it,
  expect
} from "vitest";

import {
  RedisStore
} from "../src/stores";



class FakeRedis {


  private data =
    new Map<string, Map<string, number>>();




  async zadd(
    key:string,
    score:number,
    member:string
  ){


    if(!this.data.has(key)){
      this.data.set(
        key,
        new Map()
      );
    }


    this.data
      .get(key)!
      .set(
        member,
        score
      );

  }




  async zrange(
    key:string,
    start:number,
    end:number
  ){


    const values =
      Array.from(
        this.data.get(key)?.keys()
        ?? []
      );


    return values.slice(
      start,
      end === -1
        ? undefined
        : end + 1
    );

  }





  async zremrangebyscore(
    key:string,
    min:number,
    max:number
  ){


    const set =
      this.data.get(key);


    if(!set)
      return;



    for(
      const [member,score]
      of set
    ){

      if(
        score >= min &&
        score <= max
      ){

        set.delete(member);

      }

    }


  }





  async zcard(
    key:string
  ){


    return (
      this.data.get(key)?.size
      ?? 0
    );

  }





  async del(
    key:string
  ){

    this.data.delete(key);

  }




  async expire(){

    // fake

  }


}




describe(
"RedisStore",
()=>{


it(
"should add and count timestamps",
async()=>{


const redis =
  new FakeRedis();



const store =
  new RedisStore(
    redis as any,
    60000
  );



await store.add(
  "user1",
  1000
);


await store.add(
  "user1",
  2000
);



const count =
  await store.count(
    "user1"
  );



expect(count)
  .toBe(2);



});






it(
"should remove expired timestamps",
async()=>{


const redis =
  new FakeRedis();



const store =
  new RedisStore(
    redis as any,
    60000
  );



await store.add(
  "user1",
  1000
);


await store.add(
  "user1",
  5000
);



await store.removeExpired(
  "user1",
  2000
);



const count =
  await store.count(
    "user1"
  );



expect(count)
  .toBe(1);



});






it(
"should delete keys",
async()=>{


const redis =
  new FakeRedis();



const store =
  new RedisStore(
    redis as any,
    60000
  );



await store.add(
  "user1",
  1000
);



await store.delete(
  "user1"
);



const count =
  await store.count(
    "user1"
  );



expect(count)
  .toBe(0);



});


});