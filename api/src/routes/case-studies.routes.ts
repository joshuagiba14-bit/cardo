import { Router } from "express";
import { createCaseStudySchema, updateCaseStudySchema } from "@cardo/shared";
import { prisma } from "../lib/prisma";
import { toCaseStudyDTO } from "../lib/mappers";
import { sendOk } from "../utils/http";
import { AppError } from "../lib/app-error";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

export const caseStudiesRouter = Router();

/** Public: published case studies only. Signed-in staff/admin also see drafts. */
caseStudiesRouter.get("/", optionalAuth, async (req, res, next) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: req.user ? {} : { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    sendOk(res, caseStudies.map(toCaseStudyDTO));
  } catch (err) {
    next(err);
  }
});

caseStudiesRouter.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const caseStudy = await prisma.caseStudy.findFirst({
      where: req.user
        ? { slug: req.params.slug }
        : { slug: req.params.slug, isPublished: true },
    });
    if (!caseStudy) {
      throw AppError.notFound("Case study not found");
    }
    sendOk(res, toCaseStudyDTO(caseStudy));
  } catch (err) {
    next(err);
  }
});

/** Admin only: manage case studies. */
caseStudiesRouter.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validateBody(createCaseStudySchema),
  async (req, res, next) => {
    try {
      const input = { ...req.body } as Record<string, unknown>;
      if (input.publishedAt) {
        input.publishedAt = new Date(input.publishedAt as string);
      }
      const caseStudy = await prisma.caseStudy.create({ data: input as never });
      sendOk(res, toCaseStudyDTO(caseStudy), 201);
    } catch (err) {
      next(err);
    }
  },
);

caseStudiesRouter.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validateBody(updateCaseStudySchema),
  async (req, res, next) => {
    try {
      const existing = await prisma.caseStudy.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        throw AppError.notFound("Case study not found");
      }
      const input = { ...req.body } as Record<string, unknown>;
      if (input.publishedAt) {
        input.publishedAt = new Date(input.publishedAt as string);
      }
      const caseStudy = await prisma.caseStudy.update({
        where: { id: req.params.id },
        data: input as never,
      });
      sendOk(res, toCaseStudyDTO(caseStudy));
    } catch (err) {
      next(err);
    }
  },
);

caseStudiesRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const existing = await prisma.caseStudy.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw AppError.notFound("Case study not found");
    }
    await prisma.caseStudy.delete({ where: { id: req.params.id } });
    sendOk(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});
