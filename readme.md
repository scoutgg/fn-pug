# fn-pug
Create a vitual dom producing function from pug templates

## Installation
```bash
$ npm i scoutgg/fn-pug
```
## Usage

### Standalone

```js
const fnPug = require('fn-pug')

const { code, map, ast } = fnJade(template)

console.log(code)
```

### Browserify
```json
{
  "browserify": {
    "transform": [
      "fn-pug/lib/transform/browserify",
    ]
  }
}
```


## Syntax
for the most part what is documented on [the pug website](https://pugjs.org) will work with a few exeptions like `extends` or `include`

### Special syntax

There is also some added special syntax

#### Event listeners
```pug
button((click)=console.log(e))
```
you can add event listeners using `(eventName)`.
They will work like arrow functions with the magical variable `e` that represents the event.

#### Properties
```pug
input([value]="Some value")
```
Assigns value to the dom elements property instead of attribute.

Properties also pass values by reference instead of serializing.

For custom elements this can also trigger setters

#### Bindings
```pug
form-control([(value)]=this.input)
```
Syntactic sugar for

```pug

form-control(
  [value]=this.input, 
  (valueChanged)=this.input=e.target.value
)
```

Allows you to create nice declarative databinding

### Hooks

```pug
.wrapper(*modify=node => console.log(node))
```

Provides hooks for manipulating native dom node.

Example hook

```js
function logNode(prefix) {
  return function connect(node) {
    console.log(prefix, 'connect', node)

    return function disconnect() {
      console.log(prefix, 'disconnect', node)
    }
  }
}

```
```pug
.wrapper(*log=logNode('inner'))
```

### Mixins

This is the intended pattern for partials and minimal components

#### Usage
```pug
- const partial = require('./partial.pug')

+partial(class="important")
  h1 This is important
```

#### Definition
```pug
// partial.pug
.partial(class=properties.class)
  each child in children
    .wrapped
      = child
```
