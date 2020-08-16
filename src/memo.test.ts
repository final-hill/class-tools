/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import memo from './memo';

/**
 * Executes the provided function and returns the result with associated timing
 *
 * @param {Function} fn - The function to execute
 * @param {any[]} args  - The arguments to apply to the function
 * @returns {[any, number]} - The result of execution
 */
function measure<T>(fn: (...args: any[]) => T, args: any[]): [T, number] {
    const d1 = Date.now(),
        result = fn(...args),
        d2 = Date.now();

    return [result, d2 - d1];
}

/**
 * Executes the provided async function and returns the result with associated timing
 *
 * @param {Function} fn - The function to execute
 * @param {any[]} args  - The arguments to apply to the function
 * @returns {[any, number]} - The result of execution
 */
async function measureAsync<T>(fn: (...args: any[]) => Promise<T>, args: any[]): Promise<[T, number]> {
    const d1 = Date.now(),
        result = await fn(...args),
        d2 = Date.now();

    return [result, d2 - d1];
}

describe('@memo', () => {
    test('declaration', () => {
        expect(() => {
            class Fib {
                @memo
                calcMemo(n: number): number {
                    return n < 2 ? n : this.calcMemo(n - 1) + this.calcMemo(n - 2);
                }

                calc(n: number): number {
                    return n < 2 ? n : this.calc(n - 1) + this.calc(n - 2);
                }
            }

            return Fib;
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
            [result, time] = measure(fib.calc.bind(fib), [30]),
            [result2, time2] = measure(fib.calcMemo.bind(fib), [30]);

        expect(result).toEqual(result2);
        expect(time).toBeGreaterThan(time2);
    });
    test('No args', async () => {
        class Foo {
            @memo
            async calcMemo(): Promise<number> {
                return await new Promise(resolve =>
                    setTimeout(() => resolve(16), 2000)
                );
            }

            async calc(): Promise<number> {
                return await new Promise(resolve =>
                    setTimeout(() => resolve(16), 2000)
                );
            }
        }

        const foo = new Foo();
        // warm up
        await foo.calcMemo();

        const [result, time] = await measureAsync(async () => await foo.calc(), []),
            [result2, time2] = await measureAsync(async () => await foo.calcMemo(), []);

        expect(result).toEqual(result2);
        expect(time).toBeGreaterThan(time2);
    });
    test('Multiple args', () => {
        class FibDummy {
            @memo
            calcMemo(dummy: string, n: number): number {
                return n < 2 ? n : this.calcMemo(dummy, n - 1) + this.calcMemo(dummy, n - 2);
            }
            calc(dummy: string, n: number): number {
                return n < 2 ? n : this.calc(dummy, n - 1) + this.calc(dummy, n - 2);
            }
        }

        const fibDummy = new FibDummy(),
            [result, time] = measure(fibDummy.calc.bind(fibDummy), ['a', 30]),
            [result2, time2] = measure(fibDummy.calcMemo.bind(fibDummy), ['a', 30]);

        expect(result).toEqual(result2);
        expect(time).toBeGreaterThan(time2);
    });
});

