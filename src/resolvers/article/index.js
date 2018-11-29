import { getUserId } from 'resolvers/auth';

export function getArticles(obj, args, context) {
  const { size, page } = args;
  const SchemaArticle = context.schemas.article;
  return SchemaArticle.find({});
}

export function getArticleById(obj, args, context) {
  const SchemaArticle = context.schemas.article;
  return SchemaArticle.getData(args.id);
}

export async function createArticle(obj, args, context) {
  const user = context.user;
  const SchemaArticle = context.schemas.article;
  const article = await SchemaArticle.create({
    user: user._id,
    title: args.title,
    body: args.body,
  });
  return SchemaArticle.populate(article, 'user');
}
