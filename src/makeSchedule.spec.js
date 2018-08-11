var makeSchedule = require('./makeSchedule')
var inputData = require('../jsons/input.json')
var assert = require('chai').assert

/* Валидация входных данных */
describe('function', () => {
  it('should throw an error when inputData.devices is not an array', () => {
    assert.throws(() => makeSchedule({'devices': 'string', 'rates': [], 'maxPower': 2100}), Error)
  })
  it('should throw an error when inputData.rates is not an array', () => {
    assert.throws(() => makeSchedule({'devices': [], 'rates': 'string', 'maxPower': 2100}), Error)
  })
  it('should throw an error when inputData.maxPower is not a number', () => {
    assert.throws(() => makeSchedule({'devices': [], 'rates': [], 'maxPower': 'string'}), Error)
  })
})

/* Проверка на тестовых данных из задания */
describe('consumedEnergy.value', () => {
  it('should be less than or equal to 38.939 (input data from entrance-task-3-2)', () => {
    assert.isAtMost(makeSchedule(inputData).consumedEnergy.value, 38.939)
  })
})
describe('maxPower in every hour', () => {
  it('should not be more than 2100 (input data from entrance-task-3-2)', () => {
    const schedule = makeSchedule(inputData).schedule
    function findById (arr, id) {
      for (let obj of arr) {
        if (obj.id === id) return obj
      }
    }
    for (let hour in schedule) {
      const maxPower = schedule[hour].reduce((sum, cur) => (sum + findById(inputData.devices, cur).power), 0)
      assert.isAtMost(maxPower, 2100)
    }
  })
})
describe('devices[i].mode', () => {
  it('if the devices[i].mode is defined, then the device should work in the specified period of the day', () => {
    const DAY_OR_NIGHT = [
      'night', 'night', 'night', 'night', 'night', 'night', 'night',
      'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day',
      'night', 'night', 'night'
    ]
    const schedule = makeSchedule(inputData).schedule
    function findById (arr, id) {
      for (let obj of arr) {
        if (obj.id === id) return obj
      }
    }
    for (let hour in schedule) {
      schedule[hour].forEach(id => {
        if (findById(id).mode !== undefined) {
          assert.strictEqual(findById(id).mode, DAY_OR_NIGHT[hour])
        }
      })
    }
  })
})
describe('devices[i].duration', () => {
  it('all devices have completed the full cycle', () => {
    const schedule = makeSchedule(inputData).schedule
    inputData.devices.forEach((device) => {
      let counter = 0
      for (let hour in schedule) {
        if (schedule[hour].indexOf(device.id) !== -1) counter++
      }
      assert.strictEqual(counter, device.duration)
    })
    assert.isAtMost(makeSchedule(inputData).consumedEnergy.value, 38.939)
  })
})
