import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

const app = createApp();

const credentials = { email: "staffer@cardo.agency", password: "GoodPassword123!" };

describe("Auth flow", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    const passwordHash = await bcrypt.hash(credentials.password, 10);
    await prisma.user.create({
      data: { email: credentials.email, passwordHash, role: "staff" },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("rejects a bad password without leaking whether the email exists", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: credentials.email, password: "WrongPassword!" });

    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
    expect(res.body.error.message).toBe("Invalid email or password");
  });

  it("rejects an unknown email with the same message as a bad password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@cardo.agency", password: "WrongPassword!" });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password");
  });

  it("validates the request body before hitting the database", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("bad_request");
  });

  it("logs in with correct credentials and sets an httpOnly session cookie", async () => {
    const res = await request(app).post("/api/auth/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.email).toBe(credentials.email);
    expect(res.body.data.role).toBe("staff");
    expect(res.body.data).not.toHaveProperty("passwordHash");

    const cookieHeader = res.headers["set-cookie"]?.[0] ?? "";
    expect(cookieHeader).toContain("cardo_session=");
    expect(cookieHeader.toLowerCase()).toContain("httponly");
  });

  it("allows access to /auth/me only with a valid session cookie", async () => {
    const anonRes = await request(app).get("/api/auth/me");
    expect(anonRes.status).toBe(401);

    const loginRes = await request(app).post("/api/auth/login").send(credentials);
    const cookies = loginRes.headers["set-cookie"];

    const meRes = await request(app).get("/api/auth/me").set("Cookie", cookies);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(credentials.email);
  });

  it("clears the session cookie on logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.data.loggedOut).toBe(true);
    const cookieHeader = res.headers["set-cookie"]?.[0] ?? "";
    expect(cookieHeader).toContain("cardo_session=;");
  });
});
