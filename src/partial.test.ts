/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {partial,_} from './partial';

describe('@partial', () => {
    test('declaration', () => {
        expect(() => {
            class A {
                @partial
                m(a: number, b: number, c: number): number { return a + b + c; }
            }

            return A;
        }).not.toThrow();
    });

    test('create partial, then evaluate', () => {
        class A {
            @partial
            m(a: number, b: number, c: number): number { return a + b + c; }
        }

        const a = new A();

        expect(a.m(1,2,3)).toBe(6);
        // @ts-ignore
        expect(a.m(_,2,3)(1)).toBe(6);
        // @ts-ignore
        expect(a.m(1,_,3)(2)).toBe(6);
        // @ts-ignore
        expect(a.m(1,2,_)(3)).toBe(6);
        // @ts-ignore
        expect(a.m(1,_,_)(2,3)).toBe(6);
        // @ts-ignore
        expect(a.m(_,2,_)(1,3)).toBe(6);
        // @ts-ignore
        expect(a.m(_,_,3)(1,2)).toBe(6);
        //@ts-ignore
        expect(a.m(_,_,_)(1,2,3)).toBe(6);
    });

    test('partial application chain', () => {
        class A {
            @partial
            m(a: number, b: number, c: number): number { return a + b + c; }
        }

        const a = new A();

        //@ts-ignore
        expect(a.m(_,_,_)(_,2,_)(1,3)).toBe(6);
    });

    test('Error conditions', () => {
        class A {
            @partial
            m(a: number, b: number, c: number): number { return a + b + c; }
        }

        const a = new A();

        // @ts-ignore
        expect(() => a.m(1,2,3,4)).toThrow();
        // @ts-ignore
        expect(() => a.m(_,2,3)()).toThrow();
        // @ts-ignore
        expect(() => a.m(_,2,3)(5,5)).toThrow();
    });
});