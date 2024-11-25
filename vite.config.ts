import { createFvttViteConfig } from "./packages/shared-fvtt-bits/dotfiles/import/createFvttViteConfig";
import { id as foundryPackageId } from "./public/module.json";

const config = createFvttViteConfig({
  foundryPackageId,
  packageType: "module",
  importMetaUrl: import.meta.url,
  sourceMap: true,
});

export default config;
