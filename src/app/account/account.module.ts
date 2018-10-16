import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SIDEBAR_TOGGLE_DIRECTIVES } from '../shared/sidebar.directive';
import {RouterModule} from "@angular/router";
import {AccountRoutes} from "./account.routing";
import {SharedModule} from "../shared/shared.module";
import {ChangePasswordComponent} from "./changePassword/changePassword.component";
import {ReCaptchaModule} from "angular2-recaptcha";
import {ProfileComponent} from "./profile/profile.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AccountRoutes),
        SharedModule,
        ReCaptchaModule
    ],
    declarations: [
        SIDEBAR_TOGGLE_DIRECTIVES,
        ChangePasswordComponent,
        ProfileComponent
    ]
})
export class AccountModule { }
