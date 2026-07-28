import {
  describe,
  it,
  expect,
  vi
} from "vitest";

import {
  SlidingWindow
} from "../src/core";


describe("Sliding Window Expiration", () => {


  it("allows requests after window expires", async () => {


    vi.useFakeTimers();


    const limiter =
      new SlidingWindow({

        max: 2,

        windowMs: 1000

      });



    await limiter.consume("user1");

    await limiter.consume("user1");



    let result =
      await limiter.consume("user1");


    expect(result.allowed)
      .toBe(false);



    vi.advanceTimersByTime(1100);



    result =
      await limiter.consume("user1");



    expect(result.allowed)
      .toBe(true);



    vi.useRealTimers();


  });


});