const request = require('supertest');
const app = require('../app');
const Check = require('../models/check');
const Report = require('../models/report');
const History = require('../models/history');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  checkOneId,
  checkOne,
  reportOneId,
  reportOne,
  setupDatabase,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create check for user', async () => {
  await request(app)
    .post('/checks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'check',
      url: 'www.google.com',
      protocol: 'HTTPS',
    })
    .expect(201);
  const report = await Report.findOne({ check_id: checkOneId });
  expect(report).not.toBeNull();
});

test('run check whihe its status is up ', async () => {
  await request(app)
    .post('/checks/run')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      _id: checkOneId,
    })
    .expect(200);
});

test('run check whihe its status is down ', async () => {
  await request(app)
    .post('/checks/run')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      _id: checkOneId,
    })
    .expect(500);
});

test('Should not delete other users checks', async () => {
  const response = await request(app)
    .delete(`/checks/${checkOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const check = await Check.findById(checkOne._id);
  expect(check).not.toBeNull();
});
