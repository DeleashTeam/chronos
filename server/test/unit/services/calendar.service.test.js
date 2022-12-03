const mongoose = require('mongoose');

const sum = (a, b) => a + b;

describe('calendar service', () => {
  test('first test', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
