import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {SettingsService} from "../../services/settings/settings.service";
import {Api} from "../../services/api.service";
import {NotifyService} from "../../services/notifications.service";
import {TranslatorService} from "../../services/translator.service";

declare const $: any;
declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

    signinForm: any = {
        email: '',
        password: ''
    };

    res: any = {};

    constructor(
        public router: Router,
        public settings: SettingsService,
        public api: Api,
        public notify: NotifyService,
        public translate: TranslatorService
    ) {
        // if (this.router.url.includes('/confirmed')) {
        //     this.confirmed_user_email = activatedRouteSnapshot.params['user_id'];
        // }
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {

    }

    onSignup() {
        this.router.navigate(['signup']);
    }

    successLogin() {
        this.settings.user = this.res;
        this.settings.setAppSetting('is_loggedin', true);
        this.settings.setStorage('token', this.res.token);

        if (this.res.role == 'admin') {
            this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/profile']);
        }
        // this.pusherService.connect();
    }

    onSignin() {
        if (this.signinForm.email == '' || this.signinForm.password == '') {
            return;
        }

        this.settings.loading = true;

        this.api.login(this.signinForm).subscribe(res => {
            this.settings.loading = false;
            if (res.success) {
                this.res = res;
                this.successLogin();
            } else {
                this.notify.showError(res.error);
            }
        }, err => {
            this.settings.loading = false;
            this.notify.showError('Error');
        });
    }
}
