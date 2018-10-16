import * as $ from 'jquery';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutes} from './app.routing';
import {AppComponent} from './app.component';
import {SharedModule} from "./shared/shared.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ServicesModule} from "./services/services.module";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./services/authguard.service";
import {AuthLayoutComponent} from "./layouts/auth/auth-layout.component";
import {HeaderComponent} from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {LoginComponent} from "./pages/login/login.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {ReCaptchaModule} from "angular2-recaptcha";
import {ResetPasswordComponent} from "./pages/resetPassword/resetPassword.component";
import {ConfirmComponent} from "./pages/confirm/confirm.component";
import {ResetPasswordResolver} from "./pages/resetPassword/resetPassword-resolver.service";
import {ExchangeComponent} from "./pages/exchange/exchange.component";
import {AuthCheck} from "./services/authcheck.service";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        AuthLayoutComponent,
        HomeComponent,
        LoginComponent,
        SignupComponent,
        ResetPasswordComponent,
        ConfirmComponent,
        ExchangeComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(AppRoutes, { useHash: true }),
        // RouterModule.forRoot(AppRoutes),
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        ServicesModule,
        BrowserAnimationsModule,
        ReCaptchaModule
    ],
    providers: [
        AuthGuard,
        AuthCheck,
        ResetPasswordResolver
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
