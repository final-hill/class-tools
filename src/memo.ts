/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import MultiKeyMap from '@final-hill/multi-key-map';

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
    const cache = new MultiKeyMap(),
          fnOriginal: (...args: any[]) => any = descriptor.value;

    // TODO: support constructors and accessors?
    assert(typeof descriptor.value == 'function' && typeof target == 'object', 'Only methods can be memoized');
    descriptor.value = function (...args: any[]): any {
        if(cache.has(...args)) {
            return cache.get(...args);
        } else {
            const result = fnOriginal.call(this, ...args);
            cache.set(...[...args,result]);

            return result;
        }
    };
}

export default memo;