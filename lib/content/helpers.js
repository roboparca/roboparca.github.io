// lib/content/helpers.js
const crypto = require('crypto');

function simpleHash(str) {
  return crypto.createHash('md5').update(String(str)).digest().readUInt32BE(0);
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

module.exports = {
  simpleHash,
  pick
};
