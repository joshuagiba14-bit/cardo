import { Router } from "express";
import { leadsRouter } from "./leads.routes";
import { offeringsRouter } from "./offerings.routes";
import { caseStudiesRouter } from "./case-studies.routes";
import { authRouter } from "./auth.routes";

export const apiRouter = Router();

apiRouter.use("/leads", leadsRouter);
apiRouter.use("/offerings", offeringsRouter);
apiRouter.use("/case-studies", caseStudiesRouter);
apiRouter.use("/auth", authRouter);
