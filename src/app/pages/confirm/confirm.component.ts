import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Api} from "../../services/api.service";
import {SettingsService} from "../../services/settings/settings.service";
import {NotifyService} from "../../services/notifications.service";
import {ReCaptchaComponent} from "angular2-recaptcha";

declare const $: any;
declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    signinForm: any = {
        email: '',
        password: ''
    };

    res: any = {};
    constructor(
        public router: Router,
        public api: Api,
        public settings: SettingsService,
        public notify: NotifyService
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


    handleCorrectCaptcha(event) {

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
            this.router.navigate(['/']);
        }
        // this.pusherService.connect();
    }

    onSignin() {
        if (this.signinForm.email == '' || this.signinForm.password == '') {
            return;
        }

        if (this.captcha.getResponse() == null || this.captcha.getResponse() == '') {
            this.notify.showError('Captcha validation failed.');
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
