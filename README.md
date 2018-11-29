# Graphpack with Express and Mongoose Starter

> A `GraphQL Server` starter project with implementatiom of [Graphpack](https://github.com/glennreyes/graphpack), Express, Mongoose, [Passport](http://www.passportjs.org/)

## Install & Usage

There are few things to do before we're getting started

1. Install project dependencies, run the command below:
   ```bash
   yarn
   ```
2. Setup MongoDB for your machine https://docs.mongodb.com/manual/installation/
3. Start MongoDB
4. You are good to go 👍

### Start development server

> To start the development server, simply run:

```bash
yarn dev
```

Simply access graphql server endpoints with http://localhost:4000/graphql (By default). If you would like to configure server port please refer to this [link](https://github.com/glennreyes/graphpack#configure-server-port) or goes to `/graphpack.config.js`

### Run production build

> To create a production-ready build run following command:

```bash
yarn build
```

> The following command will run the build and start the app

```bash
yarn start
```

# Folder Structure

```
/ config
    - default.json
    - local.json
    - production.json
/ src
    / helpers
        - TokenHelper.js
    / libs
        / passport
            / strategies
                - jwt.js
                - local.js
            - index.js
        - mongoose.js
    / models
    / resolvers
    context.js
    schema.graphql
- babel.config.js
- graphpack.config.js
```

- `/config` - place for your config value
- `/src/helpers` - helper file, you can import helper with
  ```js
  import TokenHelper from 'helpers/TokenHelper';
  import yourHelper from 'helpers/yourHelper';
  ```
- `/src/libs` - place for library, you can import your libs with
  ```js
  import Passport from 'libs/Passport';
  import SomeLibrary from 'libs/SomeLibrary';
  ```
- `/src/models` - Mongoose models, for details go to `Getting Started` - `Add Mongoose Model` section
- `/src/resolvers` - GraphQL resolvers, see this [link](https://github.com/glennreyes/graphpack#srcresolversjs-required). <br/>You can import resolvers with
  ```js
  import { isAuthenticated } from 'resolvers/Auth';
  import { getProfile } from 'resolvers/User';
  ```
- `/src/context.js` - see this [link](https://www.apollographql.com/docs/apollo-server/essentials/data.html#context) and [link](https://github.com/glennreyes/graphpack#srccontextjs)
- `/src/schema.graphql` - GraphQL type definitions, see this [Schemas and Types](https://graphql.org/learn/schema/) and [link](https://github.com/glennreyes/graphpack#srcschemagraphql-required)
- `babel.config.js` - To customize babel configuration, see this [link](https://github.com/glennreyes/graphpack#customize-babel-configuration)
- `graphpack.config.js` - To customize webpack configuration, see this [link](https://github.com/glennreyes/graphpack#customize-webpack-configuration)

# Getting Started

## Config

You can modify the config files for different environment like `production` and `development` under folder `/config`, please refer to this [package](https://github.com/lorenwest/node-config) for more details.

1. default.json - value default for `development` and `production`
2. production.json - its for `production` and will be override `default.json` value
3. local.json - for local development, will override `default.json`

## Add Mongoose Model

Create your mongoose model under folder `/src/models`, see http://mongoosejs.com/docs/models.html for more details.

(Optional) In this project, we also included [mongoose-autopopulate](https://github.com/mongodb-js/mongoose-autopopulate) to auto populate field for query.

```js
// --- Example - yourSchema.model.js
const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const { Schema } = mongoose;

var YourSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: 'User is required',
    autopopulate: true, // optional - see mongoose-autopopulate
  },
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});

YourSchema.plugin(autopopulate); // optional - see mongoose-autopopulate

module.exports = mongoose.model('SampleSchema', YourSchema);
```

> Note: Please use `require` for import packages and `module.exports` for exporting your model like example above.

Once you add your model, you are able to access your model in your resolvers. To access your mongoose schemas you can either using `context.schemas` or `context.mongoose.model('SampleSchema')`. Example:

```js
export function someResolver(obj, args, context, info) {
  const YourSchema = context.schemas.yourSchema;
  // or
  const YourSchema = context.mongoose.model('SampleSchema');
  // .... continue your code
}
```

> In above example the `yourSchema` in `context.schemas.yourSchema` is based on your file name. The name will be [camel cased string](https://lodash.com/docs/4.17.11#camelCase).

Example:

1. `test-schema.model.js` will be `testSchema`,
2. `other_schema.model.js` will be `otherSchema`
3. etc

## Authentication

By default, this project will be using [passport-jwt](https://github.com/themikenicholson/passport-jwt) and [passport-local](https://github.com/jaredhanson/passport-local) for authentication. If you would like to know more about `PassportJS` please refer to http://www.passportjs.org/docs/

> You can switch to your preferred authentication other than `passport-jwt` in `/src/context.js` line 17

> If you want to stick back to `passport-jwt` please override `jwt secret` value in `/config` folder

### Add passport strategy

Create your passport strategies under folder `/src/libs/passport/strategies`

Example:

```js
// local.js - under '/src/libs/passport/strategies'
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
```

> Note: Strategy will be auto loaded once you created

### Usage

You can authenticate your user in `resolvers` like example below:

```js
import passport from 'passport';

export async function signin(parent, args, context, info) {
  const { req, res } = context;
  const tokenHelper = context.helpers.token;
  // inject signin params to request body for passport middleware to consume
  Object.assign(req.body, args); // <-- this is the magic
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
```

#### Retrict user to access GraphQL server

You can retirct user to access certian query or mutation with method below

```js
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from 'resolvers/auth';
import { getArticles } from 'resolvers/article';
import { getProfile, getUser } from 'resolvers/user';
import { someResolver } from 'resolvers/blabla';

export default {
  Query: {
    getUser: combineResolvers(isAuthenticated('admin'), getUser), // only user with admin role can access
    profile: combineResolvers(isAuthenticated(['admin', 'user']), getProfile), // user with admin
    someResolver: combineResolvers(isAuthenticated(), someResolver), // default to only user role
    getArticles, // public access
  },
};
```

## Resolvers

You define all your resolvers under `/src/resolvers/index.js`, it will map your resolvers to GraphQL definitions.

Example:

```js
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, signin, signup } from 'resolvers/auth';
import { getArticleById, getArticles, createArticle } from 'resolvers/article';
import { getPost, getPosts, createPost } from 'resolvers/post';
import { getComment, createComment } from 'resolvers/comment';
import { getProfile, getUser, getUsers } from 'resolvers/user';

const resolvers = {
  Query: {
    hello: () => 'world!',
    profile: getProfile,
    getArticle: getArticleById,
    getArticles,
    getPost,
    getPosts,
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
};

export default resolvers;
```

> See this [link](https://github.com/glennreyes/graphpack#srcresolversjs-required) for more details

# Playground

You are able to access graphql playground with url http://localhost:4000/graphql (by default) in development mode.<br />
Just copy below code and paste to your playground and you are good to go

```graphql
query sayHello {
  hello
}

mutation signup {
  signup(name: "Louis Loo", email: "louis@mail.com", password: "somepassword") {
    token
    user {
      _id
      name
      email
    }
  }
}

mutation signin {
  signin(email: "louis@mail.com", password: "somepassword") {
    token
    user {
      _id
      name
      email
    }
  }
}

# ================ admin access
query getUser {
  getUser(id: "5bfee5873ddb10bfac84aa76") {
    _id
    name
    email
    roles
  }
}

query getUsers {
  getUsers {
    _id
    name
    email
    roles
  }
}

# ================ user access
query getLoginProfile {
  profile {
    _id
    name
    email
  }
}

mutation createArticle {
  createArticle(title: "Article 1", body: "article 1 content 1") {
    _id
    user {
      _id
      name
      email
    }
    title
    body
  }
}

mutation createPost {
  createPost(title: "Post 1", content: "post 1 content 1") {
    _id
    user {
      _id
      name
      email
    }
    title
    content
  }
}

mutation createComment {
  createComment(postId: "5bfedd15515d1dbe931cd57c", content: "Comment 1") {
    _id
    user {
      _id
      name
      email
    }
    content
  }
}

# ================ normal access
query sayHello {
  hello
}

query getArticles {
  getArticles(size: 20, page: 1) {
    _id
    user {
      _id
      name
      email
    }
    title
    body
  }
}

query getArticleWithId {
  getArticle(id: "5bfe455e4fdf2bb8131db4b5") {
    _id
    user {
      _id
      name
      email
    }
    title
    body
  }
}

query getPosts {
  getPosts(size: 20, page: 1) {
    _id
    user {
      _id
      name
      email
    }
    title
    content
    comments {
      user {
        name
      }
      content
    }
  }
}

query getPostWithId {
  getPost(id: "5bfedd15515d1dbe931cd57c") {
    _id
    user {
      _id
      name
      email
    }
    title
    content
  }
}

query getPostComments {
  getPostComments(post: "5bfedd15515d1dbe931cd57c", size: 20, page: 1) {
    _id
    user {
      _id
      name
      email
    }
    content
    post
  }
}

query getCommentWithId {
  getComment(id: "5bffa485edf4c8ca4933328a") {
    _id
    user {
      _id
      name
      email
    }
    content
    post
  }
}
```

> Some query or mutation will need authorization, replace `__YOUR_TOKEN__` with your token

```json
{
  "Authorization": "Bearer __YOUR_TOKEN__"
}
```
