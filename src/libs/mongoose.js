import mongoose from 'mongoose';
import config from 'config';
import _ from 'lodash';

// register mongoose models
const registerSchemas = () => {
  let schemas = {};
  const req = require.context('../models', true, /\.js$/);
  req.keys().forEach((filepath) => {
    const fileName = filepath.replace(/^.*(\\|\/|\|js|:)/, '');
    const schemaName = _.camelCase(fileName.split('.')[0]);
    if (!schemas[schemaName]) {
      schemas[schemaName] = require(`../models/${fileName}`);
      console.log(`Mongoose model '${schemaName}' is registered`);
    } else {
      console.log(`Mongoose model '${schemaName}' already existed`);
    }
  });
  return schemas;
};

// mongoose options - see https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect
const options = {
  useNewUrlParser: true,
};

export default () => {
  // establish mongodb connection - see https://mongoosejs.com/docs/connections.html
  mongoose.connect(
    config.mongodb,
    options
  );
  mongoose.Promise = global.Promise;
  // see https://github.com/Automattic/mongoose/issues/6890
  mongoose.set('useCreateIndex', true);

  // register mongoose schema
  const schemas = registerSchemas();
  return {
    instance: mongoose,
    schemas,
  };
};
