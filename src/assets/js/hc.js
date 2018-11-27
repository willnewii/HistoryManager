import Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';

HighchartsMore(Highcharts);
HighchartsNoData(Highcharts);

Highcharts.setOptions({
    lineColors: ['#FD653C', '#54628A', '#72609C', '#985858', '#D08A61', '#9C6078', '#A579AE', '#D8A48F', '#CE8D9A', '#7989AE', '#BD6969', '#E53E38', '#ff9e48'],
    lang: {
        loading: '加载中...',
        noData: '数据更新中...',
        rangeSelectorZoom: ''
    }
});

/*Highcharts.dateFormat = function (formatter, value) {
    let date = new Date(parseInt(value));
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};*/

export default Highcharts;