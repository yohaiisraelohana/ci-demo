const sum = require('./index');
const assert = require('assert');

assert.strictEqual(sum(1, 2), 3);
assert.strictEqual(sum(0, 0), 0);
assert.strictEqual(sum(-1, -1), -2);

console.log('All tests passed!');
