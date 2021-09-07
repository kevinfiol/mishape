import mishape from './dist/mishape.js';
import { equal } from 'assert';

let res;
let passes = 0;
let failures = 0;

test('Create validator', () => {
    // const validate = mishape({
    //     name: 'string',
    //     age: 'number',
    //     address: 'string',
    //     isMarried: 'boolean',
    //     info: 'object',
    //     wildcard: 'defined',
    //     customMethod: 'function'
    // });

    // res = validate({
    //     name: 'kevin',
    //     age: 100,
    //     address: '1001 Who Cares St.',
    //     isMarried: false,
    //     info: {
    //         doesnt: 1,
    //         matter: 2,
    //         whats: 3,
    //         here: 4
    //     },
    //     wildcard: 'doesntmatterwhats here either',
    //     customMethod: () => 3
    // });

    // equal(res.ok, true);
    // equal(res.errors.length, 0);
});

test ('Create validator with nested properties', () => {
    const validate = mishape({
        name: 'string',
        info: {
            age: 'number',
            moreInfo: {
                nested: {
                    again: {
                        arbitraryData: 'array'
                    }
                }
            }
        }
    });

    // res = validate({
    //     name: 'kevin',
    //     info: {
    //         age: 1999,
    //         moreInfo: {
    //             nested: {
    //                 again: {
    //                     arbitraryData: [1, 2, 3]
    //                 }
    //             }
    //         }
    //     }
    // });

    // equal(res.ok, true);
    // equal(res.errors.length, 0);

    res = validate({
        name: 'doug',
        info: {
            age: 323,
            moreInfo: {
                nested: {
                    again: 'notanobject... hmmmm'
                }
            }
        }
    });

    console.log(res);
});

console.log(`Tests Passed ✓: ${passes}`);
console.warn(`Tests Failed ✗: ${failures}`);

if (failures) logFail(`\n✗ Tests failed with ${failures} failing tests.`);
else logPass(`\n✓ All ${passes} tests passed.`)

function test(label, cb) {
    try {
        cb();
        passes += 1;
    } catch(e) {
        failures += 1;
        logFail(`Failed Test: "${label}", at ${e.message}\n`)
    }
}

function logFail(str) {
    console.error('\x1b[41m%s\x1b[0m', str);
}

function logPass(str) {
    console.log('\x1b[42m%s\x1b[0m', str);
}