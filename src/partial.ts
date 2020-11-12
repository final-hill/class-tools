/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import assert from './lib/assert';

const _ = Symbol('no argument');

/**
 * Converts the associated method into a partially applied method
 *
 * @param {Record<PropertyKey, any> | Function} target - The constructor of the class if applied to a static member. Otherwise the prototype
 * @param {PropertyKey} _propertyKey - The name of the member
 * @param {PropertyDecorator} descriptor - The property descriptor of the class feature
 */
function partial(
    target: Record<PropertyKey, any> | ((...args: any[]) => any), _propertyKey: PropertyKey, descriptor: PropertyDescriptor
): void {
    assert(typeof descriptor.value == 'function', '@partial can only be applied to methods');

    const _originalFn: (...args: any[]) => any = descriptor.value;

    /**
     * Performs the actual accumulation
     * @param {any[]} args - The new arguments
     * @param {any[]} savedArgs - The arguments thus far
     * @param {number} remainingCount - The number of arguments expected
     * @returns {any} - The result or a partially applied function expecting the remaining arguments
     */
    function accumulator(args: any[], savedArgs: any[], remainingCount: number): any {
        assert(args.length == remainingCount, `${remainingCount} arguments expected. ${args.length} provided.`);

        const newRemainingCount = args.reduce(
                ((sum, arg) => arg !== _ ? sum - 1 : sum),
                remainingCount
            ),
            argClone = [...args],
            newSavedArgs = savedArgs.map(arg => {
                if(arg === _) {
                    return argClone.shift();
                } else {
                    return arg;
                }
            });

            if(newRemainingCount === 0) {
                return _originalFn.apply(target, newSavedArgs);
            } else {
                return (...args: any[]): any => accumulator(args, newSavedArgs, newRemainingCount);
            }
    }

    const initialArgs = Array.from({length:_originalFn.length},() => _);
    descriptor.value = accumulator(initialArgs, initialArgs, _originalFn.length);
}

export {partial,_};
export default partial;