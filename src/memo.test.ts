/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import memo from './memo';

describe('@memo', () => {
    test('declaration', () => {
        expect(() => {
            class FibClass {
                @memo
                calcMemo(n: number): number {
                    return n < 2 ? n : this.calcMemo(n - 1) + this.calcMemo(n - 2);
                }

                calc(n: number): number {
                    return n < 2 ? n : this.calc(n - 1) + this.calc(n - 2);
                }
            }

            return FibClass;
        }).not.toThrow();
    });
    test('@memo faster than regular call', () => {
        class Fib {
            @memo
            calcMemo(n: number): number {
                return n < 2 ? n : this.calcMemo(n - 1) + this.calcMemo(n - 2);
            }
            calc(n: number): number {
                return n < 2 ? n : this.calc(n - 1) + this.calc(n - 2);
            }
        }

        const fib = new Fib(),
              d1 = Date.now();
        fib.calc(20);
        const d2 = Date.now(),
              d3 = Date.now();
        fib.calcMemo(20);
        const d4 = Date.now();

        expect(d2 - d1).toBeGreaterThan(d4 - d3);
    });
});

