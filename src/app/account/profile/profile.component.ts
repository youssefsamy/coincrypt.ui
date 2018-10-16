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
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    profile: any = {};

    phonenumber = '';
    constructor(
        public router: Router,
        public api: Api,
        public notify: NotifyService,
        public settings: SettingsService,
        public validate: ValidateService,
        private activatedRoute: ActivatedRoute,
        public translate: TranslatorService
    ) {

    }

    ngOnInit() {
        this.profile = this.settings.getUserSetting('profile');

        $("#phone").intlTelInput({
            placeholderNumberType: "MOBILE",
            utilsScript: 'assets/js/utils.js'
        });

        let phonenumber1 = this.profile.phonenumber;
        setTimeout(function() {
            $("#phone").intlTelInput("setNumber", phonenumber1);
        }, 500);
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
    }

    onBeginVerify() {
        this.profile.phonenumber = $("#phone").intlTelInput("getNumber");

        console.log(this.profile);
        if (this.profile.firstname == null ||
            this.profile.firstname == '' ||
            this.profile.lastname == null ||
            this.profile.lastname == '' ||
            this.profile.address == null ||
            this.profile.address == '' ||
            this.profile.city == null ||
            this.profile.city == '' ||
            this.profile.postalcode == null ||
            this.profile.postalcode == '' ||
            this.profile.phonenumber == null ||
            this.profile.phonenumber == '') {
            this.notify.showError('Please fill all informations');
            return;
        }


        this.settings.loading = true;
        this.api.saveProfile(this.profile).subscribe(res => {
            this.settings.loading = false;
            if (res.success) {
                this.notify.showSuccess('Your profile has been updated successfully. Please wait while we review your profile.');

                this.profile = res.profile;
                this.settings.setUserSetting('profile', this.profile);
            } else {
                this.notify.showError(res.error);
            }
        }, err => {
            this.settings.loading = false;
            this.notify.showError('Error');
        });
    }
}
