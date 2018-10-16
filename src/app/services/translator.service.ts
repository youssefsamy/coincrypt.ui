/**
 * Created by ApolloYr on 11/17/2017.
 */

import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class TranslatorService {
    private defaultLang: string = 'en';
    private currentLang: string;

    private langs = [
        { code: 'en', text: 'English', shortName: 'EN', flagIcon: 'flag-icon-gb' }
    ];

    constructor(public translate: TranslateService) {
        if (!translate.getDefaultLang())
            translate.setDefaultLang(this.defaultLang);

        this.useLanguage(this.defaultLang);
    }

    useLanguage(lang: string = null) {
        this.currentLang = lang;
        this.translate.use(lang || this.translate.getDefaultLang());
    }

    getLanguages() {
        return this.langs;
    }

    getCurrentLang() {
        for (var i = 0; i < this.langs.length; i ++) {
            if (this.langs[i].code == this.currentLang) {
                return this.langs[i];
            }
        }
        return {};
    }
}

