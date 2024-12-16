import mongoose from "mongoose";
import { config } from "../../config/app.config";
import log from "./logger";

async function connect() {
  const dbURI = config.MONGO_URI;

  return mongoose
    .connect(dbURI)
    .then(() => {
      log.info("Connected to DB");
    })
    .catch((error) => {
      log.error("Could not connect to DB");
      process.exit(1);
    });
}

export default connect;
