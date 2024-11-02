const sum = require('./function');

test('adds 1 + 2 to equal 4, doh!', () => {
  expect(sum(1, 2)).toBe(4);
});