export function getPosts(obj, args, context) {
  const { size, page } = args;
  const SchemaPost = context.schemas.post;
  return SchemaPost.find({});
}

export function getPost(obj, args, context) {
  const SchemaPost = context.schemas.post;
  return SchemaPost.findById(args.id);
}

export async function createPost(obj, args, context) {
  const SchemaPost = context.schemas.post;
  const user = context.user;
  const post = await SchemaPost.create({
    user: user._id,
    title: args.title,
    content: args.content,
  });
  return SchemaPost.populate(post, 'user');
}
