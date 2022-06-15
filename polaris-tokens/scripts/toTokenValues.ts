import fs from 'fs';
import path from 'path';

import glob from 'glob';

import {toRem, Tokens, TokenGroup} from '../src';

const sourceDir = '../src/token-groups';
const outputDir = path.join(__dirname, '../src/token-values');

const tokensToUseRem = [
  'breakpoints',
  'legacy',
  'motion',
  'shape',
  'spacing',
  'typography',
];

function getFileName(fileName: string) {
  return path.join(outputDir, fileName);
}

function processTokens(tokens: Tokens) {
  return Object.fromEntries(
    Object.entries(tokens).map(([token, tokenGroup]: [string, TokenGroup]) => {
      let transforms;
      if (tokensToUseRem.includes(token)) {
        transforms = [toRem];
      }

      return [token, getValues(tokenGroup, transforms)];
    }),
  );
}

function getValues(
  tokenGroup: TokenGroup,
  transforms?: ((value: string) => string | undefined)[],
) {
  return Object.fromEntries(
    Object.entries(tokenGroup).map(([token, properties]) => [
      token,
      transforms
        ? transforms.reduce((val, fn) => fn(val) || '', properties.value)
        : properties.value,
    ]),
  );
}

export async function toTokenValues() {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, {recursive: true});
  }

  const tokenFiles = glob.sync(`${sourceDir}/**/*.ts`, {cwd: __dirname});
  tokenFiles.forEach(async (tokenFile) => {
    const tokenGroup = await import(tokenFile);
    const tokenGroupName = path.basename(tokenFile, '.ts');
    const fileName = getFileName(`${tokenGroupName}.js`);

    await fs.promises.writeFile(
      fileName,
      JSON.stringify(processTokens(tokenGroup)),
    );
  });
}
