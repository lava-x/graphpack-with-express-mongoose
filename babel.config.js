const path = require('path');

module.exports = (api) => {
  // Cache the returned value forever and don't call this function again
  api.cache(true);

  return {
    presets: ['graphpack/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            models: './src/models',
            helpers: './src/helpers',
            libs: './src/libs',
            resolvers: './src/resolvers',
            schema: './src/schema',
          },
        },
      ],
    ],
  };
};
