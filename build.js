#!/usr/bin/env node
/** @import {BuildOptions} from "lwe8-build" */
import { build } from "lwe8-build";

await (async () => {
  /**
   * @type {BuildOptions}
   */
  const options = {
    format: ["esm"],
    indexFile: {
      path: "./src/index.ts",
      lines: 4,
    },
    outputDirs: {
      esm: "./dist",
    },
    otherFiles: [
      {
        path: "./src/shiki.ts",
        removeExport: true,
      },
      {
        path: "./src/types.ts",
      },
      {
        path: "./src/matter.ts",
        line: 1,
        removeExport: true,
      },
    ],
  };

  await build(options);
})();
