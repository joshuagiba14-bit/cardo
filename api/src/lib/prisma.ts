import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __cardoPrisma: PrismaClient | undefined;
}

/** Reused across hot reloads in dev so we don't exhaust Postgres connections. */
export const prisma = global.__cardoPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__cardoPrisma = prisma;
}
