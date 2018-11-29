import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, signin, signup } from 'resolvers/auth';
import { getArticleById, getArticles, createArticle } from 'resolvers/article';
import { getPost, getPosts, createPost } from 'resolvers/post';
import { getPostComments, getComment, createComment } from 'resolvers/comment';
import { getProfile, getUser, getUsers } from 'resolvers/user';

const resolvers = {
  Query: {
    hello: () => 'world!',
    profile: getProfile,
    getArticle: getArticleById,
    getArticles,
    getPost,
    getPosts,
    getPostComments,
    getComment,
    getUser: combineResolvers(isAuthenticated('admin'), getUser),
    getUsers: combineResolvers(isAuthenticated('admin'), getUsers),
  },
  Mutation: {
    createArticle: combineResolvers(isAuthenticated(), createArticle),
    createPost: combineResolvers(isAuthenticated(), createPost),
    createComment: combineResolvers(isAuthenticated(), createComment),
    signin,
    signup,
  },
  Post: {
    comments: function(obj, args, context, info) {
      return context.schemas.comment.find({ post: obj._id });
    },
  },
};

export default resolvers;
