# Class Tools

<!--
[![Build Status](https://dev.azure.com/thenewobjective/class-tools/_apis/build/status/Build?branchName=master)](https://dev.azure.com/thenewobjective/class-tools/_build/latest?definitionId=11&branchName=master)
-->

## Table of Contents

- [Introduction](#introduction)
- [Library Installation](#library-installation)
- [Memoization](#memoization)
- [Currying](#currying)
- [Partial Application](#partial-application)
- [Lazy Fields](#lazy-fields)
- [Fixed-Point](#fixed-point)
- [Memoized Fixed-Point](#memoized-fixed-point)
- [Known Limitations](#known-limitations)

## Introduction

This library provides a number of utility decorators to enable the use of
features commonly found in functional languages for use with classes.

Note that the license for this library is [AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.en.html).
You should [know what that means](https://choosealicense.com/licenses/agpl-3.0/) before
using this library. If you would like an exception to this license per section 7
[contact the author](mailto:michael.haufe@final-hill.com).

## Library Installation

## Memoization

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

## Memoized Fixed-Point

## Known Limitations

When using TypeScript a decorator can not change the type of the class feature. This is a [limitation](https://github.com/microsoft/TypeScript/issues/4881) of the language.
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
