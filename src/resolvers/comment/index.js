export function getPostComments(obj, args, context) {
  const SchemaComment = context.schemas.comment;
  return SchemaComment.find({ post: args.post });
}

export function getComment(obj, args, context) {
  const SchemaComment = context.schemas.comment;
  return SchemaComment.findById(args.id);
}

export async function createComment(obj, args, context) {
  const SchemaComment = context.schemas.comment;
  const user = context.user;
  const comment = await SchemaComment.create({
    user: user._id,
    post: args.postId,
    content: args.content,
  });
  return SchemaComment.populate(comment, 'user');
}
