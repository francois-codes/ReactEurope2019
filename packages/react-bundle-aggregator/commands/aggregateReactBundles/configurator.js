const { resolve } = require("path");
const { REACT_MODULES_FILENAME } = require("./CONSTS");

async function configurator({ cliArgs, cliOptions }) {
  const { directory, yarn, workspace } = cliOptions;

  const reactModules = require(resolve(directory, REACT_MODULES_FILENAME));

  return {
    directory,
    yarn,
    workspace,
    reactModules
  };
}

module.exports = configurator;
