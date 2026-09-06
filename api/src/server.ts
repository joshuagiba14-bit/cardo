import { createApp } from "./app";
import { env } from "./env";
import { logger } from "./lib/logger";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Cardo API listening on http://localhost:${env.PORT}`);
});
