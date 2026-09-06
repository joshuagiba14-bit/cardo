import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const app = createApp();

const validLead = {
  name: "Marc Tremblay",
  email: "marc@plomberietremblay.ca",
  businessName: "Plomberie Tremblay",
  phone: "5145551234",
  industry: "trades",
  monthlyAdBudget: "1000_2500",
  currentChannels: ["google_ads"],
  message: "Intéressé par une gestion Google Ads.",
  locale: "fr",
};

async function createAdminSession() {
  const passwordHash = await bcrypt.hash("TestPassword123!", 10);
  await prisma.user.create({
    data: { email: "admin-test@cardo.agency", passwordHash, role: "admin" },
  });
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin-test@cardo.agency", password: "TestPassword123!" });
  const cookie = res.headers["set-cookie"];
  return Array.isArray(cookie) ? cookie : [cookie as unknown as string];
}

describe("Lead flow", () => {
  beforeEach(async () => {
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("rejects a submission missing required fields", async () => {
    const res = await request(app).post("/api/leads").send({ name: "A" });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe("bad_request");
    expect(res.body.error.fields.length).toBeGreaterThan(0);
  });

  it("rejects an invalid email", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({ ...validLead, email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(
      res.body.error.fields.some((f: { path: string }) => f.path === "email"),
    ).toBe(true);
  });

  it("accepts a valid submission and persists it with status 'new'", async () => {
    const res = await request(app).post("/api/leads").send(validLead);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.id).toBeTruthy();

    const stored = await prisma.lead.findUnique({ where: { id: res.body.data.id } });
    expect(stored).not.toBeNull();
    expect(stored?.status).toBe("new");
    expect(stored?.email).toBe(validLead.email);
  });

  it("blocks anonymous access to the admin lead list", async () => {
    const res = await request(app).get("/api/leads");
    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it("lets a signed-in admin list and filter leads", async () => {
    await request(app).post("/api/leads").send(validLead);
    await request(app)
      .post("/api/leads")
      .send({ ...validLead, email: "second@lead.ca", status: "won" });

    const cookies = await createAdminSession();

    const listRes = await request(app).get("/api/leads").set("Cookie", cookies);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(listRes.body.data).toHaveProperty("total");
    expect(listRes.body.data).toHaveProperty("page");

    const filteredRes = await request(app)
      .get("/api/leads?status=new")
      .set("Cookie", cookies);
    expect(filteredRes.status).toBe(200);
    for (const item of filteredRes.body.data.items) {
      expect(item.status).toBe("new");
    }
  });

  it("lets a signed-in admin update a lead's status", async () => {
    const createRes = await request(app).post("/api/leads").send(validLead);
    const cookies = await createAdminSession();

    const patchRes = await request(app)
      .patch(`/api/leads/${createRes.body.data.id}`)
      .set("Cookie", cookies)
      .send({ status: "contacted" });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe("contacted");
  });
});
