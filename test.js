import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import test from 'ava';
import buildDir from 'build-dir';
import mkdirtemp from 'mkdirtemp';
import buildKeys from '.';

const writeFile = promisify(fs.writeFile);

test('buildKeys.latest() basics', async (t) => {
    const cwd = await mkdirtemp();
    const build = await buildDir.prepare({
        cwd,
        branch  : 'foo',
        version : 'blah'
    });
    await writeFile(path.join(build.path, 'bar'), '');
    await build.finalize();
    const keys = await buildKeys.latest({ cwd });
    t.deepEqual(keys, [
        'foo/blah/bar',
        'foo/latest/bar'
    ]);
});

test('buildKeys.latest() no files', async (t) => {
    const cwd = await mkdirtemp();
    const build = await buildDir.prepare({
        cwd,
        branch  : 'foo',
        version : 'blah'
    });
    await build.finalize();
    const keys = await buildKeys.latest({ cwd });
    t.deepEqual(keys, []);
});
