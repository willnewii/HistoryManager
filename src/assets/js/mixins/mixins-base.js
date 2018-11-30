import mockData from '../../../mock';
import * as util from '../util';

export default {
    beforeRouteEnter(to, from, next) {
        //页面未创建,不能访问this
        //console.log('beforeRouteEnter:' + to.name);
        next();
    },
    beforeRouteLeave(to, from, next) {
        //console.log('beforeRouteLeave:' + from.name);
        this.pagePause();
        next();
    },
    created() {
        if (this.$route.meta && this.$route.meta.title) {
            this.title = this.$route.meta.title;
        }
    },
    data() {
        return {
            title: '',
            inChrome: chrome.history
        };
    },
    methods: {
        //获取历史记录
        getHistory(option) {
            if (!chrome.history) {
                option.callback && option.callback(mockData.visitData.slice(0, 50));
                return;
            }

            option.text = option.text || '';
            option.startTime = option.startTime || 0;
            option.maxResults = option.maxResults || 100;

            let visits = [];
            let getVisitsCount = 0;

            chrome.history.search({
                    'text': option.text,
                    'startTime': option.startTime || 0,
                    'endTime': option.endTime,
                    'maxResults': option.maxResults
                },
                (historyItems) => {
                    getVisitsCount = historyItems.length;

                    if (getVisitsCount === 0) {
                        option.callback && option.callback(visits);
                        return;
                    }

                    for (let item of historyItems) {
                        chrome.history.getVisits({
                            url: item.url
                        }, (lists) => {
                            getVisitsCount--;
                            let results = lists.filter((value) => {
                                value.url = item.url;
                                value.title = item.title;
                                value.visitCount = item.visitCount;
                                return (value.visitTime >= option.startTime && value.visitTime < option.endTime);
                            });
                            //visits = visits.concat(results);
                            //只显示时间段内最近的一条
                            visits.push(results[results.length - 1]);
                            if (getVisitsCount === 0) {

                                /*visits.sort(function (a, b) {
                                    return b.visitTime - a.visitTime;
                                });*/

                                for (let i = 0; i < visits.length; i++) {
                                    visits[i].date = util.formatTime(visits[i].visitTime);
                                }
                                option.callback && option.callback(visits);
                            }
                        });
                    }
                });
        },
        pagePause() {
            this._pagePause && this._pagePause();
        },
        pushPage(action) {
            let rou = {
                name: action.name
            };

            if (action.query) {
                rou.query = action.query;
            }

            if (action.params) {
                rou.params = action.params;
            }
            this.$router.push(rou);
        }
    }
};
