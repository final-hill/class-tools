/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';

const assert: Contracts['assert'] = new Contracts(true).assert;

/**
  * Caches the associated class feature's return value.
  * @param {object | Function} target - The constructor of the class if applied to a static member. Otherwise the prototype
  * @param {PropertyKey} _propertyKey - The name of the member
  * @param {PropertyDecorator} descriptor - The property descriptor of the class feature
  */
function memo(
    target: any, _propertyKey: PropertyKey, descriptor: PropertyDescriptor
): void {
    const cache = new Map(),
        fnOriginal: (...args: any[]) => any = descriptor.value,
        noEntry = Symbol('No Entry');
    let argCount: number | undefined;

    // TODO: support constructors and accessors
    assert(typeof descriptor.value == 'function' && typeof target == 'object', 'Only methods can be memoized currently');
    descriptor.value = function (...args: any[]): any {
        if (argCount === undefined) {
            argCount = args.length;
        }
        assert(argCount === args.length,
            `@memo: argument count can not vary. Expected ${argCount} received: ${args.length}`
        );

        let cached;
        if(argCount === 0) {
            cached = cache.has(null) ? cache.get(null) : noEntry;
        } else {
            cached = args.reduce<Map<any, any> | any>(((cacheOrResult, arg) =>
                cacheOrResult instanceof Map ?
                    cacheOrResult.has(arg) ? cacheOrResult.get(arg) : noEntry
                : cacheOrResult
            ), cache);
        }

        if (cached !== noEntry) {
            return cached;
        } else {
            if(argCount === 0) {
                const result = fnOriginal.call(this, ...args);
                cache.set(null, result);

                return result;
            } else if(argCount === 1) {
                const result = fnOriginal.call(this, ...args);
                cache.set(args[0], result);

                return result;
            } else {
                const newCache: Map<any, any> = args.slice(0, args.length - 1)
                    .reduce((newCache, arg) => {
                        if(newCache.has(arg) === true) {
                            return newCache.get(arg);
                        } else {
                            const newMap = new Map();
                            newCache.set(arg, newMap);

                            return newMap;
                        }
                    }, cache),
                result = fnOriginal.call(this, ...args);
                newCache.set(args[args.length - 1], result);

                return result;
            }
        }
    };
}

export default memo;