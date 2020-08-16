/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import curry from './curry';

describe('@curry', () => {
    test('Declaration', () => {
        expect(() => {
            class Adder {
                @curry
                add(a: number, b: number): number {
                    return a + b;
                }
            }

            return Adder;
        }).not.toThrow();
    });
    test('Curry arity 2', () => {
        class Adder {
            @curry
            add(a: number, b: number): number {
                return a + b;
            }
        }

        const adder = new Adder();
        let addOne;

        expect(() => {
            // TODO: provide a curried type
            // @ts-ignore
            addOne = adder.add(1);
        }).not.toThrow();

        expect(
            // @ts-ignore
            addOne(3)
        ).toEqual(4);

        expect(
            //@ts-ignore
            addOne()(3)
        ).toBe(4);
    });
});