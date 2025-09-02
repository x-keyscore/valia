import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.cjs", format: "cjs" },
      { file: "dist/index.mjs", format: "esm" }
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false
      })
    ],
    external: []
  },
  {
    input: "src/index.ts",
    output: [{ file: "./dist/types.d.ts" }],
    plugins: [dts()]
  }
];