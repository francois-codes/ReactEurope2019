const R = require("ramda");
const logger = require("cli-task-runner/utils/logger");
const renderFile = require("cli-task-runner/utils/render");
const { resolve } = require("path");

function assignModuleName(reactModule) {
  return R.compose(
    R.assoc("moduleName", R.__, reactModule),
    R.join(""),
    R.map(
      R.compose(
        R.join(""),
        R.juxt([
          R.compose(
            R.toUpper,
            R.head
          ),
          R.tail
        ])
      )
    ),
    R.split("-"),
    R.prop("package")
  )(reactModule);
}

async function run(config) {
  const { directory, reactModules } = config;

  const templatePath = resolve(__dirname, "index.js.ejs");
  const filePath = resolve(directory, "index.js");
  const data = {
    reactModules: R.map(assignModuleName, reactModules)
  };

  try {
    await renderFile(templatePath, filePath, data);
  } catch (e) {
    logger.error(e.message || "Something went wrong", e);
  }
}

const renderReactentryPointStep = {
  start: "Rendering react entry point",
  run,
  error: "Could not render React entry point",
  completion: "React entry point rendered !"
};

module.exports = renderReactentryPointStep;
