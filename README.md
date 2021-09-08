
# mishape

A [tiny](https://bundlephobia.com/package/mishape) object property validator.

```js
import mishape from 'mishape';

const validate = mishape({
  title: 'string',
  year: 'string|number',
  data: {
    available: 'boolean',
    dateRange: (x, is) => is.array(x) && x.length == 2 && x[0] < x[1]
  }
});

validate({ title: 'Dubliners', year: 1914, data: { available: true, dateRange: [1900, 1800] } })
// { ok: false, errors: [TypeError: Expected dateRange, got: 1900,1800 at data.dateRange] }
```

## Install

Node
```bash
npm install mishape
```

Deno
```js
import mishape from 'https://deno.land/x/mishape/index.js';
```

Browser
```html
<script src="https://unpkg.com/mishape/dist/mishape.min.js"></script>
```

In the browser context, the default export name is `mishape`.

Browser (ESM)
```html
<script type="module">
  import mishape from 'https://unpkg.com/mishape/dist/mishape.js';
</script>
```

## Usage

Create a validator by passing a `Schema` to `mishape`. Pass an object to your newly created validator to retrieve a result in the shape of `{ ok: boolean, errors: TypeError[] }`. Validator functions never throw.

```js
const validate = mishape({
  name: 'string',
  age: 'number',
  items: 'array'
});

validate({ name: 'James', age: 28, items: ['lots', 'of', 'books'] });
// { ok: true, errors: [] }
```

`Schema` properties can be one of three things:

1. An `object`, which is treated as a sub-`Schema` and will be validated recursively.

2. A `string` denoting a type or union type, e.g., `string`, `number`, `boolean|defined`, `string|number` etc. By default, `mishape` includes built-in typecheckers for primitive types, including:

  * `number`
  * `array`
  * `boolean`
  * `object`
  * `string`
  * `function`
  * `defined`

  *(Note: `[]` will pass the built-in `object` check)*.

  The built-in type-map can be extended by passing a custom map as a second argument to `mishape`:

  ```js
  const validate = mishape({ data: 'object' }, {
    object: x => typeof x == 'object' && x != null && !Array.isArray(x)
  });

  validate({ data: [1, 2, 3] });
  // { ok: false, errors: [TypeError: Expected object, got: 1,2,3 at data] }
  ```

  All custom typecheckers are provided the built-in typecheckers as a second argument, `is`, so the above can also be written as:

  ```js
  const validate = mishape({ data: 'object' }, {
    object: (x, is) => is.object(x) && !is.array(x)
  });
  ```

3. A `PropertyValidator` function, which allows for more complex property validation. PropertyValidators are passed the value to be validated (`x`), as well as all typecheckers (`is`):

  ```js
  const validate = mishape({
    name: 'string',
    age: (x, is) => is.number(x) && x >= 21
  });

  validate({ name: 'Doug', age: 20 });
  // { ok: false, errors: [TypeError: Expected age, got: 20 at age] }
  ```

## Credits

`mishape` borrows heavily from my other project, [typeok](https://github.com/kevinfiol/typeok).
