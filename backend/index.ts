import "reflect-metadata";
import dotenv from "dotenv";
import { main } from "./src/main";
import { logger } from "./src/logger/logger";

dotenv.config();

main()
  .then(() => logger.info("Application started"))
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
