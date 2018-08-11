// Константы
const MAX_HOUR = 24
const DAY_OR_NIGHT = [
  'night', 'night', 'night', 'night', 'night', 'night', 'night',
  'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day',
  'night', 'night', 'night'
]

/* Функция для нахождения объекта в массиве по id
Первым аргументом получает массив: array<{}>, вторым id: string */
function findObjectInArrayById (array, id) {
  for (let obj of array) {
    if (obj.id === id) return obj
  }
}

/* Проверка, что час входит в промежуток действия тарифа
На входе принимает тариф и час
Возвращает true если час входит в промежуток, false в противном случае */
function condition (rate, hour) {
  if (rate.from > rate.to) {
    return (hour >= rate.from && hour < MAX_HOUR) || hour < rate.to
  } else {
    return rate.from <= hour && hour < rate.to
  }
}

/* Функция увеличения счетчика.
Если следущее значение счетчика больше 23, то счетчик обнуляется  */
function step (hour) {
  if (++hour < MAX_HOUR) {
    return hour++
  } else {
    return 0
  }
}

/* Функция для определения стоимости часа
На вход принимает час, стоимость которого нужно определить и список тарифов
На выходе возвращает стоимость часа */
function getRateValue (rates, hour) {
  for (let rate of rates) {
    if (condition(rate, hour)) {
      return rate.value / 1000
    }
  }
}

/* Функция, рассчитывающая раписание работы устройств
Принимает объект с списоком устройств, тарифы и максимальную мощность в час
Возвращает расписание работы устройств, стоимость общей потребленной энергии и с разбивкой по устройствам */
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
