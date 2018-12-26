## Points
* **ts-node** is used during development.
* **chai** is used for testing here as a assertion library.

## Extra parameters for mocha to work with TypeScript.
```
-r "node_modules/reflect-metadata/Reflect.js" --require ts-node/register
```