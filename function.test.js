const sum = require('./function');

test('adds 1 + 2 to equal 4, doh!', () => {
  expect(sum(1, 2)).toBe(4);
});

test('less than 0', () => {
    expect(sum(-3, 2)).toBe(-1);
});