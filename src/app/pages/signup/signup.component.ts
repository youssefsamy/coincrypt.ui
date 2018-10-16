import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NotifyService} from "../../services/notifications.service";
import {ValidateService} from "../../services/validate.service";
import {ReCaptchaComponent} from "angular2-recaptcha";
import {SettingsService} from "../../services/settings/settings.service";
import {Api} from "../../services/api.service";
import {TranslatorService} from "../../services/translator.service";

declare const $: any;
declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    country_list: any = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","Turks Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

    signupForm: any = {
        country: '',
        email: '',
        agree: false
    };

    registered: boolean = false;

    constructor(
        public router: Router,
        public notify: NotifyService,
        public validate: ValidateService,
        public settings: SettingsService,
        public translate: TranslatorService,
        public api: Api
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

        if (this.signupForm.country == null || this.signupForm.country == '') {
            this.notify.showError("Please select your country.");
            return;
        }

        if (this.signupForm.email == '' || !this.validate.validateEmail(this.signupForm.email)) {
            this.notify.showError("Please enter valid email.");
            return;
        }

        if (this.signupForm.password == null || this.signupForm.password == '') {
            this.notify.showError("Please enter password.");
            return;
        }

        if (this.signupForm.password != this.signupForm.retype_password) {
            this.notify.showError("Password doest not match.");
            return;
        }

        if (this.captcha.getResponse() == null || this.captcha.getResponse() == '') {
            this.notify.showError('Captcha validation failed.');
            return;
        }

        if (!this.signupForm.agree) {
            this.notify.showError("Please agree terms.");
            return;
        }

        this.settings.loading = true;

        this.api.register(this.signupForm).subscribe(res => {
            this.settings.loading = false;
            if (res.success) {
                this.registered = true;
            } else {
                this.notify.showWarning(res.error);
            }
        }, err => {
            this.settings.loading = false;
            this.notify.showError('Error... Plese try again later.');
        });
    }
}
