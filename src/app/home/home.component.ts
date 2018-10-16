import {Component, OnInit, AfterViewInit, OnDestroy, AfterContentInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Api} from "../services/api.service";
import {SettingsService} from "../services/settings/settings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PusherService} from "../services/pusher.service";
import {SystemService} from "../services/system.service";
import {TranslatorService} from "../services/translator.service";
import {ValidateService} from "../services/validate.service";
import {NotifyService} from "../services/notifications.service";

declare const $: any;
declare const window: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(public router: Router,
                public api: Api,
                public settings: SettingsService,
                public validate: ValidateService,
                public notify: NotifyService,
                public system: SystemService,
                public translator: TranslatorService
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

    onClickSignup() {
        this.router.navigate(['/signup']);
    }
}
