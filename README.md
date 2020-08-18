# Functional Tools

<!--
[![Build Status](https://dev.azure.com/thenewobjective/functional-tools/_apis/build/status/Build?branchName=master)](https://dev.azure.com/thenewobjective/functional-tools/_build/latest?definitionId=11&branchName=master)
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
