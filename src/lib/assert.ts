/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Constructor } from '../typings/Constructor';
import AssertionError from './AssertionError';

/**
 * Tests the provided condition. If the condition is false an AssertionError is raised with an optional message.
 * If the provided condition is true, then the function returns without raising an error
 *
 * @param {boolean} condition - The condition to test
 * @param {string} message - A descriptive message to associate with the AssertionError
 * @param {Constructor<Error>} ErrorConstructor - The constructor of the Error to use
 * @throws {Error} - When the condition is false
 * @see AssertionError
 * @throws {AssertionError} - Throws an AssertionError by default if the condition is false
 */
export default function assert(condition: unknown, message = 'Assertion failed', ErrorConstructor: Constructor<Error> = AssertionError): asserts condition {
    if(Boolean(condition) == false) {
        throw new ErrorConstructor(message);
    }
}