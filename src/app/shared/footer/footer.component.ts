import {Component, AfterViewInit, OnInit} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "../../services/settings/settings.service";
import {Router} from "@angular/router";
import {PusherService} from "../../services/pusher.service";

declare const $: any;

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
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
}
