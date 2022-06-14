import type {Exact, TokenGroup, MetaTokens, Tokens} from './types';
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

export const breakpoints = tokensToRems(
  breakpointsTokens as unknown as TokenGroup,
);
export const colors = colorsTokens;
export const depth = depthTokens;
export const legacy = tokensToRems(legacyTokens);
export const motion = tokensToRems(motionTokens as unknown as TokenGroup);
export const shape = tokensToRems(shapeTokens as unknown as TokenGroup);
export const spacing = tokensToRems(spacingTokens as unknown as TokenGroup);
export const typography = tokensToRems(
  typographyTokens as unknown as TokenGroup,
);
export const zIndex = zIndexTokens;

export const tokens = createTokens({
  breakpoints,
  colors: colors as unknown as TokenGroup,
  depth: depth as unknown as TokenGroup,
  legacy,
  motion,
  shape,
  spacing,
  typography,
  zIndex: zIndex as unknown as TokenGroup,
});

/**
 * Identity function that simply returns the provided tokens, but additionally
 * validates the input matches the `Tokens` type exactly and infers all members.
 */
function createTokens<T extends Exact<Tokens | MetaTokens, T>>(tokens: T) {
  return tokens;
}
