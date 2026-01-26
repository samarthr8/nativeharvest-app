const request = require("supertest");
const express = require("express");

const app = require("../src/app"); // IMPORTANT: app must be exported

describe("Backend health check", () => {
  it("GET /health should return OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});

