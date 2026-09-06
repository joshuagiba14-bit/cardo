import { Router } from "express";
import { createOfferingSchema, updateOfferingSchema } from "@cardo/shared";
import { prisma } from "../lib/prisma";
import { toOfferingDTO } from "../lib/mappers";
import { sendOk } from "../utils/http";
import { AppError } from "../lib/app-error";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

export const offeringsRouter = Router();

/** Public: active offerings only. Signed-in staff/admin also see inactive ones. */
offeringsRouter.get("/", optionalAuth, async (req, res, next) => {
  try {
    const offerings = await prisma.offering.findMany({
      where: req.user ? {} : { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    sendOk(res, offerings.map(toOfferingDTO));
  } catch (err) {
    next(err);
  }
});

offeringsRouter.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const offering = await prisma.offering.findFirst({
      where: req.user ? { slug: req.params.slug } : { slug: req.params.slug, isActive: true },
    });
    if (!offering) {
      throw AppError.notFound("Offering not found");
    }
    sendOk(res, toOfferingDTO(offering));
  } catch (err) {
    next(err);
  }
});

/** Admin only: manage the service line-up. */
offeringsRouter.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validateBody(createOfferingSchema),
  async (req, res, next) => {
    try {
      const offering = await prisma.offering.create({ data: req.body });
      sendOk(res, toOfferingDTO(offering), 201);
    } catch (err) {
      next(err);
    }
  },
);

offeringsRouter.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validateBody(updateOfferingSchema),
  async (req, res, next) => {
    try {
      const existing = await prisma.offering.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        throw AppError.notFound("Offering not found");
      }
      const offering = await prisma.offering.update({
        where: { id: req.params.id },
        data: req.body,
      });
      sendOk(res, toOfferingDTO(offering));
    } catch (err) {
      next(err);
    }
  },
);

offeringsRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const existing = await prisma.offering.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw AppError.notFound("Offering not found");
    }
    await prisma.offering.delete({ where: { id: req.params.id } });
    sendOk(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});
