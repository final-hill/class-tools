# Class Tools

[![Build](https://github.com/final-hill/class-tools/workflows/Build/badge.svg?branch=master)](https://github.com/final-hill/class-tools/actions?query=workflow%3ABuild%2FRelease)
[![npm version](https://badge.fury.io/js/%40final-hill%2Fclass-tools.svg)](https://www.npmjs.com/package/@final-hill/class-tools)
[![Downloads](https://img.shields.io/npm/dm/@final-hill/class-tools.svg)](https://www.npmjs.com/package/@final-hill/class-tools)

## Table of Contents

- [Introduction](#introduction)
- [Library Installation](#library-installation)
- [Memoization](#memoization)
- [Currying](#currying)
- [Partial Application](#partial-application)
- [Lazy Fields](#lazy-fields)
- [Fixed-Point](#fixed-point)
- [Known Limitations](#known-limitations)
- [Further Reading](#further-reading)

## Introduction

This library provides a number of utility decorators to enable the use of
features commonly found in functional languages for use with classes.

Note that the license for this library is [AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.en.html).
You should [know what that means](https://choosealicense.com/licenses/agpl-3.0/) before
using this library. If you would like an exception to this license per section 7
[contact the author](mailto:michael.haufe@final-hill.com?subject=AGPL%20Exception.%20@final-hill/class-tools).

## Library Installation

As a dependency run the command:

`npm install @final-hill/class-tools`

You can also use a specific version:

`npm install @final-hill/class-tools@1.0.0`

For use in a webpage:

`<script src="https://unpkg.com/@final-hill/class-tools"></script>`

With a specific version:

`<script src="https://unpkg.com/@final-hill/class-tools@1.0.0></script>`

## Memoization

The `@memo` decorator [memoizes](https://en.wikipedia.org/wiki/Memoization)
(caches) the results of the associated method call.

```ts
import {memo} from '@final-hill/class-tools';

class Fib {
    @memo
    calcMemo(n: number): number {
        return n < 2 ? n : this.calcMemo(n - 1) + this.calcMemo(n - 2);
    }
    calc(n: number): number {
        return n < 2 ? n : this.calc(n - 1) + this.calc(n - 2);
    }
}

fib.calc(30) // 832040; 9ms
fib.calcMemo(30) // 832040; less than 1ms
```

## Currying

The `@curry` decorator converts the associated method into a method
that supports [currying](https://en.wikipedia.org/wiki/Currying) the parameters.

```ts
import {curry} from '@final-hill/class-tools';

class Adder {
    @curry
    add(a: number, b: number): number {
        return a + b;
    }
}

const adder = new Adder(),
      addOne = adder.add(1);

addOne(3) // 4
addOne()(3) // 4
```

## Partial Application

The `@partial` decorator converts the associated method into
one that supports [partial application](https://en.wikipedia.org/wiki/Partial_application) of its parameters

```ts
import {partial, _} from '@final-hill/class-tools';

class A {
    @partial
    m(a: number, b: number, c: number): number { return a + b + c; }
}

const a = new A();

a.m(1,2,3) === 6
a.m(_,2,3)(1) === 6
a.m(1,_,3)(2) === 6
a.m(1,2,_)(3) === 6
a.m(1,_,_)(2,3) === 6
a.m(_,2,_)(1,3) === 6
a.m(_,_,3)(1,2) === 6
a.m(_,_,_)(1,2,3) === 6
a.m(_,_,_)(_,2,_)(1,3) === 6
```

## Lazy Fields

The `@lazy` decorator converts the associated getter into a lazily
initialized field. Practically this means that the body of the getter
will only executed once on its first use. Subsequent usages will
return the cached result of the first call.

```ts
import {lazy} from '@final-hill/class-tools';

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

Counter.usage // 1
```

## Fixed-Point

The `@fix` decorator can be assigned to methods in order to
control the behavior of its recursion and find its
least [fixed-point](https://en.wikipedia.org/wiki/Fixed-point_combinator).
It provides options to limit runaway recursion as well as
handle self-referential calls while returning a value.

The `bottom` option defines the value to return when the recursive call
bottoms out. In other words, if the current method has been recursively
called with the same arguments then it is replaced with the value given.

```ts
import {fix} from '@final-hill/class-tools';

class Foo {
    @fix({bottom: 0})
    bar(): number {
        return this.bar();
    }
}

new Foo().bar() === 0;
```

Recursive calls may always vary in their arguments leading
to runaway recursion in a different way. The `limit` option
prevents infinite recursion by replacing the nth call with
the value defined by the `bottom` option:

```ts
import {fix} from '@final-hill/class-tools';

class Foo {
    @fix({bottom: 0, limit: 10})
    bar(n: number): number {
        return 1 + this.bar(n);
    }
}

new Foo().bar(0) === 9;
```

The `bottom` option can also be defined as a function if
a computed result is desired:

```ts
import {fix} from '@final-hill/class-tools';

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
new Foo().bar(0) === 20;
```

## Known Limitations

When using TypeScript a decorator can not change the type of the associated class feature. This is a [limitation](https://github.com/microsoft/TypeScript/issues/4881) of the language.
Depending on your usage you may need to perform explicit casting or utilize the `// @ts-ignore` option. For example:

```ts
import {partial, _} from '@final-hill/class-tools';

class A {
    @partial
    m(a: number, b: number, c: number): number { return a + b + c; }
}

const a = new A();

a.m(1,2,3) === 6
// @ts-ignore
a.m(_,2,3)(1) === 6
// @ts-ignore
a.m(1,_,3)(2) === 6
// @ts-ignore
a.m(1,2,_)(3) === 6
```

## Further Reading

- [Currying](https://en.wikipedia.org/wiki/Currying)
- [Memoization](https://en.wikipedia.org/wiki/Memoization)
- [Partial Application](https://en.wikipedia.org/wiki/Partial_application)
- [Lazy Evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation)
- [Fixed-point combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator)
- [Domain Theory - Motivation and intuition](https://en.wikipedia.org/wiki/Domain_theory#Motivation_and_intuition)
- [Denotational Semantics - Meanings of recursive programs](https://en.wikipedia.org/wiki/Denotational_semantics#Meanings_of_recursive_programs)
- [Kleene fixed-point theorem](https://en.wikipedia.org/wiki/Kleene_fixed-point_theorem)
