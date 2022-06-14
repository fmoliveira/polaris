import type {Exact} from './types';
import {breakpoints} from './token-groups/breakpoints';
import {depth} from './token-groups/depth';
import {legacy} from './token-groups/legacy';
import {colors} from './token-groups/colors';
import {motion} from './token-groups/motion';
import {shape} from './token-groups/shape';
import {spacing} from './token-groups/spacing';
import {typography} from './token-groups/typography';
import {zIndex} from './token-groups/zIndex';
import {tokensToRems} from './utilities';

export interface TokenProperties {
  description?: string;
  value: string;
}

export interface MetadataTokenGroup {
  [token: string]: TokenProperties;
}

export interface MetadataTokens {
  breakpoints: MetadataTokenGroup;
  colors: MetadataTokenGroup;
  depth: MetadataTokenGroup;
  legacy: MetadataTokenGroup;
  motion: MetadataTokenGroup;
  shape: MetadataTokenGroup;
  spacing: MetadataTokenGroup;
  typography: MetadataTokenGroup;
  zIndex: MetadataTokenGroup;
}

export const metadata = createMetadataTokens({
  breakpoints: tokensToRems(breakpoints),
  colors,
  depth,
  legacy: tokensToRems(legacy),
  motion: tokensToRems(motion),
  shape: tokensToRems(shape),
  spacing: tokensToRems(spacing),
  typography: tokensToRems(typography),
  zIndex,
});

/**
 * Identity function that simply returns the provided tokens, but additionally
 * validates the input matches the `MetadataTokens` type exactly and infers all members.
 */
function createMetadataTokens<T extends Exact<MetadataTokens, T>>(tokens: T) {
  return tokens;
}
