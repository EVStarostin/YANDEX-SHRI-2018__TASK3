var makeSchedule = require('./makeSchedule')
var inputData = require('../jsons/input.json')
var assert = require('chai').assert

/* Валидация входных данных */
describe('function', function () {
  it('should throw an error when inputData.devices is undefined', function () {
    assert.throws(() => makeSchedule({'rates': [], 'maxPower': 2100}), Error)
  })
  it('should throw an error when inputData.devices is not an array', function () {
    assert.throws(() => makeSchedule({'devices': 'string', 'rates': [], 'maxPower': 2100}), Error)
  })
  it('should throw an error when inputData.rates is undefined', function () {
    assert.throws(() => makeSchedule({'devices': [], 'maxPower': 2100}), Error)
  })
  it('should throw an error when inputData.rates is not an array', function () {
    assert.throws(() => makeSchedule({'devices': [], 'rates': 'string', 'maxPower': 2100}), Error)
  })
  it('should throw an error when inputData.maxPower is undefined', function () {
    assert.throws(() => makeSchedule({'devices': [], 'rates': []}), Error)
  })
  it('should throw an error when inputData.maxPower is not a number', function () {
    assert.throws(() => makeSchedule({'devices': [], 'rates': [], 'maxPower': 'string'}), Error)
  })
})

/* Проверка на тестовых данных из задания */
describe('consumedEnergy.value', function () {
  it('should be less than or equal to 38.939 (input data from entrance-task-3-2)', function () {
    assert.isAtMost(makeSchedule(inputData).consumedEnergy.value, 38.939)
  })
})
describe('maxPower in every hour', function () {
  it('should not be more than 2100 (input data from entrance-task-3-2)', function () {
    const schedule = makeSchedule(inputData).schedule
    const devices = inputData.devices
    function findById (arr, id) {
      for (let obj of arr) {
        if (obj.id === id) return obj
      }
    }
    for (let hour in schedule) {
      const maxPower = schedule[hour].reduce((sum, cur) => (sum + findById(devices, cur).power), 0)
      assert.isAtMost(maxPower, 2100)
    }
  })
})
