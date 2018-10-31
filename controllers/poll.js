import mongoose from 'mongoose';
import moment from 'moment';

import * as EthCtrl from './eth';

const Poll = mongoose.model('Poll');

export const findAll = (req, res, next) => {
  Poll.find().exec().then((polls) => {
    res.status(203).send(polls);
  })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
    });
};

export const create = async (req, res, next) => {
  const { eventID, ownerID, title, description, startDate, endDate, candidates } = req.body;
  try {
    let poll = new Poll({
      eventID, ownerID, title, description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      candidates: JSON.parse(candidates)
    });
    poll.id = poll._id.toString();
    console.log(poll);

    // Deploy new smart contract
    poll = EthCtrl.deployPollContract({ poll });
    console.log('Contract is deployed');
    console.log(poll);

    // Save poll to mongo
    poll = await poll.save();

    return res.status(200).send(poll);

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

export const findOne = async (req, res, next) => {
  // TODO
};
