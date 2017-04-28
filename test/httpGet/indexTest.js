const expect = require('chai').expect;
const nock = require('nock');

const httpGet = require('../../src/httpGet');

describe('httpGet', () => {
  it('returns http successful response', (done) => {
    nock('https://example.com')
      .get('/hello-world')
      .reply(200, { success: 'ok' });

    httpGet('https://example.com/hello-world').then((response) => {
      expect(response).to.eql({ success: 'ok' });
    }).then(done).catch(err => done(err));
  });

  it('returns http internal server error', (done) => {
    nock('https://example.com')
      .get('/hello-world')
      .replyWithError({ error: 'Something went wrong' });

    httpGet('https://example.com/hello-world').catch((err) => {
      expect(err).to.eql({ error: 'Something went wrong' });
    }).then(done).catch(err => done(err));
  });
});
