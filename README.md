traceur-cli – wraps traceur cli to add repl and string eval
====

Experimental module to wrap the [traceur-compiler cli](https://github.com/google/traceur-compiler)
to add REPL and functionality for doing string evaluations.

You can still use the original features as you'd expect.

## Installation

```shell
npm install -g traceur-cli
```

## REPL Examples

### Fat arrows
```shell
➜  traceur-cli
traceur> var f = (a) => a * 2;
undefined
traceur> f(2)
4
traceur>
```

```shell
➜  traceur-cli
traceur> var f = () => {
... return "Hello, World!";
... };
undefined
traceur> f()
'Hello, World!'
traceur>
```

### Iterators

```shell
➜  traceur-cli
traceur> var foo = (for (x of [1, 2, 3, 4]) "Foo: " + x);
undefined
traceur> foo.next();
{ value: 'Foo: 1', done: false }
traceur> foo.next();
{ value: 'Foo: 2', done: false }
traceur> foo.next();
{ value: 'Foo: 3', done: false }
```

```shell
➜  traceur-cli
traceur> [for (x of [1, 2, 3, 4]) "Foo: " + x]
[ 'Foo: 1',
  'Foo: 2',
  'Foo: 3',
  'Foo: 4' ]
```

### Destructuring
```shell
➜  traceur-cli
traceur> var { user, age } = { user: "mikaelbr", url: "https://github.com/mikaelbr" };
undefined
traceur> user
'mikaelbr'
traceur> url
https://github.com/mikaelbr
traceur>
```


### Modules

```shell
➜  traceur-cli
traceur> import { username, url } from './b';
undefined
traceur> username
'mikaelbr'
traceur> url
'https://github.com/mikaelbr/traceur-cli'
```

```shell
➜  traceur-cli
traceur> var { readFileSync } = require('fs');
undefined
traceur> readFileSync
[Function]
traceur>
```

### Computed Property Names

```shell
➜  traceur-cli
traceur> var x = 0;
undefined
traceur> var obj = { [x]: "Foo"; };
<unknown file>:1:23: Unexpected token ;,<unknown file>:1:25: Unexpected token }
traceur> var obj = { [x]: "Foo" };
undefined
traceur> obj
{ '0': 'Foo' }
traceur>
```


### REPL Functions

You can use regular Node repl functions as `.save` and `.load`.

```shell
➜  traceur-cli
traceur> .help
.break  Sometimes you get stuck, this gets you out
.clear  Alias for .break
.exit Exit the repl
.help Show repl options
.load Load JS from a file into the REPL session
.save Save all evaluated commands in this REPL session to a file

traceur> var f = () => "hello, world";
undefined
traceur> f
[Function]
traceur> f()
'hello, world'
traceur> .save test
Session saved to:test
traceur> .exit

➜  traceur-cli
traceur> .load test
traceur> var f = () => "hello, world";
undefined
traceur> f
[Function]
traceur> f()
'hello, world'
traceur> .exit
```


## Eval Examples

```shell
➜  traceur-cli -e '({ foo: "bar", bar: "bat" });'
{ foo: 'bar', bar: 'bat' }
```

```shell
➜  traceur-cli -e 'var { foo, bar } = {foo: "Some", bar: "Data"}; console.log(foo + " " + bar)'
Some Data
undefined
```

```shell
➜  traceur-cli -e '({ foo: "bar", bar: "bat" });' > test.txt
➜  cat test.txt
{ foo: 'bar', bar: 'bat' }
```

```shell
➜  traceur-cli -e 'console.log("hello"); var foo = "Bar"; console.log(foo); foo;'
hello
Bar
Bar
```

### Pipeing

```shell
➜  echo '({ foo: "bar", bar: "bat" });' | traceur-cli
traceur> ({ foo: "bar", bar: "bat" });
{ foo: 'bar', bar: 'bat' }
traceur> %
➜
```

## Original usage of traceur

You can use the traceur-cli as a wrapper for the original functionality of [traceur](https://github.com/google/traceur-compiler).
For instance by using `-h`:

```shell
➜  traceur-cli -h

  Usage: traceur-cli [options] [files]

  Commands:

# [...etc]
```

Or compiling files:

```shell
➜  traceur-cli --script example.js --out compiled.js
➜  node compiled.js
{ '0': 'Foo' }
```


# TODO

1. ~~Make it work with **iterators**.~~
2. ~~Add support for multiline/blocks~~
3. ~~Add support for modules/requires in repl. (Has now basic support.)~
4. Tests
