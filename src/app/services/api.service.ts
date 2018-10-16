/**
 * Created by ApolloYr on 11/17/2017.
 */

import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import {SettingsService} from './settings/settings.service';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import * as _ from 'lodash';
import {Observable} from "rxjs";

@Injectable()
export class Api {
    constructor(private http: HttpClient,
                private router: Router,
                public settings: SettingsService) {
    }

    createAuthorizationHeader() {
        return new HttpHeaders().set('Authorization', 'Bearer ' + this.settings.getStorage('token'));
    }

    get(url, data?) {
        let headers = this.createAuthorizationHeader();

        return this.http.get(this.settings.apiUrl + url, {
            headers: headers,
            params: data
        }).map(res => res).catch((error: any) => this.handleError(this, error));
    }

    post(url, data) {
        let headers = this.createAuthorizationHeader();

        return this.http.post(this.settings.apiUrl + url, data, {
            headers
        }).map(res => res).catch((error: any) => this.handleError(this, error));
    }

    put(url, data) {
        let headers = this.createAuthorizationHeader();

        return this.http.put(this.settings.apiUrl + url, data, {
            headers: headers
        }).map(res => res).catch((error: any) => this.handleError(this, error));
    }

    handleError(_parent, error: any) {
        if ((error.status == 401 || error.status == 400) && error.url && !error.url.endsWith('/login')) {
            console.log('unauthorized');
            if (_parent.settings) _parent.settings.setStorage('token', false);
            if (_parent.settings) _parent.settings.setAppSetting('is_loggedin', false);
            _parent.router.navigate(['/']);
        }
        // In a real world app, you might use a remote logging infrastructure

        return Observable.throw(error);
    }

    uploadFile(file) {
        let headers = this.createAuthorizationHeader();

        var formData = new FormData();

        formData.append("file", file, file.name);

        return this.http.post(this.settings.apiUrl + '/upload/file', formData, {
            headers: headers
        }).map(res => res).catch((error: any) => this.handleError(this, error));
    }

    getAccountInfo() {
        return this.get('/account');
    }

    login(data): any {
        return this.post('/login', data);
    }

    resetPassword(data) {
        return this.post('/reset_password', data);
    }

    register(data): any {
        return this.post('/register', data);
    }

    changePassword(data) {
        return this.post('/account/change_password', data);
    }

    sendForgotEmail(data) {
        return this.post('/account/sendForgotEmail', data);
    }

    sendActivateEmail(data) {
        return this.post('/account/sendActivateEmail', data);
    }

    confirmResetCode(data) {
        return this.post('/confirm_resetcode', data);
    }

    saveProfile(data) {
        return this.post('/account/profile', data);
    }

    getSellOrders(data) {
        return this.post('/order/getSellOrders', data);
    }

    getBuyOrders(data) {
        return this.post('/order/getBuyOrders', data);
    }

    buyOrder(data) {
        return this.post('/order/buyOrder', data);
    }

    sellOrder(data) {
        return this.post('/order/sellOrder', data);
    }

    getMarketTrades(data) {
        return this.post('/order/getMarketTrades', data);
    }

    getMyTrades(data) {
        return this.post('/order/getMyTrades', data);
    }

    getMyOpenOrders(data) {
        return this.post('/order/getMyOpenOrders', data);
    }

    deleteOpenOrder(data) {
        return this.post('/order/deleteOpenOrder', data);
    }

    getSummary(data) {
        return this.post('/transaction/getSummary', data);
    }

    getCoinPairs(data) {
        return this.get('/coin/getCoinPairs', data);
    }

    getCoinsInfo(data) {
        return this.get('/coin/coinsInfo', data);
    }
}

