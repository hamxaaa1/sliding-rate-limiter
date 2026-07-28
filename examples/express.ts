import express from "express";

import {
  rateLimiter
} from "../src";


const app = express();



app.use(

  rateLimiter({

    max: 10,

    windowMs:
      60 * 1000

  })

);



app.get(
  "/",
  (req,res)=>{

    res.json({

      message:
        "Request allowed"

    });

  }

);



app.listen(
  3000,
  ()=>{

    console.log(
      "Server running on 3000"
    );

  }
);