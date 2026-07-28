import { SlidingWindow } from "../src";


const limiter = new SlidingWindow({

  max: 5,

  windowMs: 60 * 1000

});



async function test(){

  for(let i = 1; i <= 7; i++){

    const result =
      await limiter.consume(
        "user-123"
      );


    console.log(
      `Request ${i}`,
      result
    );

  }

}



test();