## Points
* **ts-node** is used during development.
* **chai** is used for testing here as a assertion library.

## Extra parameters for mocha to work with TypeScript.
```
-r "node_modules/reflect-metadata/Reflect.js" --require ts-node/register
```

# NPM package managment

## Build and publish
Clean a previous build
```
  gulp build-clean
```
Compile source
```
  gulp build-lib
  gulp build-dts
```

## Linking the development package to a project
**Note:** The extension has to be built. 
Go to the extension folder and link it to the global
```
  npm link
```
Go to a project folder and link the extension from global
```
  npm link inversify-commander-utils
```

## Publishing
### Login
```
  npm login
```
### Publish new version.
Check ```package.json```, set the correct version number ```"version": "0.0.4"```.
```
  npm publish
```

## Tips
### ts-node and linked modules
By default ts-node does not follow on sym links. You have to use a parameter ```--preserve-symlinks```.
