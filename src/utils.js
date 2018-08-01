var CONSTANTS = require('./constants');

// Функция для нахождения объекта в массиве по id
// Первым аргументом получает массив: array<{}>, вторым id: string
function findObjectInArrayById(array, id) {
  for (obj of array) {
    if (obj.id === id) return obj;
  }
}

function condition(rate, hour) {
  if (rate.from > rate.to) {
    return hour >= rate.from && hour < CONSTANTS.MAX_HOUR || hour < rate.to;
  } else {
    return rate.from <= hour && hour < rate.to;
  }
}

function step(hour) {
  if (++hour < CONSTANTS.MAX_HOUR) {
    return hour++
  } else {
    return 0;
  }
}

function getRateValue(rates, hour) {
  for (rate of rates) {
    if ( condition(rate, hour) ) {
      return rate.value / 1000;
    }
  }
}

module.exports = {
  findObjectInArrayById,
  condition,
  step,
  getRateValue
};