import {
  describe,
  it,
  expect
} from "vitest";

import express from "express";
import request from "supertest";

import {
  rateLimiter
} from "../src";


describe("Express Rate Limiter", () => {


  it("allows requests under limit", async () => {


    const app = express();


    app.use(
      rateLimiter({
        max: 2,
        windowMs: 60000
      })
    );


    app.get("/", (req, res) => {

      res.json({
        message: "success"
      });

    });



    const response =
      await request(app)
        .get("/");



    expect(response.status)
      .toBe(200);



    expect(response.body.message)
      .toBe("success");


  });



  it("blocks requests after limit", async () => {


    const app = express();


    app.use(
      rateLimiter({
        max: 2,
        windowMs: 60000
      })
    );



    app.get("/", (req, res) => {

      res.json({
        message:"success"
      });

    });



    await request(app).get("/");

    await request(app).get("/");


    const response =
      await request(app)
        .get("/");



    expect(response.status)
      .toBe(429);



    expect(response.body.success)
      .toBe(false);


  });


});