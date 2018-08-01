var makeSchedule = require('./src/makeSchedule')
var inputData = require('./jsons/input.json')

// var assert = require('assert');
var assert = require('chai').assert
describe('consumedEnergy', function () {
  describe('value', function () {
    it('should be is less than or equal to 38.939', function () {
      assert.isAtMost(JSON.parse(makeSchedule(inputData)).consumedEnergy.value, 38.939)
    })
  })
})
