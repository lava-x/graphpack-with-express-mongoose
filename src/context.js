import config from 'config';
import passport from 'passport';
import TokenHelper from 'helpers/TokenHelper';
import mongoose from 'libs/mongoose';
import initalizePassport from 'libs/passport';

// establish moongoose connection
const { schemas, instance } = mongoose();
const token = config.token;
const tokenHelper = new TokenHelper(token.secret, token.jwt);
// initialize passport with strategies
initalizePassport(schemas);

const context = async ({ req, res }) => {
  return new Promise((resolve) => {
    // verify jwt token from header and extract user info from token
    passport.authenticate('jwt', { session: false }, (err, user) => {
      // return contextual information for resolvers
      resolve({
        req,
        res,
        user, // user info
        config, // values from config file
        schemas, // mongoose model with file name - e.g: user, article
        mongoose: instance, // moongose instance
        helpers: {
          token: tokenHelper,
        },
      });
    })(req, res);
  });
};

export default context;
