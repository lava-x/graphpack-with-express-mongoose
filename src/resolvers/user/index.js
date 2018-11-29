export function getUsers(obj, args, context) {
  const { size, page } = args;
  const SchemaUser = context.mongoose.model('user');
  return SchemaUser.find({});
}

export function getUser(obj, args, context) {
  const SchemaUser = context.mongoose.model('user');
  return SchemaUser.findOne({ _id: args.id });
}

export function getProfile(obj, args, context) {
  return context.user;
}
