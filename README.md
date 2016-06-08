# Ng2 Grid

Lightweight data grid component for Angular 2.

## Features

* Sorting
* Filtering
* Paging
* Selection
* Templating
* Remote Data Access

## Installation

Start by installing npm dependencies:

```bash
> npm install raketasoft-ng2-grid --save
> npm install lodash --save
```

The only way to include the component right now is to use module loader like
[SystemJS](https://github.com/systemjs/systemjs). Example configuration:

```javascript
System.config({
    defaultJSExtensions: true,
    map: {
        'raketasoft-ng2-grid': 'node_modules/raketasoft-ng2-grid',
        'lodash': 'node_modules/lodash'
    }
});
```

Then import and include in your component's directives:

```typescript
import { GridComponent, GridColumnComponent, GridOptions } from 'raketasoft-ng2-grid';

@Component({
    directives: [GridComponent, GridColumnComponent]
})
export class MyComponent {
    ...
}
```

## Demo

Configuration examples could be found under the demo application:
[Demo](https://github.com/raketasoft/ng2-grid/tree/master/demo)

## License

MIT
