# build-keys [![Build status for build-keys on Circle CI.](https://img.shields.io/circleci/project/sholladay/build-keys/master.svg "Circle Build Status")](https://circleci.com/gh/sholladay/build-keys "Build Keys Builds")

> Get the paths of files from your build.

## Why?

 - Useful for copying build artifacts.
 - Agnostic of how the files were written.
 - Excludes directories, perfect for Amazon S3.

## Install

```sh
npm install build-keys --save
```

## Usage

Get it into your program.

```js
const buildKeys = require('build-keys');
```

Get a list of the filepaths that exist within the most recent build, excluding directories.

```js
buildKeys.latest().then((keys) => {
    console.log('keys:', keys);
    // [
    //     'master/1.0.0/foo.js',
    //     'master/latest/foo.js'
    // ]
});
```

## API

### buildKeys.latest(option)

#### option

Type: `object`

Settings and known [build data](https://github.com/sholladay/build-data).

##### cwd

Type: `string`<br>
Default: `process.cwd()`

The parent directory of the build root.

##### branch

Type: `string`

Match the files from the given branch name, rather than the most recently built branch.

##### version

Type: `string`

Match the files from the given version, rather than the most recently built version of the branch.

##### includeBranchLatest

Type: `boolean`<br>
Default: `true`

Whether to also match the files at the `<branch>/latest` path.

## Related

 - [build-version](https://github.com/sholladay/build-version) - Get a version for your build.
 - [build-data](https://github.com/sholladay/build-data) - Get metadata for your build.
 - [build-dir](https://github.com/sholladay/build-dir) - Get a place to put your build.
 - [build-path](https://github.com/sholladay/build-path) - Get a path for the given build.
 - [build-files](https://github.com/sholladay/build-files) - Read the files from your build.

## Contributing

See our [contributing guidelines](https://github.com/sholladay/build-keys/blob/master/CONTRIBUTING.md "The guidelines for participating in this project.") for more details.

1. [Fork it](https://github.com/sholladay/build-keys/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/build-keys/compare "Submit code to this project for review.").

## License

[MPL-2.0](https://github.com/sholladay/build-keys/blob/master/LICENSE "The license for build-keys.") © [Seth Holladay](http://seth-holladay.com "Author of build-keys.")

Go make something, dang it.
