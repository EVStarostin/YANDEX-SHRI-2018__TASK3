var makeSchedule  = require('./makeSchedule');
var inputData = require('../jsons/input.json');

const fs = require('fs');

fs.writeFile('./jsons/output.json', makeSchedule(inputData), (err) => {  
  if (err) throw err;
  console.log('File "./jsons/output.json" has been created');
});

