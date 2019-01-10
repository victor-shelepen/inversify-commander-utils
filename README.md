# Inversify Commander Utils

[![Join the chat at https://gitter.im/inversify/InversifyJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/inversify/InversifyJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.com/vlikin/inversify-commander-utils.svg?branch=master)](https://travis-ci.com/vlikin/inversify-commander-utils)
[![Coverage Status](https://coveralls.io/repos/github/vlikin/inversify-commander-utils/badge.svg?branch=master)](https://coveralls.io/github/vlikin/inversify-commander-utils?branch=master)
[![npm version](https://badge.fury.io/js/inversify-commander-utils.svg)](http://badge.fury.io/js/inversify-commander-utils)
[![Known Vulnerabilities](https://snyk.io/test/github/vlikin/inversify-commander-utils/badge.svg?targetFile=package.json)](https://snyk.io/test/github/vlikin/inversify-commander-utils?targetFile=package.json)

[![NPM](https://nodei.co/npm/inversify-commander-utils.png?downloads=true&downloadRank=true)](https://nodei.co/npm/inversify-commander-utils/)
[![NPM](https://nodei.co/npm-dl/inversify-commander-utils.png?months=9&height=3)](https://nodei.co/npm/inversify-commander-utils/)


## Summary
The project assembles the functionality of two libraries: *commander* and *inversifyjs*. It represents
the *commander* functionality in *inversify* way.

## Installation

You can install `inversify-commander-utils` using npm:

```sh
npm install inversify inversify-commander-utils reflect-metadata --save
```

The `inversify-commander-utils` type definitions are included in the npm module and require TypeScript 2.0.
Please refer to the [InversifyJS documentation](https://github.com/inversify/InversifyJS#installation) to learn more about the installation process.

## Basics
### Step 1: Define containers

```ts
@injectable()
class TodoContainer {
    public printPaper() {
        return 'Paper';
    }
}
```
### Step 2: Define a group and actions
The group is represented as a container where we inject another container to.
The injected container is available in actions of the group.
```ts
@group('printer')
class TestGroup {

    @inject(TodoContainer)
    public todoContainer!: TodoContainer;

    @action('A')
    public testA() {
        console.log(this.todoContainer.printA());
    }

}
```

### Step 3: Assembling of all definitions
```ts
const container = new Container();
container.bind(TodoContainer).to(TodoContainer);
build(commander, container);
```

### Step 4: Processing of arguments
```ts
commander
    .parse(process.argv);
```

### Step 5: Run it from the console 
```sh
node ./src/cli.js printer:A
```

## P.S.
*InversifyJS* is a very interesting library. We are developing a web application using the approach.
At first we used InversifyJS utility alone. Later we checked a module *inversify-express-utils*,
studied it better added some functionality. And we realized that this is a good example to wrap any
module for our needs. This is used in our projects and it is being upgraded. Maybe another modules will
also be wrapped.
 