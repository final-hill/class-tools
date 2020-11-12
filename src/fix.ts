/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import Contracts from '@final-hill/decorator-contracts';
import MultiKeyMap from '@final-hill/multi-key-map';

const assert: Contracts['assert'] = new Contracts(true).assert;

interface FixParams {
    /**
     * The starting point for the iterative ascent. Use a function for a computed bottom
     */
    bottom: any | ((...args: any) => any);
    /**
     * The iterative limit
     */
    limit?: number;
}

/**
 * Computes the least fixed point of the associated method
 *
 * @param {FixParams} options - Configuration options
 * @returns {MethodDecorator} - The method decorator
 */
function fix(options: FixParams): MethodDecorator {
    const limit = options.limit ?? Infinity,
          bottom = typeof options.bottom != 'function' ? (): any => bottomValue : options.bottom,
          bottomValue = typeof options.bottom != 'function' ? options.bottom : undefined,
          callChain = new MultiKeyMap(),
          values = new MultiKeyMap();

    return function(
        target: any, _propertyKey: PropertyKey, descriptor: PropertyDescriptor
    ): void {
        assert(typeof descriptor.value == 'function' && typeof target == 'object', 'Only a method can have an associated @fix');
        const f = descriptor.value as (...args: any[]) => any;
        descriptor.value = function _fix(...args: any[]): any {
            let value;
            if(callChain.size == 0) {
                values.set(...args, bottom(...args));
                for(let i = 0; i < limit && value !== values.get(...args); i++) {
                    callChain.set(...args, _fix);
                    value = values.get(...args);
                    values.set(...args,f.apply(this,args));
                    callChain.clear();
                }

                return value;
            }
            if(callChain.has(...args)) {
                return values.get(...args);
            }
            values.set(...args, bottom(...args));
            callChain.set(...args, _fix);
            value = f.apply(this,args);
            values.set(...args,value);
            callChain.delete(...args);
            values.delete(...args);

            return value;
        };
    };
}

export default fix;