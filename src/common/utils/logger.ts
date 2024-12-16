import logger from "pino";
import dayjs from "dayjs";

// creates better and understandable console logs in the terminal
// dayjs is for date formatting, pino and pino-pretty to make the console logs more aesthetically pleasing
const log = logger({
  transport: {
    target: "pino-pretty",
  },
  base: {
    pid: false,
  },
  timestamp: () => `, "time":"${dayjs().format()}"`,
});

export default log;
