import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import Echo from "laravel-echo";
import {Api} from "./api.service";
import {SettingsService} from "./settings/settings.service";

declare var Pusher: any;

@Injectable()
export class PusherService {
    private echo;
    private pusher;
    private publicChannel;
    public btcOrderObserver = new Subject();
    public ethOrderObserver = new Subject();
    public xrpOrderObserver = new Subject();
    public ltcOrderObserver = new Subject();
    public dogeOrderObserver = new Subject();
    public btgOrderObserver = new Subject();
    public bchOrderObserver = new Subject();
    public zecOrderObserver = new Subject();
    public dgbOrderObserver = new Subject();
    public xmrOrderObserver = new Subject();
    public strOrderObserver = new Subject();
    public orderObserver = new Subject();

    constructor(public settings: SettingsService, public api: Api) {

    }

    connect() {
        this.echo = new Echo({
            broadcaster: 'pusher',
            key: this.settings.PUSHER_APP_KEY,
            cluster: this.settings.PUSHER_APP_CLUSTER,
            authEndpoint: this.settings.siteUrl + "/broadcasting/auth",
            auth: {
                headers: {
                    'Authorization': 'Bearer ' + this.settings.getStorage('token')
                }
            }
        });

        this.echo.private('App.User.' + this.settings.getUserSetting('id'))
            .notification((notification) => {
                // check if notification is new message
                console.log('private');
                if (notification.type.endsWith('NewMessageNotification')) {
                    this.settings.user.new_message_count++;
                } else {
                    this.settings.user.new_alert_count++;
                }
            });

        this.publicChannel = this.echo.join('public');

        this.publicChannel.here(() => {
            this.settings.setUserSetting('online', true);
        }).listen('.btc_order', res => {
            this.btcOrderObserver.next(res.data);
        }).listen('.eth_order', res => {
            this.ethOrderObserver.next(res.data);
        }).listen('.xrp_order', res => {
            this.xrpOrderObserver.next(res.data);
        }).listen('.ltc_order', res => {
            this.ltcOrderObserver.next(res.data);
        }).listen('.doge_order', res => {
            this.dogeOrderObserver.next(res.data);
        }).listen('.btg_order', res => {
            this.btgOrderObserver.next(res.data);
        }).listen('.bch_order', res => {
            this.bchOrderObserver.next(res.data);
        }).listen('.zec_order', res => {
            this.zecOrderObserver.next(res.data);
        }).listen('.dgb_order', res => {
            this.dgbOrderObserver.next(res.data);
        }).listen('.xmr_order', res => {
            this.xmrOrderObserver.next(res.data);
        }).listen('.str_order', res => {
            this.strOrderObserver.next(res.data);
        }).listen('.order', res => {
            this.orderObserver.next(res.data);
        });
    }

    disconnect() {
        this.echo.leave('public');
        this.echo.leave('App.User.' + this.settings.getUserSetting('id'));
    }

    getEcho() {
        return this.echo;
    }

    getPublicChannel() {
        return this.publicChannel;
    }

    getBTCOrderEvent():Observable<any> {
        return this.btcOrderObserver;
    }

    getETHOrderEvent():Observable<any> {
        return this.ethOrderObserver;
    }

    getXRPOrderEvent():Observable<any> {
        return this.xrpOrderObserver;
    }

    getLTCOrderEvent():Observable<any> {
        return this.ltcOrderObserver;
    }

    getDOGEOrderEvent():Observable<any> {
        return this.dogeOrderObserver;
    }

    getBTGOrderEvent():Observable<any> {
        return this.btgOrderObserver;
    }

    getBCHOrderEvent():Observable<any> {
        return this.bchOrderObserver;
    }

    getZECOrderEvent():Observable<any> {
        return this.zecOrderObserver;
    }

    getDGBOrderEvent():Observable<any> {
        return this.dgbOrderObserver;
    }

    getXMROrderEvent():Observable<any> {
        return this.xmrOrderObserver;
    }

    getSTROrderEvent():Observable<any> {
        return this.strOrderObserver;
    }

    getOrderEvent(): Observable<any> {
        return this.orderObserver;
    }
}