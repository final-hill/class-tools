# Class Tools

<!--
[![Build Status](https://dev.azure.com/thenewobjective/class-tools/_apis/build/status/Build?branchName=master)](https://dev.azure.com/thenewobjective/functional-tools/_build/latest?definitionId=11&branchName=master)
-->

## Table of Contents

## Introduction

This library provides a number of utility decorators to enable the use of
features commonly found in functional languages for use with classes.

## Library Installation

## Usage

## Memoization

```ts
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
