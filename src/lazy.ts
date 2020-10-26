/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';

const assert: Contracts['assert'] = new Contracts(true).assert;

/**
 * Converts the associated getter into a lazy initialized getter
 *
 * @param {Record<PropertyKey, any> | Function} target - The constructor of the class if applied to a static member. Otherwise the prototype
 * @param {PropertyKey} _propertyKey - The name of the member
 * @param {PropertyDecorator} descriptor - The property descriptor of the class feature
 * @returns {PropertyDescriptor} -
 */
function lazy(
    target: Record<PropertyKey, any> | ((...args: any[]) => any), _propertyKey: PropertyKey, descriptor: PropertyDescriptor
): PropertyDescriptor {
    assert(descriptor.get != undefined, '@lazy can only be applied to a getter');
    assert(descriptor.set == undefined, 'a setter can not be defined when using @lazy');

    const initializer = descriptor.get,
          _private = new WeakMap();

    /**
     * The new getter
     * @param {this} this - The target
     * @returns {any} -
     */
    function get(this: typeof target): any {
        if(_private.has(this)) {
            return _private.get(this);
        } else {
            return set.call(this, initializer.call(this));
        }
    }

    /**
     * The new setter
     * @param {this} this - The target
     * @param {any} value - The value
     * @returns {any} - The assigned value
     */
    function set(this: typeof target, value: any): any {
        _private.set(this,value);

        return value;
    }

    return { get, set };
}

export default lazy;