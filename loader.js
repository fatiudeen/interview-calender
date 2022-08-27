/* eslint-disable import/no-extraneous-dependencies */
import {
  resolve as resolveTs,
  getFormat,
  transformSource,
  load,
} from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';
import { pathToFileURL } from 'url';

export { getFormat, transformSource, load };

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

export function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier);
  if (mappedSpecifier) {
    specifier = `${pathToFileURL(mappedSpecifier)}.js`;
  }
  return resolveTs(specifier, context, defaultResolver);
}
