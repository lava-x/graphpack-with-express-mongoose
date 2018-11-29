import config from 'config';
import passport from 'passport';
import passportJWT from 'passport-jwt';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

export default (schemas) => {
  // see https://github.com/themikenicholson/passport-jwt for options
  const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.token.secret,
    jsonWebTokenOptions: config.token.verify || {},
  };
  passport.use(
    new JWTStrategy(options, async (payload, done) => {
      try {
        const user = await schemas.user.findById(payload.userId);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
