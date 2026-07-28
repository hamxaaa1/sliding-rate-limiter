import { describe, it, expect } from "vitest";
import { SlidingWindow } from "../src";


describe("SlidingWindow Validation", () => {


  it("should reject max less than or equal to zero", () => {

    expect(() => {

      new SlidingWindow({

        max: 0,

        windowMs: 10000

      });

    }).toThrow(
      "max must be greater than 0"
    );

  });



  it("should reject negative max", () => {

    expect(() => {

      new SlidingWindow({

        max: -5,

        windowMs: 10000

      });

    }).toThrow(
      "max must be greater than 0"
    );

  });



  it("should reject windowMs less than or equal to zero", () => {

    expect(() => {

      new SlidingWindow({

        max: 5,

        windowMs: 0

      });

    }).toThrow(
      "windowMs must be greater than 0"
    );

  });



  it("should reject negative windowMs", () => {

    expect(() => {

      new SlidingWindow({

        max: 5,

        windowMs: -1000

      });

    }).toThrow(
      "windowMs must be greater than 0"
    );

  });



  it("should accept valid options", () => {

    expect(() => {

      new SlidingWindow({

        max: 10,

        windowMs: 60000

      });

    }).not.toThrow();

  });


});