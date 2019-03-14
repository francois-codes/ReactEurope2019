const R = require("ramda");
const shell = require("cli-task-runner/utils/shell");
const logger = require("cli-task-runner/utils/logger");

async function run(config) {
  const { reactModules, directory, yarn, workspace } = config;

  const installer = yarn ? `yarn ${workspace ? "-W" : ""} add` : "npm install";

  const command = R.compose(
    R.concat(installer),
    R.reduce(R.concat, ""),
    R.map(
      R.compose(
        R.concat(" "),
        R.join("@"),
        R.values,
        R.omit(["moduleName"])
      )
    )
  )(reactModules);

  try {
    const stdout = await shell.exec(command, { cwd: directory });
    logger.log(stdout);
  } catch (e) {
    logger.error(e.message || "Something went wrong", e);
    throw new Error("could not install dependencies");
  }
}

const installDependenciesStep = {
  start: "Installing dependencies",
  run,
  error: "Could not install dependencies",
  completion: "dependencies installed !"
};

module.exports = installDependenciesStep;
