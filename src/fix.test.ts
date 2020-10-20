/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import fix from './fix';

describe('', () => {
    test('Declaration', () => {
        expect(() => {
            class Foo {
                @fix(0)
                bar(x: number): number {
                    return 1 + this.bar(x);
                }
            }

            return Foo;
        }).not.toThrow();
    });

    test('bottom', () => {
        class Foo {
            @fix(0)
            bar(): number {
                return this.bar();
            }
        }
        expect(new Foo().bar()).toBe(0);
    });
});