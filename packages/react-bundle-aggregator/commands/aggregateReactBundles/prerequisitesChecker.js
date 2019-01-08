const { stat } = require("fs");
const { promisify } = require("util");
const { resolve } = require("path");
const logger = require("cli-task-runner/utils/logger");
const { REACT_MODULES_FILENAME } = require("./CONSTS");

const statAsync = promisify(stat);

async function prerequisitesChecker({ cliArgs, cliOptions }) {
  const { directory } = cliOptions;

  try {
    const stats = await statAsync(resolve(directory, REACT_MODULES_FILENAME));

    if (!stats.isFile()) {
      throw new Error(`reactModules.json file missing in ${directory}`);
    }
  } catch (e) {
    logger.error(e.message || "Something wrong happened", e);
  }

  return true;
}

module.exports = prerequisitesChecker;
