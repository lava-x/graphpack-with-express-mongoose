import { importSchema } from 'graphql-import';
import gql from 'graphql-tag';
import path from 'path';

const extendTypes = gql`
  extend type Query {
    hello: String!
    testExtendsQuery(text: String!): String!
  }
`;

const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));

// export default typeDefs;
export default [extendTypes, typeDefs];
