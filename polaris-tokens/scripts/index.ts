import {tokens} from '../src';

import {toTokenValues} from './toTokenValues';
import {toJSON} from './toJSON';
import {toStyleSheet} from './toStyleSheet';

// Create temp token group files

// Split tokens and metadata

// Convert tokens to REMs

// Output to src (ignore token output)

// Build JS

// Build types

// Build assets

(async () => {
  await Promise.all([
    toTokenValues(),
    // toJSON(tokens),
    // toStyleSheet(tokens)
  ]);
})();
