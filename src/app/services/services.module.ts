/**
 * Created by ApolloYr on 11/18/2017.
 */

import {NgModule} from '@angular/core';
import {SettingsService} from "./settings/settings.service";
import {SecureHttpService} from "./securehttp.service";
import {Api} from "./api.service";
import {AuthGuard} from "./authguard.service";
import {ValidateService} from "./validate.service";
import {PusherService} from "./pusher.service";
import {SystemService} from "./system.service";
import {TranslatorService} from "./translator.service";
import {NotifyService} from "./notifications.service";
import {AuthCheck} from "./authcheck.service";
import {CoinPairService} from "./coinpair.service";

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        SettingsService,
        SecureHttpService,
        Api,
        AuthGuard,
        NotifyService,
        ValidateService,
        PusherService,
        SystemService,
        TranslatorService,
        AuthCheck,
        CoinPairService
    ],
    exports: []
})
export class ServicesModule {
}
