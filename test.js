import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import test from 'ava';
import buildDir from 'build-dir';
import mkdirtemp from 'mkdirtemp';
import buildKeys from '.';

const writeFile = promisify(fs.writeFile);
const touchFile = (filePath) => {
    return writeFile(filePath, '');
};

test('.latest() basics', async (t) => {
    const cwd = await mkdirtemp();
    const build = await buildDir.prepare({
        cwd,
        branch  : 'foo',
        version : 'blah'
    });
    await touchFile(path.join(build.path, 'bar'));
    await build.finalize();
    const keys = await buildKeys.latest({ cwd });
    t.deepEqual(keys, [
        'foo/blah/bar',
        'foo/latest/bar'
    ]);
});

test('.latest() excludes directories but includes their files', async (t) => {
    const cwd = await mkdirtemp();
    const build = await buildDir.prepare({
        cwd,
        branch  : 'foo',
        version : 'blah'
    });
    const emptyDir = await mkdirtemp(build.path);
    const nonEmptyDir = await mkdirtemp(build.path);
    await touchFile(path.join(build.path, 'bar'));
    await touchFile(path.join(nonEmptyDir, 'baz'));
    await build.finalize();
    const keys = await buildKeys.latest({ cwd });

    t.false(keys.some((key) => {
        return key.toLowerCase().includes(path.basename(emptyDir).toLowerCase());
    }));
    // TODO: Figure out a guaranteed sort order and use t.deepEqual instead of all this...
    t.is(keys.length, 4);
    t.true(keys[0].startsWith('foo/blah/'));
    t.true(keys[1].startsWith('foo/blah/'));
    t.true(keys[2].startsWith('foo/latest/'));
    t.true(keys[3].startsWith('foo/latest/'));
    t.true(keys.includes('foo/blah/bar'));
    t.true(keys.includes('foo/blah/' + path.basename(nonEmptyDir) + '/baz'));
    t.true(keys.includes('foo/latest/bar'));
    t.true(keys.includes('foo/latest/' + path.basename(nonEmptyDir) + '/baz'));
});

test('.latest() ignores files outside the build directory', async (t) => {
    const cwd = await mkdirtemp();
    const build = await buildDir.prepare({
        cwd,
        branch  : 'foo',
        version : 'blah'
    });
    await build.finalize();
    await touchFile(path.join(cwd, 'bar'));
    const keys = await buildKeys.latest({ cwd });
    t.deepEqual(keys, []);
});

test('.latest() throws when there is no build directory', async (t) => {
    const cwd = await mkdirtemp();
    await touchFile(path.join(cwd, 'bar'));
    const err = await t.throws(buildKeys.latest({ cwd }));
    t.true(err.message.startsWith('ENOENT: no such file or directory, lstat'));
});
