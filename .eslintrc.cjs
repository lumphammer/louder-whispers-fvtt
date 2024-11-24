const { id } = require("./public/module.json");

module.exports = {
  extends: ["./packages/shared-fvtt-bits/dotfiles/import/.eslintrc.cjs"],
  ignorePatterns: [".eslintrc.cjs", `src/${id}.js`],
  // add rules changes here
  rules: {},
};
