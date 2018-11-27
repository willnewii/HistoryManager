import dayjs from 'dayjs';

/**
 * 统计域名浏览量
 * @param visitData
 */
function getPageView(visitData) {
    let dates = [];
    let count = [];

    for (let item of visitData) {
        let dateObj = dayjs(item.visitTime);
        let date = dateObj.format('YYYY-MM-DD');

        if (dates.indexOf(date) !== -1) {
            ++count[dates.indexOf(date)];
        } else {
            dates.push(date);
            count[dates.length - 1] = 1;
        }
    }

    dates.reverse();
    count.reverse();

    return {dates, count};
}

export {getPageView};