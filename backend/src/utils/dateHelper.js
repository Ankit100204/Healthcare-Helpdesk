const {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth
} = require("date-fns");

const getTodayRange = () => ({

    start: startOfDay(new Date()),

    end: endOfDay(new Date())

});

const getWeekRange = () => ({

    start: startOfWeek(new Date()),

    end: endOfWeek(new Date())

});

const getMonthRange = () => ({

    start: startOfMonth(new Date()),

    end: endOfMonth(new Date())

});

module.exports = {

    getTodayRange,

    getWeekRange,

    getMonthRange

};