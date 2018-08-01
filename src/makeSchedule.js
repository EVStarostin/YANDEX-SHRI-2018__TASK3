var utils = require('./utils');
var CONSTANTS = require('./constants');

function makeSchedule(inputData) {
  var devices = inputData.devices,
      rates = inputData.rates,
      maxPower = inputData.maxPower;

  devices = devices.sort( (a, b) => {
    if ( (a.mode !== undefined && b.mode !== undefined) || (a.mode === undefined && b.mode === undefined) ) {
      return a.power < b.power;
    } else if (a.mode === undefined && b.mode !== undefined) {
      return 1;
    } else {
      return -1;
    }
  } );

  rates.sort( (a, b) => a.value - b.value );

  var schedule = {};
  for (var i = 0; i < 24; i++) {
    schedule[i] = [];
  }
  var consumedEnergy = {value: 0, devices: {}};

  devices.forEach( device => {
    for (rate of rates) {
      for (var hour = rate.from; utils.condition(rate, hour); hour = utils.step(hour)) {
        var devicesPower = schedule[hour].reduce( (sum, currentID) => {return sum + utils.findObjectInArrayById(devices, currentID).power;}, 0 );
        if (device.mode && device.mode !== CONSTANTS.DAY_OR_NIGHT[hour] || devicesPower + device.power > maxPower) continue;
        schedule[hour].push(device.id);
        consumedEnergy.value += utils.findObjectInArrayById(devices, device.id).power * utils.getRateValue(rates, hour);
        if (consumedEnergy.devices[device.id] === undefined) {
          consumedEnergy.devices[device.id] = utils.findObjectInArrayById(devices, device.id).power * utils.getRateValue(rates, hour);
        } else {
          consumedEnergy.devices[device.id] += utils.findObjectInArrayById(devices, device.id).power * utils.getRateValue(rates, hour);
        }
        device.duration -= 1;
        if (device.duration === 0) break;
      }
      if (device.duration === 0) break;
    }
  } );

  consumedEnergy.value = Math.round(consumedEnergy.value * 10000) / 10000;
  for (key in consumedEnergy.devices) {
    consumedEnergy.devices[key] = Math.round(consumedEnergy.devices[key] * 10000) / 10000;
  }

  var outputData = {schedule: schedule, consumedEnergy: consumedEnergy};
  return JSON.stringify(outputData);
}

module.exports = makeSchedule;