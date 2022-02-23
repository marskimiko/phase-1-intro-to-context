const createEmployeeRecord = (recArray) => {
  return {
    firstName: recArray[0],
    familyName: recArray[1],
    title: recArray[2],
    payPerHour: recArray[3],
    timeInEvents: [],
    timeOutEvents: [],
  }
}

const createEmployeeRecords = (recordsArray) => {
  return recordsArray.map(rec => createEmployeeRecord(rec))
}

function createTimeInEvent(eRecordObj, dateStamp){
  let obj = {
      type: "TimeIn", 
      hour: parseInt(dateStamp.slice(-4)), 
      date: dateStamp.slice(0, 10)
  }
  eRecordObj.timeInEvents.push(obj)
 
  return eRecordObj
}

function createTimeOutEvent(eRecordObj, dateStamp){
  let obj = {
      type: "TimeOut", 
      hour: parseInt(dateStamp.slice(-4)), 
      date: dateStamp.slice(0, 10)
  }
  eRecordObj.timeOutEvents.push(obj)
 
  return eRecordObj
}

function hoursWorkedOnDate(eRecordObj, targetdate){
 
  let inEvent = eRecordObj.timeInEvents.find(function(eventObj){
    return eventObj.date === targetdate
  })
  let outEvent = eRecordObj.timeOutEvents.find(function(eventObj){
    return eventObj.date === targetdate
  })

  return (outEvent.hour - inEvent.hour) / 100
}

function wagesEarnedOnDate(eRecordObj, targetdate){
  let rawWage = hoursWorkedOnDate(eRecordObj, targetdate) * eRecordObj.payPerHour
  return rawWage;
}

function allWagesFor(eRecordObj) {
  let datesWorked = eRecordObj.timeInEvents.map(function(eventObj){
    return eventObj.date
  })

  let payableWages = datesWorked.reduce(function(accumulator, date){
    return accumulator + wagesEarnedOnDate(eRecordObj, date)
  },0)
  return payableWages;
}

function calculatePayroll(arrOfERecordObj){
  let payroll = [];

  arrOfERecordObj.forEach(employee => {
      payroll.push(allWagesFor(employee)) 
  });

  return payroll.reduce((previousValue, currentValue) => previousValue + currentValue)
}

// ### `calculatePayroll`

// * **Argument(s)**
//   * `Array` of employee records
// * **Returns**
//   * Sum of pay owed to all employees for all dates, as a number
// * **Behavior**
//   * Using `wagesEarnedOnDate`, accumulate the value of all dates worked by the
//     employee in the record used as context. Amount should be returned as a
//     number.