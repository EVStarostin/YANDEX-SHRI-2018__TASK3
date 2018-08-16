/** @constant {number} */
const MAX_HOUR = 24

/** @constant {string[]} */
const DAY_OR_NIGHT = [
  'night', 'night', 'night', 'night', 'night', 'night', 'night',
  'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day',
  'night', 'night', 'night'
]

/**
 * Возвращает найденное устройство в массиве
 * @param {Object[]} array массив, в котором выполняется поиск
 * @param {string} id ID устройства, которое нужно найти
 * @returns {Object} найденное устройство
 */
function findObjectInArrayById (array, id) {
  for (let obj of array) {
    if (obj.id === id) return obj
  }
}

/**
 * Возвращает true, если час входит в промежуток действия тарифа, false в противном случае
 * @param {Object} rate тариф
 * @param {number} hour час
 * @returns {Boolean}
 */
function condition (rate, hour) {
  if (rate.from > rate.to) {
    return (hour >= rate.from && hour < MAX_HOUR) || hour < rate.to
  } else {
    return rate.from <= hour && hour < rate.to
  }
}

/**
 * Возвращает инкрементированное значение переданного часа.
 * Если следущее значение счетчика больше 23, то возвращает 0
 * @param {number} hour час
 * @returns {number} час, увеличенный на единицу
 */
function step (hour) {
  if (++hour < MAX_HOUR) {
    return hour++
  } else {
    return 0
  }
}

/**
 * Возвращает стоимость часа
 * @param {Object[]} rates массив тарифов
 * @param {number} hour час
 * @returns {number}
 */
function getRateValue (rates, hour) {
  for (let rate of rates) {
    if (condition(rate, hour)) {
      return rate.value / 1000
    }
  }
}

/**
 * Рассчитывает и возвращает расписание работы устройств
 * @param {{devices: Object[], rates: Object[], maxPower: number}} inputData список устройств, тарифы и максимальная мощность в час
 * @returns {} расписание работы устройств, стоимость потребленной электроэнергии по устройствам и общая
 */
function makeSchedule (inputData) {
  const devices = inputData.devices.map((obj) => Object.assign({}, obj))
  const rates = inputData.rates.map((obj) => Object.assign({}, obj))
  const maxPower = inputData.maxPower

  if (
    !Array.isArray(devices) ||
    !Array.isArray(rates) ||
    !(!isNaN(parseFloat(maxPower)) && isFinite(maxPower))
  ) {
    throw new Error()
  }

  devices.sort((a, b) => {
    if ((a.mode !== undefined && b.mode !== undefined) || (a.mode === undefined && b.mode === undefined)) {
      return a.power < b.power
    } else if (a.mode === undefined && b.mode !== undefined) {
      return 1
    } else {
      return -1
    }
  })

  rates.sort((a, b) => a.value - b.value)

  const schedule = {}
  for (let i = 0; i < 24; i++) {
    schedule[i] = []
  }
  const consumedEnergy = {value: 0, devices: {}}

  devices.forEach(device => {
    for (let rate of rates) {
      for (let hour = rate.from; condition(rate, hour); hour = step(hour)) {
        const devicesPower = schedule[hour].reduce((sum, currentID) => { return sum + findObjectInArrayById(devices, currentID).power }, 0)
        if ((device.mode && device.mode !== DAY_OR_NIGHT[hour]) || devicesPower + device.power > maxPower) continue
        schedule[hour].push(device.id)
        consumedEnergy.value += findObjectInArrayById(devices, device.id).power * getRateValue(rates, hour)
        if (consumedEnergy.devices[device.id] === undefined) {
          consumedEnergy.devices[device.id] = findObjectInArrayById(devices, device.id).power * getRateValue(rates, hour)
        } else {
          consumedEnergy.devices[device.id] += findObjectInArrayById(devices, device.id).power * getRateValue(rates, hour)
        }
        device.duration -= 1
        if (device.duration === 0) break
      }
      if (device.duration === 0) break
    }
  })

  consumedEnergy.value = Math.round(consumedEnergy.value * 10000) / 10000
  for (let key in consumedEnergy.devices) {
    consumedEnergy.devices[key] = Math.round(consumedEnergy.devices[key] * 10000) / 10000
  }

  const outputData = {schedule: schedule, consumedEnergy: consumedEnergy}
  return outputData
}

module.exports = makeSchedule
