import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {ReCaptchaComponent} from "angular2-recaptcha";
import {Api} from "../../services/api.service";
import {NotifyService} from "../../services/notifications.service";
import {SettingsService} from "../../services/settings/settings.service";
import {ValidateService} from "../../services/validate.service";
import {TranslatorService} from "../../services/translator.service";

declare const $: any;
declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.scss']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    sent: boolean = false;

    email = '';
    confirm_userid: any;
    confirmed: boolean = false;

    password: any = '';
    retype_password: any = '';

    constructor(
        public router: Router,
        public api: Api,
        public notify: NotifyService,
        public settings: SettingsService,
        public validate: ValidateService,
        private activatedRoute: ActivatedRoute,
        public translate: TranslatorService
    ) {
        if (this.router.url.includes('/reset_password')) {
            this.activatedRoute.data
                .subscribe(data => {
                    this.confirm_userid = data.user_id;
                    this.confirmed = true;
                });
        }
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {

    }

    handleCorrectCaptcha(event) {

    }

    onSendMail() {
        if (this.email == '' || !this.validate.validateEmail(this.email)) {
            this.notify.showError('Please input valid email.');
            return;
        }

        if (this.captcha.getResponse() == null || this.captcha.getResponse() == '') {
            this.notify.showError('Captcha validation failed.');
            return;
        }

        this.settings.loading = true;
        this.api.sendForgotEmail({
            email: this.email
        }).subscribe(res => {
            this.settings.loading = false;
            if (res.success) {
                this.sent = true;
            } else {
                this.notify.showError(res.error);
            }
        }, err => {
            this.settings.loading = false;
            this.notify.showError('Error');
        })
    }

    onResetPassword() {
        if (this.password == '') {
            return;
        }

        if (this.password != this.retype_password) {
            this.notify.showError('Password not match');
            return;
        }

        if (this.captcha.getResponse() == null || this.captcha.getResponse() == '') {
            this.notify.showError('Captcha validation failed.');
            return;
        }

        this.settings.loading = true;
        this.api.resetPassword({
            user_id: this.confirm_userid,
            password: this.password
        }).subscribe( res=> {
            this.settings.loading = false;
            if (res.success) {
                this.notify.showSuccess('Your password has been reset successfully.');
                this.router.navigate(['/login']);
            } else {
                this.notify.showError(res.error);
            }
        }, err => {
            this.settings.loading = false;
            this.notify.showError('Error');
        });
    }
}
