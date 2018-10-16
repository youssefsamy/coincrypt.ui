import {Component, AfterViewInit, OnInit} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "../../services/settings/settings.service";
import {Router} from "@angular/router";
import {PusherService} from "../../services/pusher.service";

declare const $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
    currentLang: any = {};
    constructor(
        public settings: SettingsService,
        public router: Router,
        public pusher: PusherService,
        public translate: TranslateService
    ) {
    }


    ngOnInit() {
    }
    ngAfterViewInit() {

    }

    onLogout() {
        this.settings.setAppSetting('is_loggedin', false);
        this.settings.user = {};
        this.settings.setStorage('token', false);

        // this.pusher.disconnect();

        this.router.navigate(['/']);
    }

    switchMode(mode) {
        this.settings.themeMode = mode;

        if (mode == 'day') {
            $('body').removeClass('night');
            $('body').addClass('day');
        } else {
            $('body').addClass('night');
            $('body').removeClass('day');
        }
    }
}
