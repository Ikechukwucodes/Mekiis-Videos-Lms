import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('Server Foundation & Health Check', () => {
  test('GET / returns API welcome information', async () => {
    const response = await request(app).get('/');
    assert.equal(response.status, 200);
    assert.equal(response.body.message, 'Welcome to the LMS API Platform');
  });

  test('GET /api/health returns healthy status', async () => {
    const response = await request(app).get('/api/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, 'healthy');
  });
});
