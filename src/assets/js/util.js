import dayjs from 'dayjs';

const defaultDesignWidth = 375;

/**
 * 获取整日时间
 * @param {*} day
 * @param {*} month
 * @param {*} year
 */
function getDayTime(day, month, year) {
    let date = new Date();

    switch (arguments.length) {
        case 3:
            date.setFullYear(arguments[2]);
            break;
        case 2:
            date.setFullYear(arguments[2], arguments[1] - 1);
            break;
        case 1:
            date.setFullYear(arguments[2], arguments[1] - 1, arguments[0]);
            break;
    }

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}

function px2rem(px, designWidth) {
    //预判你将会在JS中用到尺寸，特提供一个方法助你在JS中将px转为rem。就是这么贴心。
    if (!designWidth) {
        //如果你在JS中大量用到此方法，建议直接定义 hotcss.designWidth 来定义设计图尺寸;
        //否则可以在第二个参数告诉我你的设计图是多大。
        designWidth = defaultDesignWidth;
    }

    return parseInt(px, 10) * 320 / designWidth / 20;
}

function deepCopy(source) {
    let result = {};
    for (let key in source) {
        result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
    }
    return result;
}

function formatTime(time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

export {px2rem, deepCopy, formatTime, getDayTime};
