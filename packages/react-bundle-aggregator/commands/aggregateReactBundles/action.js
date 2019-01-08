const prerequisitesChecker = require("./prerequisitesChecker");
const configurator = require("./configurator");
const steps = require("./steps");

const action = {
  name: "Prepare react entry point",
  startMessage: "",
  prerequisitesChecker,
  configurator,
  steps
};

module.exports = action;
