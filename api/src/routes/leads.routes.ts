import { Router, type Request } from "express";
import { Prisma } from "@prisma/client";
import {
  createLeadSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
  type CreateLeadInput,
  type ListLeadsQuery,
} from "@cardo/shared";
import { prisma } from "../lib/prisma";
import { toLeadDTO } from "../lib/mappers";
import { sendOk, paginate } from "../utils/http";
import { AppError } from "../lib/app-error";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import { leadsRateLimiter } from "../middleware/rate-limit";

export const leadsRouter = Router();

/** Public: contact form submission. */
leadsRouter.post("/", leadsRateLimiter, validateBody(createLeadSchema), async (req, res, next) => {
  try {
    const input = req.body as CreateLeadInput;
    const lead = await prisma.lead.create({
      data: {
        name: input.name,
        email: input.email,
        businessName: input.businessName,
        phone: input.phone,
        industry: input.industry,
        monthlyAdBudget: input.monthlyAdBudget,
        currentChannels: input.currentChannels,
        message: input.message,
        source: input.source,
        locale: input.locale,
      },
    });
    sendOk(res, { id: lead.id }, 201);
  } catch (err) {
    next(err);
  }
});

/** Admin only: filtered, paginated lead list. */
leadsRouter.get(
  "/",
  requireAuth,
  validateQuery(listLeadsQuerySchema),
  async (req, res, next) => {
    try {
      const query = (req as Request & { validatedQuery: ListLeadsQuery }).validatedQuery;

      const where: Prisma.LeadWhereInput = {};
      if (query.status) {
        where.status = query.status;
      }
      if (query.from || query.to) {
        where.createdAt = {
          ...(query.from ? { gte: new Date(query.from) } : {}),
          ...(query.to ? { lte: new Date(query.to) } : {}),
        };
      }

      const [items, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (query.page - 1) * query.pageSize,
          take: query.pageSize,
        }),
        prisma.lead.count({ where }),
      ]);

      sendOk(res, paginate(items.map(toLeadDTO), total, query.page, query.pageSize));
    } catch (err) {
      next(err);
    }
  },
);

/** Admin only: update a lead's status. */
leadsRouter.patch("/:id", requireAuth, validateBody(updateLeadSchema), async (req, res, next) => {
  try {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw AppError.notFound("Lead not found");
    }
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
    sendOk(res, toLeadDTO(lead));
  } catch (err) {
    next(err);
  }
});

/** Admin only, admin role only: delete a lead. */
leadsRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw AppError.notFound("Lead not found");
    }
    await prisma.lead.delete({ where: { id: req.params.id } });
    sendOk(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});
