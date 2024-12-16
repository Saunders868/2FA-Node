import { v4 as uuidv4 } from "uuid";

export function generateUniqueCode() {
  return uuidv4().replace(/-/g, "").substring(0, 25);
}

export const thirtyDaysFromNow = (): Date =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const fortyFiveMinutesFromNow = (): Date => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 45);
    return now;
  };