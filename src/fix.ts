/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
//import Contracts from '@final-hill/decorator-contracts';

//const assert: Contracts['assert'] = new Contracts(true).assert,
  const    id = (x: any): any => x;

// https://gist.github.com/vrthra/53d68eda4d3d261e516f77fd97715d3f

/**
 * Computes the least fixed point of the associated method
 *
 * @param {any | function(...args: any): any} bottom - The starting point for the iterative ascent
 * @param {number} [_limit] - The iterative limit
 * @param {function(...args: any): any} [_unwrap] -
 * @returns {MethodDecorator} - The method decorator
 */
function fix(bottom: any | ((...args: any) => any), _limit=Infinity, _unwrap: ((...args: any) => any) = id): MethodDecorator {
    let bottomValue: any;
    if(typeof bottom != 'function') {
        bottomValue = bottom;
        bottom = (): any => bottomValue;
    }

    //const callChain = new Set(),
    //      values = new Map();

    return function(
        _target: any, _propertyKey: PropertyKey, _descriptor: PropertyDescriptor
    ): void {
        /*
        assert(typeof descriptor.value == 'function' && typeof target == 'object', 'Only a method can have an associated @fix');
        const f = descriptor.value as (...args: any[]) => any;
        descriptor.value = function _fix(...args: any[]): any {
            const callee = [_fix,args];
            if(callChain.size == 0) {
                let value;
                values.set(callee,bottom(...args));
                for(let i = 0; i < limit && value != values.get(callee); i++) {
                    callChain.add(callee);
                    value = values.get(callee);
                    values.set(callee,unwrap(f.apply(this,args)));
                    callChain.clear();
                }

                return value;
            }
            if(callChain.has(callee)) {
                return values.get(callee,bottom(...args));
            }

        };
        */
    };
}

export default fix;

/*

let fix = f =>
    (u => f(n => u(u)(n)))
    (u => f(n => u(u)(n)))
*/