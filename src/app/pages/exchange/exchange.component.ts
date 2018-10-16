import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Api} from "../../services/api.service";
import {SettingsService} from "../../services/settings/settings.service";
import {NotifyService} from "../../services/notifications.service";
import {CoinPairService} from "../../services/coinpair.service";
import {Subject} from "rxjs";
import {PusherService} from "../../services/pusher.service";
import {takeUntil} from "rxjs/operators";

declare const $: any;
declare const anychart: any;

@Component({
    selector: 'app-exchange',
    templateUrl: './exchange.component.html',
    styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit, AfterViewInit, OnDestroy {

    selCurrency = 'USD';
    selCoin = 'BTC';

    selPairCurrency = 'USD';
    selPairCoin = 'BTC';
    selPairCoinName = 'Bitcoin Cash';

    coins: any = [];
    public coinsInfo: any = {
        'BTC': [],
        'ETH': [],
        'USD': [],
        'EURO': []
    };
    public seletedCoin: any;

    isCoinInfoLoaded = false;

    filtertxt = '';

    showOnlyStar = false;

    lastColumn = 'name';

    sortInfo: any = {
        USD: {
            sortColumn: '',
            sortOrder: ''
        },
        EURO: {
            sortColumn: '',
            sortOrder: ''
        },
        BTC: {
            sortColumn: '',
            sortOrder: ''
        },
        ETH: {
            sortColumn: '',
            sortOrder: ''
        }
    };

    buyOrder = {
        price: 0,
        amount: 0,
        total: 0
    }

    sellOrder = {
        price: 0,
        amount: 0,
        total: 0
    }

    sellOrders: any = [];
    buyOrders: any = [];

    marketTradeHistory: any = [];
    myTradeHistory: any = [];
    myOpenOrdrs: any = [];

    selTradeInfo = 'market_trade';

    private ngUnsubscribe = new Subject();

    constructor(public router: Router,
                public api: Api,
                public settings: SettingsService,
                public notify: NotifyService,
                private coinPair: CoinPairService,
                public pusher: PusherService) {
        // if (this.router.url.includes('/confirmed')) {
        //     this.confirmed_user_email = activatedRouteSnapshot.params['user_id'];
        // }
    }

    ngOnDestroy() {
        console.log('destroy');
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngOnInit() {

        this.pusher.getOrderEvent().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
                this.onOrderEvent(data);
            });

        this.loadDatas();
        this.getCoinsInfo();

        let _parent = this;
        anychart.onDocumentReady(function () {
            // The data used in this sample can be obtained from the CDN
            // https://cdn.anychart.com/csv-data/csco-daily.csv
            anychart.data.loadCsvFile(_parent.settings.apiUrl + '/market/chart/data', function (data) {
                // create data table on loaded data
                data = $.parseJSON(data);

                let dataTable = anychart.data.table();
                dataTable.addData(data);

                // map loaded data for the ohlc series
                let mapping = dataTable.mapAs({'open': 1, 'high': 2, 'low': 3, 'close': 4});

                // map loaded data for the scroller
                let scrollerMapping = dataTable.mapAs();
                scrollerMapping.addField('value', 5);

                // create stock chart
                let chart = anychart.stock();

                // create first plot on the chart
                let plot = chart.plot(0);
                // set grid settings
                plot.yGrid(true)
                    .xGrid(true)
                    .yMinorGrid(true)
                    .xMinorGrid(true);

                // create EMA indicators with period 50
                plot.ema(dataTable.mapAs({'value': 4})).series().stroke('1.5 #000');

                // let background = chart.background();
                // background.fill({
                //     keys: [
                //         "#fff"
                //     ],
                // });

                let series = plot.candlestick(mapping);
                series.name('COINCRYPT');
                series.legendItem().iconType('rising-falling');

                // create scroller series with mapped data
                chart.scroller().candlestick(mapping);

                // set chart selected date/time range
                chart.selectRange('2018-01-01', '2018-02-22');

                // set container id for the chart
                chart.container('chart');
                // initiate chart drawing
                chart.draw();

                // create range picker
                // let rangePicker = anychart.ui.rangePicker();
                // // init range picker
                // rangePicker.render(chart);

                // create range selector
                let rangeSelector = anychart.ui.rangeSelector();
                // init range selector

                rangeSelector.ranges([
                    {
                        'type': 'Unit',
                        'unit': 'minute',
                        'count': 5,
                        'text': '5min'
                    },
                    {
                        'type': 'Unit',
                        'unit': 'minute',
                        'count': 15,
                        'text': '15min'
                    },
                    {
                        'type': 'Unit',
                        'unit': 'minute',
                        'count': 30,
                        'text': '30min'
                    },
                    {
                        'type': 'Unit',
                        'unit': 'hour',
                        'count': 6,
                        'text': '6hour'
                    }, {
                        'type': 'Unit',
                        'unit': 'hour',
                        'count': 24,
                        'text': '24hour'
                    }, {
                        'type': 'Unit',
                        'unit': 'day',
                        'count': 2,
                        'text': '2day'
                    }, {
                        'type': 'Unit',
                        'unit': 'day',
                        'count': 4,
                        'text': '4day'
                    }, {
                        'type': 'Unit',
                        'unit': 'day',
                        'count': 7,
                        'text': '1week'
                    }, {
                        'type': 'Unit',
                        'unit': 'month',
                        'count': 1,
                        'text': '1month'
                    }]);

                rangeSelector.render(chart);
            });
        });

    }

    loadDatas() {

        this.getBuyOrders();       ///// get buy orders according to selected coin pairs
        this.getSellOrders();
        this.getMarketTrades();

        if (this.settings.getAppSetting('is_loggedin')) {
            this.getMyTrades();
            this.getMyOpenOrders();
        }
    }

    ngAfterViewInit() {
        $('html').click(function () {
            $('.toolPanel').hide();
        });

        $('.tools').click(function (e) {
            e.stopPropagation();
            $('.toolPanel').show();
        });

        $('.toolPanel').click(function (e) {
            e.stopPropagation();
        });
    }

    filterCoin() {
        if (this.selCurrency == 'USD') {
            this.coins = this.coinsInfo['USD'];
        } else if (this.selCurrency == 'EURO') {
            this.coins = this.coinsInfo['EURO'];
        } else if (this.selCurrency == 'BTC') {
            this.coins = this.coinsInfo['BTC'];
        } else if (this.selCurrency == 'ETH') {
            this.coins = this.coinsInfo['ETH'];
        }

        this.coins = this.coins.filter(
            coin => coin.coin.indexOf(this.filtertxt) !== -1 || coin.coin_name.indexOf(this.filtertxt) !== -1);

        if (this.showOnlyStar) {
            this.coins = this.coins.filter(
                coin => !coin.star_off);
        }

        if (this.sortInfo[this.selCurrency].sortColumn != '') {
            console.log(this.sortInfo[this.selCurrency].sortColumn);
            let _parent = this;
            this.coins = this.coins.sort(function (r1, r2) {
                if (_parent.sortInfo[_parent.selCurrency].sortOrder == 'asc') {
                    if (_parent.sortInfo[_parent.selCurrency].sortColumn == 'star_off') {
                        return r1['star_off'] ? -1 : 1;
                    } else {
                        return r1[_parent.sortInfo[_parent.selCurrency].sortColumn] > r2[_parent.sortInfo[_parent.selCurrency].sortColumn] ? 1 : (r1[_parent.sortInfo[_parent.selCurrency].sortColumn] == r2[_parent.sortInfo[_parent.selCurrency].sortColumn] ? 0 : -1);
                    }
                } else {
                    if (_parent.sortInfo[_parent.selCurrency].sortColumn == 'star_off') {
                        return r1['star_off'] ? 1 : -1;
                    } else {
                        return r1[_parent.sortInfo[_parent.selCurrency].sortColumn] < r2[_parent.sortInfo[_parent.selCurrency].sortColumn] ? 1 : (r1[_parent.sortInfo[_parent.selCurrency].sortColumn] == r2[_parent.sortInfo[_parent.selCurrency].sortColumn] ? 0 : -1);
                    }
                }
            });
        }
    }

    onFilter() {
        this.filterCoin();
    }

    onSelectCurrency(currency) {
        this.selCurrency = currency;
        this.filterCoin();
    }

    onClickCoin(coin) {
        this.selPairCurrency = this.selCurrency;

        this.selCoin = coin.coin;
        this.selPairCoin = coin.coin;
        this.selPairCoinName = coin.coin_name;

        this.seletedCoin = coin;

        this.loadDatas();
    }

    onClickSellOrder(order) {
        this.buyOrder.price = order.rate;
        this.buyOrder.amount = order.amount;
        this.buyOrder.total = order.total;
    }

    onClickBuyOrder(order) {
        this.sellOrder.price = order.rate;
        this.sellOrder.amount = order.amount;
        this.sellOrder.total = order.total;
    }

    onSortTable(header) {
        if (this.sortInfo[this.selCurrency].sortColumn == header && this.sortInfo[this.selCurrency].sortOrder == 'asc') {
            this.sortInfo[this.selCurrency].sortOrder = 'desc';
        } else {
            this.sortInfo[this.selCurrency].sortOrder = 'asc';
        }

        this.sortInfo[this.selCurrency].sortColumn = header;

        console.log(this.sortInfo);
        this.filterCoin();
    }

    onClickStar(coin) {
        if (coin.star_off) {
            coin.star_off = false;
        } else {
            coin.star_off = true;
        }

        this.filterCoin();
    }

    onShowOnlyStar() {
        this.showOnlyStar = !this.showOnlyStar;

        this.filterCoin();
    }

    onClickLastRowSetting(value) {
        this.lastColumn = value;

        $('.toolPanel').hide();
    }

    onClickStarSetting(setting) {
        if (setting == 'all') {
            for (var i = 0; i < this.coins.length; i++) {
                this.coins[i].star_off = false;
            }
        } else {
            for (var i = 0; i < this.coins.length; i++) {
                this.coins[i].star_off = true;
            }
        }

        $('.toolPanel').hide();
    }

    getCoinsInfo() {
        this.isCoinInfoLoaded = false;
        this.api.getCoinsInfo({}).subscribe(res => {
            if (res.success) {
                this.coinsInfo.BTC = res.data.filter(pair => pair.pair_coin === 'BTC');
                this.coinsInfo.ETH = res.data.filter(pair => pair.pair_coin === 'ETH');
                this.coinsInfo.USD = res.data.filter(pair => pair.pair_coin === 'USD');
                this.coinsInfo.EURO = res.data.filter(pair => pair.pair_coin === 'EURO');

                this.coins = this.coinsInfo.USD;

                this.seletedCoin = this.coins.filter(coin => coin.coin == this.selPairCoin)[0];
                console.log(this.seletedCoin);

                this.isCoinInfoLoaded = true;
            }
        })
    }

    getBuyOrders() {
        this.api.getBuyOrders({
            src_currency: this.selPairCurrency,
            dest_currency: this.selPairCoin
        }).subscribe(res => {
            if (res.success) {
                this.buyOrders = res.data;
                this.sortBuyOrders();

                this.updateMarketDepthChart();
            } else {
                this.notify.showError(res.error);
            }
        })
    }

    getSellOrders() {
        this.api.getSellOrders({
            src_currency: this.selPairCoin,
            dest_currency: this.selPairCurrency
        }).subscribe(res => {
            if (res.success) {
                this.sellOrders = res.data;
                this.sortSellOrders();

                //this.updateMarketDepthChart();
            } else {
                this.notify.showError(res.error);
            }
        });
    }

    sortBuyOrders() {
        for (let i = 0; i < this.buyOrders.length; i++) {
            this.buyOrders[i]['total'] = this.buyOrders[i]['rate'] * this.buyOrders[i]['amount'];
            if (i == 0) {
                this.buyOrders[i]['sum'] = this.buyOrders[i]['total'];
                this.buyOrders[i]['sum_coin'] = Number(this.buyOrders[i]['amount']);
            } else {
                this.buyOrders[i]['sum'] = this.buyOrders[i]['total'] + this.buyOrders[i - 1]['sum'];
                this.buyOrders[i]['sum_coin'] = Number(this.buyOrders[i]['amount']) + this.buyOrders[i - 1]['sum_coin'];
            }
        }

        console.log(this.buyOrders);
    }

    sortSellOrders() {
        for (let i = 0; i < this.sellOrders.length; i++) {
            this.sellOrders[i]['total'] = this.sellOrders[i]['rate'] * this.sellOrders[i]['amount'];
            if (i == 0) {
                this.sellOrders[i]['sum'] = this.sellOrders[i]['total'];
                this.sellOrders[i]['sum_coin'] = Number(this.sellOrders[i]['amount']);
            } else {
                this.sellOrders[i]['sum'] = this.sellOrders[i]['total'] + this.sellOrders[i - 1]['sum'];
                this.sellOrders[i]['sum_coin'] = Number(this.sellOrders[i]['amount']) + this.sellOrders[i - 1]['sum_coin'];
            }
        }

        console.log(this.sellOrders);
    }

    sendBuyOrder() {
        console.log(this.buyOrder.price);
        if (this.buyOrder.price == 0) {
            this.notify.showWarning('Price field required');
            return;
        }

        if (this.buyOrder.amount == 0) {
            this.notify.showWarning('Amount field required');
            return;
        }

        this.api.buyOrder({
            src_currency: this.selPairCurrency,
            dest_currency: this.selPairCoin,
            rate: this.buyOrder.price,
            amount: this.buyOrder.amount
        }).subscribe(res => {
            if (res.success) {

            } else {
                this.notify.showError(res.error);
            }
        })
    }

    sendSellOrder() {
        if (this.sellOrder.price == 0) {
            this.notify.showWarning('Price field required');
            return;
        }

        if (this.sellOrder.amount == 0) {
            this.notify.showWarning('Amount field required');
            return;
        }

        this.api.sellOrder({
            src_currency: this.selPairCoin,
            dest_currency: this.selPairCurrency,
            rate: this.sellOrder.price,
            amount: this.sellOrder.amount
        }).subscribe(res => {
            if (res.success) {

            } else {
                this.notify.showError(res.error);
            }
        })
    }

    getMarketTrades() {
        this.api.getMarketTrades({
            coin1: this.selPairCurrency,
            coin2: this.selPairCoin
        }).subscribe(res => {
            if (res.success) {
                this.marketTradeHistory = res.data;
            }
        })
    }

    getMyTrades() {
        if (this.settings.getAppSetting('is_loggedin')) {
            this.api.getMyTrades({
                coin1: this.selPairCurrency,
                coin2: this.selPairCoin
            }).subscribe(res => {
                if (res.success) {
                    console.log(res);
                    this.myTradeHistory = res.data;
                }
            })
        }
    }

    getMyOpenOrders() {
        if (this.settings.getAppSetting('is_loggedin')) {
            this.api.getMyOpenOrders({
                coin1: this.selPairCurrency,
                coin2: this.selPairCoin
            }).subscribe(res => {
                if (res.success) {
                    this.myOpenOrdrs = res.data;
                }
            })
        }
    }

    deleteOpenOrder(i) {
        this.api.deleteOpenOrder({
            id: this.myOpenOrdrs[i]['id']
        }).subscribe(res => {
            console.log(res);
        })
    }

    changeBuyOrderTotal() {
        console.log('change');
        if (typeof this.buyOrder.total != 'undefined' && this.buyOrder.total != 0) {
            if (typeof this.buyOrder.price != 'undefined' && this.buyOrder.price != 0) {
                this.buyOrder.amount = this.precisionRound(this.buyOrder.total / this.buyOrder.price, 8);
            }
        }
    }

    changeBuyOrderAmount() {
        console.log('change');
        if (typeof this.buyOrder.amount != 'undefined' && this.buyOrder.amount != 0) {
            if (typeof this.buyOrder.price != 'undefined' && this.buyOrder.price != 0) {
                this.buyOrder.total = this.precisionRound(this.buyOrder.amount * this.buyOrder.price, 8);
            }
        }
    }

    precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

    onOrderEvent(data) {
        console.log(data);

        this.updateBuyOrders(data);
        this.updateSellOrders(data);
        this.updateMarketTradeInfo(data);

        if (this.selPairCurrency == data.selPairCurrency && this.selPairCoin == data.selPairCoin) {
            this.getMyOpenOrders();
            this.getMyTrades();
        }

        if (data.type == 'sendOrder' && data.last_price && data.last_price != '' && data.last_price > 0) {
            let pair = this.coinsInfo[data.selPairCurrency].filter(pair => pair.coin == data.selPairCoin)[0];

            pair.last_price = data.last_price;
            pair.change = pair.first_price > 0 ? (pair.last_price - pair.first_price) * 100 / pair.first_price : 0;

            if (pair.last_price > Number(pair.high)) {
                pair.high = pair.last_price;
            }
            if (pair.last_price < Number(pair.low)) {
                pair.low = pair.last_price;
            }
            if (data.trade_amount > 0) {
                pair.volume = Number(pair.volume) + data.trade_amount;
                pair.currency_volume = Number(pair.currency_volume) + data.trade_currency_amount;
            }
        }
    }

    updateMarketTradeInfo(data) {
        if (data.type == 'sendOrder') {
            if (data.last_price && data.last_price != '' && data.last_price > 0) {
                if (this.selPairCurrency == data.selPairCurrency && this.selPairCoin == data.selPairCoin) {
                    console.log('yes');

                    this.getMarketTrades();
                } else {
                    console.log('no');
                }
            }
        } else if (data.type == 'deleteOrder') {

        }

    }

    updateBuyOrders(data) {

        if (data.type == 'sendOrder') {
            if (this.selPairCurrency == data.selPairCurrency && this.selPairCoin == data.selPairCoin) {
                let order = this.buyOrders.filter(order => Number(order.rate) == Number(data.rate));

                if (order.length > 0 && Number(data.buyAmount) <= 0) {
                    this.buyOrders = this.buyOrders.filter(order => Number(order.rate) != Number(data.rate));
                } else if (order.length > 0 && Number(data.buyAmount) > 0) {
                    order[0].amount = data.buyAmount;
                } else if (order.length == 0 && Number(data.buyAmount) > 0) {
                    this.buyOrders.push({
                        rate: data.rate,
                        amount: data.buyAmount
                    });
                    this.buyOrders = this.buyOrders.sort(function (r1, r2) {
                        return Number(r1.rate) < Number(r2.rate) ? 1 : -1;
                    });
                }

                this.sortBuyOrders();
            }
        } else if (data.type == 'deleteOrder') {
            if (data.order_type == 0) {
                let order = this.buyOrders.filter(order => Number(order.rate) == Number(data.rate));
                if (order.length > 0) {
                    order[0].amount -= data.amount
                    if (Number(order[0].amount) <= 0) {
                        this.buyOrders = this.buyOrders.filter(order => Number(order.rate) != Number(data.rate));
                    }

                    this.sortBuyOrders();
                }
            }
        }

    }

    updateSellOrders(data) {
        if (data.type == 'sendOrder') {
            if (this.selPairCurrency == data.selPairCurrency && this.selPairCoin == data.selPairCoin) {
                let order = this.sellOrders.filter(order => Number(order.rate) == Number(data.rate));

                if (order.length > 0 && Number(data.sellAmount) <= 0) {
                    this.sellOrders = this.sellOrders.filter(order => Number(order.rate) != Number(data.rate));
                } else if (order.length > 0 && Number(data.sellAmount) > 0) {
                    order[0].amount = data.sellAmount;
                } else if (order.length == 0 && Number(data.sellAmount) > 0) {
                    this.sellOrders.push({
                        rate: data.rate,
                        amount: data.sellAmount
                    });
                    this.sellOrders = this.sellOrders.sort(function (r1, r2) {
                        return Number(r1.rate) > Number(r2.rate) ? 1 : -1;
                    });
                }

                this.sortSellOrders();

            }
        } else if (data.type == 'deleteOrder') {
            if (data.order_type == 1) {
                let order = this.sellOrders.filter(order => Number(order.rate) == Number(data.rate));
                if (order.length > 0) {
                    order[0].amount -= data.amount
                    if (Number(order[0].amount) <= 0) {
                        this.sellOrders = this.sellOrders.filter(order => Number(order.rate) != Number(data.rate));
                    }

                    this.sortSellOrders();
                }
            }
        }

    }

    updateMarketDepthChart() {
        let sellOrdersData = this.sellOrders.map(x => Object.assign({}, x));
        let buyOrdersData = this.buyOrders.map(x => Object.assign({}, x));

        console.log(sellOrdersData, buyOrdersData);


        let _parent = this;
        anychart.onDocumentReady(function () {
            let buyData = [];
            let sellData = [];

            for (let i = 0; i < _parent.buyOrders.length; i++) {
                if (buyData.length == 0) {
                    buyData.unshift([_parent.buyOrders[i]['rate'], Number(_parent.buyOrders[i]['amount'])]);
                } else {
                    buyData.unshift([_parent.buyOrders[i]['rate'], Number(_parent.buyOrders[i]['amount']) + buyData[0][1]]);
                }
            }

            for (let i = 0; i < _parent.sellOrders.length; i++) {
                if (sellData.length == 0) {
                    sellData.push([_parent.sellOrders[i]['rate'], Number(_parent.sellOrders[i]['amount'])]);
                } else {
                    sellData.push([_parent.sellOrders[i]['rate'], Number(_parent.sellOrders[i]['amount']) + sellData[sellData.length - 1][1]]);
                }
            }



            console.log(buyData)
            // create a chart
            let chart = anychart.area();

            // create an area series and set the data
            var series = chart.area(buyData);
            var series1 = chart.area(sellData);

            // set the container id
            chart.container("depth-chart");

            // initiate drawing the chart
            chart.draw();
        })
    }

}
