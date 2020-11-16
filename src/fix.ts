/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import MultiKeyMap from '@final-hill/multi-key-map';
import assert from './lib/assert';

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
          visited = new MultiKeyMap();
    let i = 0;

    return function(
        target: any, _propertyKey: PropertyKey, descriptor: PropertyDescriptor
    ): void {
        assert(typeof descriptor.value == 'function' && typeof target == 'object', 'Only a method can have an associated @fix');
        const f = descriptor.value as (...args: any[]) => any;
        descriptor.value = function _fix(...args: any[]): any {
            if(visited.has(...args)) {
                i = 0;
            } else {
                i++;
                if(i > limit) {
                    i = 0;
                    visited.set(...args, bottom(...args));
                } else {
                    visited.set(...args, bottom(...args)); // f.apply could recurse unaltered
                    const value = f.apply(this, args);
                    visited.set(...args, value);
                }
            }

            const result = visited.get(...args);
            visited.clear();

            return result;
        };
    };
}

export default fix;