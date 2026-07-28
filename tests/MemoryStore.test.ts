import {
  describe,
  it,
  expect
} from "vitest";

import {
  MemoryStore
} from "../src/stores";


describe("MemoryStore",()=>{


  it("should store timestamps",async()=>{


    const store =
      new MemoryStore();



    await store.add(
      "user1",
      100
    );


    await store.add(
      "user1",
      200
    );


    await store.add(
      "user1",
      300
    );



    const result =
      await store.get(
        "user1"
      );



    expect(result)
      .toEqual([
        100,
        200,
        300
      ]);


  });




  it("should delete keys",async()=>{


    const store =
      new MemoryStore();



    await store.add(
      "user1",
      100
    );



    await store.delete(
      "user1"
    );



    const result =
      await store.get(
        "user1"
      );



    expect(result)
      .toEqual([]);


  });



});