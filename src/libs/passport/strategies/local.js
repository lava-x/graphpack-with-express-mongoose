import config from 'config';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';

const LocalStrategy = passportLocal.Strategy;

export default (schemas) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await schemas.user.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: 'Please enter a valid email and password',
            });
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          return done(null, user, {
            message: 'Logged In Successfully',
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
