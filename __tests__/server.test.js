const request = require('supertest');
const app = require('../server');
const path = require('path');

describe('Basic server', () => {
  test('GET /questions returns questions.json', async () => {
    const res = await request(app).get('/questions');
    expect(res.statusCode).toBe(200);
    // content should be JSON or at least text containing 'question'
    expect(res.text.length).toBeGreaterThan(0);
  });

  test('GET / serves index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/<html|<!doctype html>/i);
  });
});
