const installDependencies = require("./installDependencies");
const renderReactEntryPoint = require("./renderReactEntryPoint");

const steps = [installDependencies, renderReactEntryPoint];

module.exports = steps;
