import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: [],
  },
  {
    input: "src/index.ts",
    output: [{ file: "./dist/types.d.ts", format: "esm" }],
    plugins: [dts()],
},
];