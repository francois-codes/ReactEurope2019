const action = require("./action");

const command = {
  syntax: "prepare",
  options: [
    ["-d, --directory [directory]", "root directory of the react entry point"],
    ["-y, --yarn", "Will use yarn if this flag is set"],
    [
      "-w, --workspace",
      "Toggle this flag if the directory is the root of a yarn workspace"
    ]
  ],
  action
};

module.exports = command;
