import passport from "passport";
import { setupJwtStrategy } from "../common/strategy/jwt.strategy";

const initalizePassport = () => {
  setupJwtStrategy(passport);
};

initalizePassport();

export default passport;
