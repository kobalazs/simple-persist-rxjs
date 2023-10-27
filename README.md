# SimplePersist RxJS
[SimplePersist](https://www.npmjs.com/package/@simple-persist/core) decorator to handle RxJS Subjects & BehaviorSubjects

#### Table of Contents
* [Installation](#installation)
* [Quick start](#quick-start)
* [Read more](#read-more)
* [Collaboration](#collaboration)

## Installation
```bash
npm install @simple-persist/rxjs
```

## Quick start
Add `@PersistSubject()` decorator to a Subject or BehaviorSubject class property:
```ts
import { PersistSubject } from '@simple-persist/rxjs';
import { BehaviorSubject, Subject } from 'rxjs';

class Foo {
  @PersistSubject() public bar?: Subject;
  // or
  @PersistSubject() public baz?: BehaviorSubject;
}
```
> **Note:**  All configuration options of `@Persist()` from
> [@simple-persist/core](https://www.npmjs.com/package/@simple-persist/core)
> are available for `@PersistSubject()` as well.
> Use the same syntax to define custom keygens, middlewares or storage for your decorator!

## Read more
For more information (caveats, advanced use, other extensions) see [@simple-persist/core](https://www.npmjs.com/package/@simple-persist/core).

Check out my article about the reasoning behind this package: [Do we need state management in Angular?](https://medium.com/@kobalazs/do-we-need-state-management-in-angular-baf612823b16)

## Collaboration

Feel free to [suggest features](https://github.com/kobalazs), [open issues](https://github.com/kobalazs/simple-persist-rxjs/issues), or [contribute](https://github.com/kobalazs/simple-persist-rxjs/pulls)! Also let me know about your extensions, so I can link them in this document.
