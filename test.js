var makeSchedule = require('./src/makeSchedule')
var inputData = require('./jsons/input.json')

// var assert = require('assert');
var assert = require('chai').assert
describe('consumedEnergy', function () {
  describe('value', function () {
    it('should be is less than or equal to 38.939', function () {
      // assert.equal([1,2,3].indexOf(4), -1);
      // assert.equal(JSON.parse(makeSchedule(inputData)).consumedEnergy.value, 38.939);
      assert.isAtMost(JSON.parse(makeSchedule(inputData)).consumedEnergy.value, 38.939)
    })
  })
})
