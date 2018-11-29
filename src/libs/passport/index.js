export default (schemas) => {
  // initialize available strategies under folder `strategies`
  const req = require.context('./strategies', true, /\.js$/);
  req.keys().forEach((filepath) => {
    const fileName = filepath.replace(/^.*(\\|\/|\|js|:)/, '');
    const strategyNane = fileName.split('.')[0];
    require(`./strategies/${fileName}`).default(schemas);
    console.log(`passport strategy '${strategyNane}' is registered`);
  });
};
