import type {Exact} from './types';
import {breakpoints as breakpointsTokens} from './token-groups/breakpoints';
import {depth as depthTokens} from './token-groups/depth';
import {legacy as legacyTokens} from './token-groups/legacy';
import {colors as colorsTokens} from './token-groups/colors';
import {motion as motionTokens} from './token-groups/motion';
import {shape as shapeTokens} from './token-groups/shape';
import {spacing as spacingTokens} from './token-groups/spacing';
import {typography as typographyTokens} from './token-groups/typography';
import {zIndex as zIndexTokens} from './token-groups/zIndex';
import {tokensToRems} from './utilities';

export interface TokenProperties {
  description?: string;
  value: string;
}

export interface TokenGroup {
  [token: string]: TokenProperties;
}

export interface Tokens {
  breakpoints: TokenGroup;
  colors: TokenGroup;
  depth: TokenGroup;
  legacy: TokenGroup;
  motion: TokenGroup;
  shape: TokenGroup;
  spacing: TokenGroup;
  typography: TokenGroup;
  zIndex: TokenGroup;
}

export interface Tokens {
  breakpoints: TokenGroup;
  colors: TokenGroup;
  depth: TokenGroup;
  legacy: TokenGroup;
  motion: TokenGroup;
  shape: TokenGroup;
  spacing: TokenGroup;
  typography: TokenGroup;
  zIndex: TokenGroup;
}

export const breakpoints = tokensToRems(breakpointsTokens);
export const colors = colorsTokens;
export const depth = depthTokens;
export const legacy = tokensToRems(legacyTokens);
export const motion = tokensToRems(motionTokens);
export const shape = tokensToRems(shapeTokens);
export const spacing = tokensToRems(spacingTokens);
export const typography = tokensToRems(typographyTokens);
export const zIndex = zIndexTokens;

export const tokens = createTokens({
  breakpoints,
  colors,
  depth,
  legacy,
  motion,
  shape,
  spacing,
  typography,
  zIndex,
});

/**
 * Identity function that simply returns the provided tokens, but additionally
 * validates the input matches the `Tokens` type exactly and infers all members.
 */
function createTokens<T extends Exact<Tokens, T>>(tokens: T) {
  return tokens;
}
