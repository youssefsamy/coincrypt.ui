import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {ReCaptchaComponent} from "angular2-recaptcha";
import {Api} from "../../services/api.service";
import {NotifyService} from "../../services/notifications.service";
import {SettingsService} from "../../services/settings/settings.service";
import {ValidateService} from "../../services/validate.service";

declare const $: any;
declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './changePassword.component.html',
    styleUrls: ['./changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    old_password: any = '';
    new_password: any = '';
    retype_password: any = '';

    constructor(
        public router: Router,
        public api: Api,
        public notify: NotifyService,
        public settings: SettingsService,
        public validate: ValidateService,
        private activatedRoute: ActivatedRoute
    ) {

    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {

    }

    handleCorrectCaptcha(event) {

    }

    onChangePassword() {
        if (this.old_password == '' || this.new_password == '') {
            return;
        }

        if (this.new_password != this.retype_password) {
            this.notify.showError('Password not match');
            return;
        }

        if (this.captcha.getResponse() == null || this.captcha.getResponse() == '') {
            this.notify.showError('Captcha validation failed.');
            return;
        }

        this.settings.loading = true;
        this.api.changePassword({
            old_password: this.old_password,
            password: this.new_password
        }).subscribe( res=> {
            this.settings.loading = false;
            if (res.success) {
                this.notify.showSuccess('Your password has been changed successfully.');
            } else {
                this.notify.showError(res.error);
            }
        }, err => {
            this.settings.loading = false;
            this.notify.showError('Error');
        });
    }
}
