import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/utils/slugify.js';

describe('Slug Generator Utility', () => {
  test('Converts title to lowercase dashed slug', () => {
    assert.equal(slugify('JavaScript Fundamentals'), 'javascript-fundamentals');
  });

  test('Strips out special characters and symbols', () => {
    assert.equal(slugify('Full-Stack React & Node.js 100% Pro!'), 'full-stack-react-nodejs-100-pro');
  });

  test('Trims leading and trailing spaces and hyphens', () => {
    assert.equal(slugify('   Advanced Microservices Architecture --- '), 'advanced-microservices-architecture');
  });
});
