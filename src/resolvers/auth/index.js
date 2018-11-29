import bcrypt from 'bcryptjs';
import passport from 'passport';
import { skip } from 'graphql-resolvers';
import _ from 'lodash';

/**
 * ========== Check whether user authenticated
 * @param {string / array} roles
 */
export const isAuthenticated = (roles = ['user']) => {
  return (root, args, context, info) => {
    if (!context.user) {
      return new Error('Not authenticated');
    }
    const currentRole = context.user.roles;
    let userRoles = ['user'];
    if (_.isString(roles)) {
      userRoles = [roles];
    }
    if (_.isArray(roles) && roles.length > 0) {
      userRoles = roles;
    }
    // check whether user has role in order to proceed
    if (_.intersection(userRoles, currentRole).length === 0) {
      return new Error("Don't have permission");
    }
    return skip;
  };
};

// ========== Sign Up
export async function signup(parent, args, context, info) {
  const UserSchema = context.schemas.user;
  const tokenHelper = context.helpers.token;
  const password = await bcrypt.hash(args.password, 10);
  const user = await UserSchema.create({
    ...args,
    password,
  });
  const token = tokenHelper.sign({ userId: user._id, name: user.name });
  return {
    token,
    user,
  };
}

// ========== Sign In
export async function signin(parent, args, context, info) {
  const { req, res } = context;
  const tokenHelper = context.helpers.token;
  // inject signin params to request body for passport middleware to consume
  Object.assign(req.body, args);
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return reject(info ? info.message : 'Login failed');
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return reject(err);
        }
        const token = tokenHelper.sign({ userId: user._id, name: user.name });
        return resolve({
          token,
          user,
        });
      });
    })(req, res);
  });
}
