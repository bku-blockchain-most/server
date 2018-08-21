require('dotenv').config();

const Web3 = require('web3');

const config = require('../config');

/** Contract compiled by `truffle compile` */
const TestVotingContractJSON = require('../build/contracts/TestVoting.json');

const web3 = new Web3(new Web3.providers.HttpProvider(config.eth.provider));

/**
 * Add to wallet, can use sendTransaction()
 * Dont have to sign to transaction manually
 */
const privateKey = config.eth.ropstenPrivateKey;
const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
web3.eth.accounts.wallet.add(account);

/** Set the default account, used to `from` */
web3.eth.defaultAccount = account.address;
console.log('Account address:', account.address);

const { abi, bytecode } = TestVotingContractJSON;

const TestVotingContract = new web3.eth.Contract(abi);
const exampleSecretKeyContract = 'example secret key contract';

const txInstance = TestVotingContract.deploy({
  data: bytecode,
  arguments: [web3.utils.toHex(exampleSecretKeyContract)]
});
// 0x6578616d706c6520736563726574206b657920636f6e7472616374

const deploy = async () => {
  try {
    const gasLimit = await txInstance.estimateGas();
    console.log('Gas limit:', gasLimit);

    const newContractInstance = await txInstance.send({
      from: web3.eth.defaultAccount,
      gas: gasLimit,
      gasPrice: web3.utils.toHex(1e9)
    });

    console.log(newContractInstance.options.address);
    // 0x422224e853c74c5faf2412Ebaeb27Fd2Ddba8614
    // 0x3901F718886701D5AD8676BF623eB8BEdbe4FBF7

  } catch (err) {
    console.log(err);
  }
};

deploy();