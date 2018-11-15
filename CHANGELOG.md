<a name="1.0.2"></a>
# 1.0.2 (2018-11-15)

### Bug Fixes

* **grid:** Fix issue #43 pageSize param not passed correctly


<a name="1.0.1"></a>
# 1.0.1 (2018-07-31)

### Bug Fixes

* **grid:** Fix issue with grid selection not working properly


<a name="1.0.0"></a>
# 1.0.0 (2018-05-16)

### Features

* **grid:** Bump to Angular 5.x
* **grid:** Migrate to HttpClientModule

### Bug Fixes

* **build:** Fix Chrome version in CI build


<a name="1.0.0-beta.9"></a>
# 1.0.0-beta.9 (2018-02-21)

### Features

* **build:** Bump node version for CI to latest
* **build:** Fix tslint warnings

### Bug Fixes

* **grid:** Fix issue #37
* **grid:** Fix issue with sticky header


<a name="1.0.0-beta.8"></a>
# 1.0.0-beta.8 (2017-08-29)

### Features

* **package:** Update Angular to 4.x along with related dependencies
* **build:** Bump node version for CI to 6.x
* **build:** Fix tslint rules


<a name="1.0.0-beta.7"></a>
# 1.0.0-beta.7 (2017-06-19)

### Features

* **grid:** Add single selection support for grid items
* **package:** Add package-lock.json file


<a name="1.0.0-beta.6"></a>
# 1.0.0-beta.6 (2017-05-18)

### Features

* **grid:** Add support for transforming json data to model classes (issue #2)
* **grid:** Add getter/setter for grid options (issue #29)
* **grid:** Add support for cell style callback
* **build:** Configure test build and Travis CI

### Bug Fixes

* **grid:** Fix selection issue
* **build:** Fix lint rules/errors


<a name="1.0.0-beta.5"></a>
# 1.0.0-beta.5 (2017-03-14)

### Bug Fixes

* **grid:** Fix issue #27
* **grid:** Fix issue with page button event propagation


<a name="1.0.0-beta.4"></a>
# 1.0.0-beta.4 (2017-02-22)

### Bug Fixes

* **grid:** Fix selection issue
* **grid:** Fix static data filtering issue


<a name="1.0.0-beta.3"></a>
# 1.0.0-beta.3 (2017-02-14)

### Features

* **demo:** Add node server for demo data

### Bug Fixes

* **grid:** Fix issue with change detector ref
* **grid:** Add missing jsdoc
* **test:** Fix demo component spec


<a name="1.0.0-beta.2"></a>
# 1.0.0-beta.2 (2017-02-13)

### Features

* **build:** Add TypeScript definitions to build


<a name="1.0.0-beta.1"></a>
# 1.0.0-beta.1 (2017-02-10)

### Features

* **grid:** Update grid component to work with Angular 2.4.0 and bumped related dependencies
* **test:** Add support for unit and e2e tests (actual tests not yet implemented)


<a name="1.0.0-alpha.17"></a>
# 1.0.0-alpha.17 (2017-02-03)

### Features

* **grid:** Allow filtering/sorting by columns that are not displayed in grid (issue #21). NOTE: This feature breaks backwards compatability with "type" property of grid columns. A new "filterType" property has been introduced to define how filter is displayed in UI and "type" property is now reserved only for filtering/sorting logic.

### Bug Fixes

* **grid:** Fix issue with full table width calculation


<a name="1.0.0-alpha.16"></a>
# 1.0.0-alpha.16 (2017-01-24)

### Features

* **grid:** Add support for grid events (issue #3)

### Bug Fixes

* **grid:** Fix grid resizing/rendering issues
* **grid:** Fix issue with data provider (issue #20)


<a name="1.0.0-alpha.15"></a>
# 1.0.0-alpha.15 (2017-01-12)

### Features

* **grid-column:** Add support for "number" type column, including updates to filtering, sorting and validation (issue #15)
* **grid:** Add public methods for clearing filters (issue #16)

### Bug Fixes

* **grid:** Fix bug with fixed header null offset
* **grid:** Fix various issues with scrolling/dragging the grid
* **grid:** Fix bug with select all items checkbox


<a name="1.0.0-alpha.14"></a>
# 1.0.0-alpha.14 (2016-11-30)

### Features

* **grid-column:** Add css class property to grid column


<a name="1.0.0-alpha.13"></a>
# 1.0.0-alpha.13 (2016-11-29)

### Features

* **grid:** Add support for horizontal body scroll using mouse drag

### Bug Fixes

* **grid:** Fixed issue #12


<a name="1.0.0-alpha.12"></a>
# 1.0.0-alpha.12 (2016-11-15)

### Features

* **grid:** Add API method for clearing selection
* **grid:** Add option for default filtering column
* **grid:** Add option for required filters
* **grid:** Add fixed header option
* **demo:** Update demo with new features

### Bug Fixes

* **grid:** Fixed issue #9
* **grid:** Fixed issue #10


<a name="1.0.0-alpha.11"></a>
# 1.0.0-alpha.11 (2016-09-08)

### Features

* **grid:** Add support for preserving selection during rendering (page change, filtering, etc.)
* **grid-options:** Add new configuration option (*uniqueId*) for unique ID field for data rows. Unique ID is used to preserve selection during rendering. Defaults to *id*.
* **demo:** Update demo with new selection examples


<a name="1.0.0-alpha.10"></a>
# 1.0.0-alpha.10 (2016-06-16)

### Bug Fixes

* **grid-data-provider:** Fix issue with default initialization of requestParams


<a name="1.0.0-alpha.9"></a>
# 1.0.0-alpha.9 (2016-06-16)

### Features

* **docs:** Update README

### Bug Fixes

* **grid:** Remove css autoload


<a name="1.0.0-alpha.8"></a>
# 1.0.0-alpha.8 (2016-06-15)

### Bug Fixes

* **grid:** Move template definition inline for publishing with the js file


<a name="1.0.0-alpha.7"></a>
# 1.0.0-alpha.7 (2016-06-14)

### Features

* **grid:** Move filtering logic outside data provider, update grid API

### Bug Fixes

* **grid-column:** Fix issue with select filter option values


<a name="1.0.0-alpha.6"></a>
# 1.0.0-alpha.6 (2016-06-12)

### Features

* **grid-column:** Add column type support and select/drop-down filters
* **grid-options:** Add row style customization support using callback function
* **grid-options:** Add row selection style customization
* **grid:** Add support for selecting item on row click
* **demo:** Update demo examples

### Bug Fixes

* **grid:** Fix issue with sort class applied to action column
* **grid:** Fix issue with total page count, when remote data is not returned

<a name="1.0.0-alpha.5"></a>
# 1.0.0-alpha.5 (2016-06-07)

### Features

* **grid-column:** Add templating support for Angular 2 syntax
* **grid-options:** Add total count header option
* **grid:** Add total count public method
* **demo:** Update examples, add full configuration options example
* **docs:** Update README.md

### Bug Fixes

* **grid:** Fix undefined issue when accessing selected items
* **grid:** Fix component naming convention to latest style guide


<a name="1.0.0-alpha.4"></a>
# 1.0.0-alpha.4 (2016-06-03)

### Features

* **grid-column:** Add lodash template support for cell rendering
* **grid-options:** Add body and heading CSS class options
* **grid-options:** Add alternate template support
* **demo:** Update demo examples with latest features

### Bug Fixes

* **grid:** Update grid API methods
* **grid-options:** Convert options to immutable class


<a name="1.0.0-alpha.3"></a>
# 1.0.0-alpha.3 (2016-06-01)

### Features

* **grid:** Autoload CSS styles
* **docs:** Add CHANGELOG.md
* **docs:** Update README.md instructions
* **build:** Update TypeScript configuration

### Bug Fixes

* **grid-column:** Fix issue with rendering empty values
* **grid:** Move HTML template to separate file


<a name="1.0.0-alpha.2"></a>
# 1.0.0-alpha.2 (2016-05-30)

### Features

* **build:** Update component seed, setup module for publishing

### Bug Fixes

* **docs:** Update README.md instructions


<a name="1.0.0-alpha.1"></a>
# 1.0.0-alpha.1 (2016-05-26)

### Bug Fixes

* **package:** Fix package name
