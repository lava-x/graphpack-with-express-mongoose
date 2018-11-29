const express = require('express');
const passport = require('passport');

module.exports = (mode) => {
  const IS_DEV = mode !== 'production';
  const app = express();

  // middleware
  app.use(passport.initialize()); // initialize passport - see http://www.passportjs.org/docs/configure/ Middleware section

  return {
    server: {
      port: 4000,
      introspection: IS_DEV,
      playground: IS_DEV,
      applyMiddleware: {
        app,
        path: '/graphql', // default
      },
    },
  };
};
