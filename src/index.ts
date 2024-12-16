import "dotenv/config";
import { config } from "./config/app.config";
import createServer from "./common/utils/server";
import log from "./common/utils/logger";
import connect from "./common/utils/connect";

const app = createServer();

app.listen(config.PORT, async () => {
  log.info(`server running on port ${config.PORT}`);

  await connect();
});
