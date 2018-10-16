/**
 * Created by ApolloYr on 11/17/2017.
 */
import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {SettingsService} from './settings/settings.service';
import {Api} from './api.service';
import {PusherService} from "./pusher.service";
import {SystemService} from "./system.service";

@Injectable()
export class AuthCheck implements Resolve<any> {

    constructor(private router: Router,
                private settings: SettingsService,
                private api: Api,
                private pusherService: PusherService,
                private system: SystemService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.settings.getUserSetting('email')) {
                resolve(true);
            } else if (this.settings.getStorage('token')) {
                this.api.getAccountInfo().subscribe(res => {
                    if (res.success) {
                        this.settings.setAppSetting('is_loggedin', true);
                        this.settings.user = res;

                        this.pusherService.connect();

                        resolve(true);
                    } else {
                        resolve(true);
                    }
                }, err => {
                    this.settings.setStorage('token', false);
                    resolve(true);
                });
            } else {
                resolve(true);
            }
        });
    }
}

