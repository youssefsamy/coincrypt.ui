/**
 * Created by ApolloYr on 11/17/2017.
 */

import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {Api} from "./api.service";
import {SettingsService} from "./settings/settings.service";

@Injectable()
export class SystemService {
    constructor(
        public api: Api,
        public settings: SettingsService
    ) {
    }

    init() {
        this.getSystemSettings();
    }

    getSystemSettings() {
    }
}

