/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import assert from './assert';
import AssertionError from './AssertionError';

describe('assertion test', () => {
    test('assert',() => {
        expect(() => assert(true)).not.toThrow();
        expect(() => assert(false)).toThrow(AssertionError);
        expect(() => assert(false,'I am error')).toThrow('I am error');
        expect(() => assert(false,'I am error', TypeError)).toThrow(TypeError);
    });
});