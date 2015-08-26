
class-bind is a utility to make certain methods of a class be bound on access.

It's careful to preserve things like C.prototype.foo giving the original function and the enumerable/writable/configurable flags.

## Why?

The main motivation was meta-programming in development. If a method on the prototype is assigned to, it will also be autobound and instances will receive it on the next access. This is disabled in production for performance reasons.

Also I couldn't find anything that let me use decorators to say what should be bound.


## Example

```js
import {bound, bind, bindAll} from 'class-bind';

class A {
    // bound with a decorator
    @bound
    foo(){ return this.x; }

    bar(){ return this.y; }
}


// bind a single method
bind(A.prototype, 'bar');

// or bind every method
bindAll(A.prototype);
```

## Install

```
npm install --save class-bind
```

## Docs

### bound

`bound` is intended to be used as a decorator. Look at the [src/bind.js][src/bind.js] for an example of how it'd work without a decorator.

### bind

Takes a protoype and a key, and replaces it with a modified descriptor. It's just `bound` + `Object.defineProperty`.

### bindAll

Takes a prototype, binds all own property methods. It's just `Object.getOwnPropertyNames` + `bind`.


### Usage

### process.env.NODE_ENV

If this is running in node or browserify: cool. If it's webpack, you need to use `DefinePlugin` to provide it.

If you don't do this correctly you'll get an error, e.g. in v8:

```
ReferenceError: process is not defined
TypeError: Cannot read property 'NODE_ENV' of undefined
```

### Paths

`require('class-bind')` would give you an object with the three functions above. It resolves to `class-bind/lib/index.js'`, which is es5.

Alternatively, you can e.g. `require('class-bind/lib/bound')` to just get a single function.

The source is es6 and can be found in `class-bind/src`.

## Development

The ususal npm stuff:

```
# prepare environment
npm install

# run tests
npm test

# es6 in src -> es5 in lib
npm run prepublish
```

