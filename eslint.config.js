import { defineConfig } from "eslint/config";

import sharedConfig from "@lumphammer/shared-fvtt-bits/dotfiles/import/eslint.core.config.js";
/** @type {import('eslint').Linter.Config[]} */
const config = defineConfig([sharedConfig]);

export default config;
