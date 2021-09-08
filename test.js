import mishape from './dist/mishape.js';
import { equal, notEqual } from 'assert';

let res;
let passes = 0;
let failures = 0;

test('Create validator', () => {
    const validate = mishape({
        name: 'string',
        age: 'number',
        address: 'string',
        isMarried: 'boolean',
        info: 'object',
        wildcard: 'defined',
        customMethod: 'function'
    });

    res = validate({
        name: 'kevin',
        age: 100,
        address: '1001 Who Cares St.',
        isMarried: false,
        info: {
            doesnt: 1,
            matter: 2,
            whats: 3,
            here: 4
        },
        wildcard: 'doesntmatterwhats here either',
        customMethod: () => 3
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);
});

test('Create validator with nested properties', () => {
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

    res = validate({
        name: 'kevin',
        info: {
            age: 1999,
            moreInfo: {
                nested: {
                    again: {
                        arbitraryData: [1, 2, 3]
                    }
                }
            }
        }
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);

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

    equal(res.ok, false);
    equal(res.errors.length, 1);
});

test('Test missing properties', () => {
    let validate = mishape({
        age: 'number',
        test: 'object'
    });

    res = validate({
        age: 10
    });

    equal(res.ok, false);
    equal(res.errors.length, 1);

    validate = mishape({
        age: 'number',
        foo: {
            bar: {
                twothousand: 2000
            },
            baz: 'boolean'
        }
    });

    res = validate({
        age: 21,
        foo: {
            bar: {

            }
        }
    });

    equal(res.ok, false);
    equal(res.errors.length, 2);
});

test('Implicit required object type', () => {
    const validate = mishape({
        foo: {},
        bar: {
            one: {
                two: {

                }
            }
        }
    });

    res = validate({
        foo: 2,
        bar: {
            one: {}
        }
    });

    equal(res.ok, false);
    equal(res.errors.length, 2);
    notEqual(res.errors[0].message.indexOf('Expected object, got: 2 at foo'), -1);
});

test('Custom validator', () => {
    const validate = mishape({
        title: 'string',
        data: {
            length: (x, is) => is.number(x) && x > 0
        }
    });

    res = validate({
        title: 'My Iron Lung',
        data: {
            length: 0
        }
    });

    equal(res.ok, false);
    equal(res.errors.length, 1);
    notEqual(res.errors[0].message.indexOf('Expected length, got: 0 at data.length'), -1);

    res = validate({
        title: 'I Might Be Wrong',
        data: {
            length: 3
        }
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);
});

test('Deeply nested objects', () => {
    const validate = mishape({
        one: {
            foo: 'number',
            two: {
                bar: 'boolean',
                three: {
                    fn: 'function'
                }
            },
            list: 'array',
            complexList: (x, is) => is.array(x) && x.length == 3 && is.string(x[0]),
            nested: {
                woo: {
                    war: {
                        whatisit: {
                            goodfor: 'string'
                        }
                    }
                }
            }
        }
    });

    // passes
    res = validate({
        one: {
            foo: 2,
            two: {
                bar: true,
                three: {
                    fn: () => 3
                }
            },
            list: [1, 2],
            complexList: ['a str', 2, 3],
            nested: {
                woo: {
                    war: {
                        whatisit: {
                            goodfor: 'absolutely nothing'
                        }
                    }
                }
            }
        }
    });

    equal(res.ok, true);
    equal(res.errors.length, 0);

    // fails
    res = validate({
        one: {
            foo: 1,
            two: {
                bar: false,
                three: {
                    fn: 0
                }
            },
            list: [],
            complexList: [1,2,3],
            nested: {
                woo: {
                    war: {
                        whatisit: {
                            goodfor: 0
                        }
                    }
                }
            }
        }
    });

    equal(res.ok, false);
    equal(res.errors.length, 3);
    notEqual(res.errors[0].message.indexOf('Expected function, got: 0 at one.two.three.fn'), -1);
    notEqual(res.errors[1].message.indexOf('Expected complexList, got: 1,2,3 at one.complexList'), -1);
    notEqual(res.errors[2].message.indexOf('Expected string, got: 0 at one.nested.woo.war.whatisit.goodfor'), -1);
});

test('Test custom type map', () => {
    const validate = mishape({
        data: 'object',
        age: 'MinimumAge'
    }, {
        object: (x, is) => is.object(x) && !is.array(x),
        MinimumAge: (x, is) => is.number(x) && x >= 21
    });

    res = validate({ data: [1, 2, 3], age: 20 });

    equal(res.ok, false);
    equal(res.errors.length, 2);
});

test('Union types', () => {
    const validate = mishape({
        foo: 'string|number',
        bar: 'boolean|function'
    });

    res = validate({ foo: 2, bar: false });
    equal(res.ok, true);

    res = validate({ foo: 'string', bar: () => 0 });
    equal(res.ok, true);

    res = validate({ foo: [], bar: 'not a boolean|function' });
    equal(res.ok, false);
    equal(res.errors.length, 2);
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