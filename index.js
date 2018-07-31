var inputData = {
  "devices": [
      {
          "id": "F972B82BA56A70CC579945773B6866FB",
          "name": "Посудомоечная машина",
          "power": 950,
          "duration": 3,
          "mode": "night"
      },
      {
          "id": "C515D887EDBBE669B2FDAC62F571E9E9",
          "name": "Духовка",
          "power": 2000,
          "duration": 2,
          "mode": "day"
      },
      {
          "id": "02DDD23A85DADDD71198305330CC386D",
          "name": "Холодильник",
          "power": 50,
          "duration": 24
      },
      {
          "id": "1E6276CC231716FE8EE8BC908486D41E",
          "name": "Термостат",
          "power": 50,
          "duration": 24
      },
      {
          "id": "7D9DC84AD110500D284B33C82FE6E85E",
          "name": "Кондиционер",
          "power": 850,
          "duration": 1
      }
  ],
  "rates": [
      {
          "from": 7,
          "to": 10,
          "value": 6.46
      },
      {
          "from": 10,
          "to": 17,
          "value": 5.38
      },
      {
          "from": 17,
          "to": 21,
          "value": 6.46
      },
      {
          "from": 21,
          "to": 23,
          "value": 5.38
      },
      {
          "from": 23,
          "to": 7,
          "value": 1.79
      }
  ],
  "maxPower": 2100
};

function makeSchedule(inputData) {
  var devices = inputData.devices,
      rates = inputData.rates,
      maxPower = inputData.maxPower;

  var dayOrNight = ['night', 'night', 'night', 'night', 'night', 'night', 'night', 
                    'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day', 'day','day', 'day','day',
                    'night', 'night', 'night'];


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
  for (i = 0; i < 24; i++) {
    schedule[i] = [];
  }

  devices.forEach(device => {
    var i = 0;
    while (device.duration > 0) {
      var currentMaxPower = schedule[i].reduce( () => (sum, current) => {return sum + current;}, 0 );
      if (dayOrNight[rates[i].from] === device.mode && currentMaxPower <= maxPower) {
        schedule[i].push[device.id];
        device.duration -= 1;
      }
      i++;
    }

  });

  // devices.forEach( (device) => {
  //   while (device.duration > 0) {
  //     if ( schedule[rates[0].from].reduce( (sum, current) => {return sum + current;}, 0 ) + device.duration <= maxPower ) {
  //       schedule[rates[0].from].push(device);
  //     } else {
  //       schedule[(rates[0].from + 1 < 24) ? rates[0].from + 1 : rates[0].from + 1 - 24].push(device);
  //     }
  //     device.duration -= 1;
  //   }
  // } );





var outputData = JSON.stringify({schedule: schedule});

return outputData;



// schedule[rates[0].from] = [devices[0].id];
// devices[0].duration -= 1;
// console.log(JSON.stringify(schedule));
}



console.log(makeSchedule(inputData));