/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import Contracts from '@final-hill/decorator-contracts';
import MultiKeyMap from '@final-hill/multi-key-map';

const assert: Contracts['assert'] = new Contracts(true).assert,
      id = (x: any): any => x;

/**
 * Computes the least fixed point of the associated method
 *
 * @param {any | function(...args: any): any} bottom - The starting point for the iterative ascent
 * @param {number} [limit] - The iterative limit
 * @param {function(...args: any): any} [unwrap] - An optional transformation of the return value
 * @returns {MethodDecorator} - The method decorator
 */
function fix(bottom: any | ((...args: any) => any), limit=Infinity, unwrap: ((...args: any) => any) = id): MethodDecorator {
    let bottomValue: any;
    if(typeof bottom != 'function') {
        bottomValue = bottom;
        bottom = (): any => bottomValue;
    }

    const callChain = new MultiKeyMap(),
          values = new MultiKeyMap();

    return function(
        target: any, _propertyKey: PropertyKey, descriptor: PropertyDescriptor
    ): void {
        assert(typeof descriptor.value == 'function' && typeof target == 'object', 'Only a method can have an associated @fix');
        const f = descriptor.value as (...args: any[]) => any;
        descriptor.value = function _fix(...args: any[]): any {
            const callee = [_fix,...args];
            let value;
            if(callChain.size == 0) {
                values.set(...callee, bottom(...args));
                for(let i = 0; i < limit && value != values.get(...callee); i++) {
                    callChain.set(...callee,callee);
                    value = values.get(...callee);
                    values.set(...callee,unwrap(f.apply(this,args)));
                    callChain.clear();
                }

                return value;
            }
            if(callChain.has(...callee)) {
                return values.get(...callee,bottom(...args));
            }
            callChain.set(...callee, callee);
            value = unwrap(f.apply(this,args));
            values.set(...callee,value);
            callChain.delete(...callee);

            return value;
        };
    };
}

export default fix;

/*

let fix = f =>
    (u => f(n => u(u)(n)))
    (u => f(n => u(u)(n)))
*/