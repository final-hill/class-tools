/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import fix from './fix';

describe('@fix', () => {
    test('Declaration', () => {
        expect(() => {
            class Foo {
                @fix({bottom: 0})
                bar(x: number): number {
                    return 1 + this.bar(x);
                }
            }

            return Foo;
        }).not.toThrow();
    });

    test('bottom', () => {
        class Foo {
            @fix({bottom: 0})
            bar(): number {
                return this.bar();
            }
        }
        expect(new Foo().bar()).toBe(0);
    });

    test('limit', () => {
        class Foo {
            @fix({bottom: 0, limit: 10})
            bar(n: number): number {
                return 1 + this.bar(n);
            }
        }
        expect(new Foo().bar(0)).toBe(9);
    });

    test('Deeper Recursion', () => {
        class Foo {
            @fix({bottom: 0})
            bar(n: number): number {
                if(n <= 3) {
                    return 1 + this.bar(n + 1);
                } else {
                    return this.bar(n);
                }
            }
        }
        expect(new Foo().bar(0)).toBe(4);
    });

    test('bottom as function', () => {
        class Foo {
            @fix({bottom: (n: number) => n**2})
            bar(n: number): number {
                if(n <= 3) {
                    return 1 + this.bar(n + 1);
                } else {
                    return this.bar(n); // bottom(4) == 4**2 == 16
                }
            }
        }
        expect(new Foo().bar(0)).toBe(20);
    });
});