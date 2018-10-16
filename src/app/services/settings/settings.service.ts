/**
 * Created by ApolloYr on 11/17/2017.
 */
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class SettingsService {
    public PUSHER_APP_KEY = '94252f3d48a1de771d1a';
    public PUSHER_APP_CLUSTER = 'ap1';

    public siteUrl = environment.server;
    public apiUrl= environment.server + '/api';

    public user: any;
    public app: any;
    public system: any;

    public loading: boolean = false;
    public themeMode = 'day';



    public buyCoins= ['USD', 'EURO', 'BTC', 'ETH'];

    private storagePrefix = 'market_';

    constructor(
    ) {
        // User settings
        this.user = {};

        // App Settings
        this.app = {
            name: 'Market'
        };

        this.system = {};
    }

    getUserSetting(name) {
        return name ? this.user[name] : this.user;
    }

    setUserSetting(name, value) {
        this.user[name] = value;
    }

    getAppSetting(name) {
        return name ? this.app[name] : this.app;
    }

    setAppSetting(name, value) {
        this.app[name] = value;
    }

    getSystemSetting(name) {
        return name ? this.system[name] : this.system;
    }

    setSystemSetting(name, value) {
        if (typeof this.system[name] !== 'undefined') {
            this.system[name] = value;
        }
    }

    clearUserSetting() {
        this.setStorage('user', false);
    }

    getStorage (key, defaultVal?) {
        return window.localStorage[this.storagePrefix + key] ?
            JSON.parse(window.localStorage[this.storagePrefix + key]) : defaultVal || false;
    }

    setStorage (key, val) {
        window.localStorage.setItem(this.storagePrefix + key, JSON.stringify(val));
    }

}

