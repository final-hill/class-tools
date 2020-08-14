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
 * @param {PropertyKey} _propertyKey - The name of the memebr
 * @param {PropertyDecorator} descriptor - The property descriptor of the cleass feature
 */
function curry(
    target: Record<PropertyKey, any> | ((...args: any[]) => any), _propertyKey: PropertyKey, descriptor: PropertyDescriptor
): void {
    assert(typeof typeof descriptor.value == 'function', '@curry can only be applied to methods');

    const originalFn: (...args: any[]) => any = descriptor.value,
          n = originalFn.length,
     savedArgs: any[] = [];

    /**
     *
     * @param {any[]} moreArgs
     * @param {any[]} savedArgs
     * @param {number} n
     */
    function accumulator(moreArgs: any[], savedArgs: any[], n: number): any {
        const savedPrev = [...moreArgs],
              nPrev = n;
        savedArgs.push(...moreArgs);
        n -= moreArgs.length;
        if(n - moreArgs.length <= 0) {
            const result = originalFn.apply(target,savedArgs);
            [savedArgs, n] = [savedPrev, nPrev];

            return result;
        } else {
            return (...args: any[]): any => accumulator(args, [...savedArgs], n);
        }
    }

    descriptor.value = accumulator.call(target, [], savedArgs, n);
}

export default curry;