/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import lazy from './lazy';

describe('@lazy', () => {
    test('declaration', () => {
        expect(() => {
            class Foo {
                @lazy
                get bar(): number { return Math.sqrt(144); }
            }

            return Foo;
        }).not.toThrow();

        expect(() => {
            // @ts-ignore
            @lazy
            class Foo {}

            return Foo;
        }).toThrow();

        expect(() => {
            class Foo {
                @lazy
                bar(): number { return Math.sqrt(144); }
            }

            return Foo;
        }).toThrow();
    });

    test('@lazy getter/setter', () => {
        class Counter {
            static usage = 0;
            constructor(){
                Counter.usage++;
            }
        }

        class Foo {
            @lazy
            get bar(): Counter { return new Counter(); }
        }

        const foo = new Foo();

        void foo.bar;
        void foo.bar;
        void foo.bar;

        expect(Counter.usage).toBe(1);

        Counter.usage = 99;
        // @ts-ignore : TODO setter type needed
        foo.bar = new Counter();
        void foo.bar;

        expect(Counter.usage).toBe(100);
    });
});