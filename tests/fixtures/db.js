const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Check = require('../../models/check');
const Report = require('../../models/report');
const History = require('../../models/history');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'ahmed',
  email: 'ahmed@gmail.com',
  password: 'zxzx1212',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
  }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'abdallah',
  email: 'abdallah@gmail.com',
  password: 'zxzx1212',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
  }],
};

const checkOneId = new mongoose.Types.ObjectId();
const checkOne = {
  _id: checkOneId,
  name: 'First check',
  url: 'www.google.com',
  protocol: 'HTTPS',
  owner: userOne._id,
};

const reportOneId = new mongoose.Types.ObjectId();
const reportOne = {
  _id: reportOneId,
  status: 'up',
  availability: 100,
  outages: 0,
  downtime: 0,
  uptime: 60,
  checkHistory: { history: 'up' },
  check_id: checkOneId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Check.deleteMany();
  await Report.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Check(checkOne).save();
  await new Report(reportOne).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  checkOneId,
  checkOne,
  reportOneId,
  reportOne,
  setupDatabase,
};
