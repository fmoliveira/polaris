import fs from 'fs';
import path from 'path';

import {createFilter} from '@rollup/pluginutils';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import virtual from '@rollup/plugin-virtual';
import glob from 'glob';

import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const tokenGroupsBasePath = path.resolve('src/token-groups');
const tokenGroupsPaths = glob.sync(path.join(tokenGroupsBasePath, '*.ts'));
const tokens = [];
const tokenGroups = [];

tokenGroupsPaths.forEach((filename) => {
  const tokenGroup = fs.readFileSync(filename, 'utf8');
  const exportName = filename
    .replace(`${tokenGroupsBasePath}/`, '')
    .replace('.ts', '');

  tokens.push(tokenGroup);
  tokenGroups.push(exportName);
});

const metadataContent = `
${tokens.join('\n')}
`.trim();
const metadataTypes = `
declare const metadata: MetaTokens;
export default metadata;
`;

/**
 * A rollup plugin that strips the metadata from the token files.
 */
function removeMetadata({include, exclude} = {}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'remove-metadata',
    transform(code, id) {
      if (!filter(id)) return null;

      const transforms = [
        [/\s+description:\s+'.*'/gm, ''],
        [/{\s+value:\s+('.*')[\s,]+}/gm, '$1'],
      ];

      const result = transforms.reduce(
        (str, [regex, subst]) => str.replace(regex, subst),
        code,
      );

      return {code: result, map: {mappings: ''}};
    },
  };
}

function addMetadataExport({include, exclude} = {}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'add-metadata-export',
    transform(code, id) {
      if (!filter(id)) return null;
      const metadataExport = `export * as metadata from 'metadata';`;
      return {code: code.concat(metadataExport), map: {mappings: ''}};
    },
    buildEnd() {
      const typesPath = path.resolve('dist/types/index.d.ts');
      const source = fs.readFileSync(typesPath, 'utf-8');
      fs.writeFileSync(typesPath, source.concat(metadataTypes));
    },
  };
}

/**
 * @type {import('rollup').RollupOptions}
 */
const rollupOptions = [
  {
    input: 'src/index.ts',
    output: [
      {
        format: /** @type {const} */ ('cjs'),
        entryFileNames: '[name][assetExtname].js',
        dir: path.dirname(pkg.main),
        preserveModules: true,
      },
      {
        format: /** @type {const} */ ('es'),
        entryFileNames: '[name][assetExtname].mjs',
        dir: path.dirname(pkg.module),
        preserveModules: true,
      },
    ],
    plugins: [
      virtual({
        metadata: metadataContent,
      }),
      // Allows node_modules resolution
      nodeResolve({extensions}),
      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs(),
      // Compile TypeScript/JavaScript files
      babel({
        extensions,
        rootMode: 'upward',
        include: ['src/**/*'],
        babelHelpers: 'bundled',
      }),
      removeMetadata({include: 'src/token-groups/**/*.ts'}),
      addMetadataExport({include: 'src/index.ts'}),
    ],
    external: [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ],
  },
];

// eslint-disable-next-line import/no-default-export
export default rollupOptions;
