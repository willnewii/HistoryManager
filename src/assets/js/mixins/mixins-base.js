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
        createWindow(url) {
            chrome.tabs.create({
                selected: true,
                url: url
            });
        },
        /*chrome.history.deleteRange({
                               startTime: tempdatas[i].visitTime,
                               endTime: tempdatas[i].visitTime + 1
                           }, () => {
                           });*/
        //删除当前URL的所有记录
        deleteHistory(option) {
            if (!chrome.history) {
                console.log('do deleteHistory');
                return;
            }
            if (option.url) {
                chrome.history.deleteUrl(
                    {
                        url: option.url
                    },
                    () => {}
                );
            }
        },
        //获取历史记录
        //TODO:分页加载
        getHistory(option) {
            if (!chrome.history) {
                let mockDatas = [];

                    mockDatas.push({
                        id: i,
                        referringVisitId: '0',
                        transition: 'link',
                        visitId: '684990',
                        visitTime: 1541413414688.761,
                        date: util.formatTime(1541413414688.761),
                        url: 'https://www.npmjs.com/package/electron-dl',
                        title: i + '---electron-dl - npm',
                        visitCount: 3
                    });
                }

                option.callback && option.callback(mockDatas);
                return;
            }

            option.text = option.text || '';
            option.startTime = option.startTime || 0;
            option.maxResults = option.maxResults || 100;

            let visits = [];
            let getVisitsCount = 0;

            chrome.history.search(
                {
                    text: option.text,
                    startTime: option.startTime,
                    endTime: option.endTime,
                    maxResults: option.maxResults
                },
                (historyItems) => {
                    getVisitsCount = historyItems.length;

                    if (getVisitsCount === 0) {
                        option.callback && option.callback(visits);
                        return;
                    }

                    historyItems.forEach((item) => {
                        chrome.history.getVisits(
                            {
                                url: item.url
                            },
                            (lists) => {
                                getVisitsCount--;
                                let results = lists.filter((value) => {
                                    value.url = item.url;
                                    value.title = item.title;
                                    value.visitCount = item.visitCount;
                                    return value.visitTime >= option.startTime && value.visitTime < option.endTime;
                                });
                                //visits = visits.concat(results);
                                //只显示时间段内最近的一条
                                visits.push(results[results.length - 1]);
                                if (getVisitsCount === 0) {
                                    /*visits.sort(function (a, b) {
                                        return b.visitTime - a.visitTime;
                                    });*/

                                    //格式化时间
                                    visits.forEach((item, index, list) => {
                                        list[index].date = util.formatTime(list[index].visitTime);
                                    });
                                    option.callback && option.callback(visits);
                                }
                            }
                        );
                    });
                }
            );
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
