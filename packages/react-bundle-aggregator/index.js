#!/usr/bin/env node

const runCLI = require("cli-task-runner");
const { version, name } = require("./package.json");

const commands = require("./commands");

runCLI(commands, name, version);
