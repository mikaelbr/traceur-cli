traceur-cli -- wraps traceur cli to add repl and string eval
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

## Eval Examples

```shell
➜  traceur-cli -e '({ foo: "bar", bar: "bat" });'
{ foo: 'bar', bar: 'bat' }
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

1. Make it work with array/generator comprehensions.
2. Add support for multiline/blocks
3. Tests
