var makeSchedule = require('./src/makeSchedule');
var inputData = require('./jsons/input.json');

var assert = require('assert');
describe('consumedEnergy', function() {
  describe('value', function() {
    it('should return 38.939 for test input data', function() {
      // assert.equal([1,2,3].indexOf(4), -1);
      assert.equal(JSON.parse(makeSchedule(inputData)).consumedEnergy.value, 38.939);
    });
  });
});