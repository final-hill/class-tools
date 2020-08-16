/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';

const assert: Contracts['assert'] = new Contracts(true).assert;

/**
 * Converts the associated method into a curried method
 *
 * @param {Record<PropertyKey, any> | Function} target - The constructor of the class if applied to a static member. Otherwise the prototype
 * @param {PropertyKey} _propertyKey - The name of the member
 * @param {PropertyDecorator} descriptor - The property descriptor of the class feature
 */
function curry(
    target: Record<PropertyKey, any> | ((...args: any[]) => any), _propertyKey: PropertyKey, descriptor: PropertyDescriptor
): void {
    assert(typeof descriptor.value == 'function', '@curry can only be applied to methods');

    const _originalFn: (...args: any[]) => any = descriptor.value;

    /**
     * Performs the actual currying
     * @param {any[]} args - The new arguments
     * @param {any[]} savedArgs - The arguments thus far
     * @param {number} remainingCount - The number of arguments expected
     * @returns {any} - The result or a curried function expecting the remaining arguments
     */
    function accumulator(args: any[], savedArgs: any[], remainingCount: number): any {
        assert(args.length <= remainingCount, 'Too many arguments');
        const newRemainingCount = remainingCount - args.length,
              newSavedArgs = [...savedArgs, ...args];
        if(newRemainingCount === 0) {
            return _originalFn.apply(target, newSavedArgs);
        } else {
            return (...args: any[]): any => accumulator(args,newSavedArgs, newRemainingCount);
        }
    }

    descriptor.value = accumulator([], [], _originalFn.length);
}

export default curry;