import {
  describe,
  it,
  expect
} from "vitest";

import {
  SlidingWindow
} from "../src/core";


describe("SlidingWindow", () => {


  it("allows requests under limit", async () => {


    const limiter =
      new SlidingWindow({

        max: 3,

        windowMs: 60000

      });



    const result =
      await limiter.consume(
        "user1"
      );


    expect(result.allowed)
      .toBe(true);



    expect(result.remaining)
      .toBe(2);


  });



  it("blocks when limit exceeded", async () => {


    const limiter =
      new SlidingWindow({

        max: 2,

        windowMs: 60000

      });



    await limiter.consume("user1");

    await limiter.consume("user1");


    const result =
      await limiter.consume("user1");



    expect(result.allowed)
      .toBe(false);



    expect(result.remaining)
      .toBe(0);


  });


});