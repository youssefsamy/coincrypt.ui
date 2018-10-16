import { Routes } from '@angular/router';
import {AuthGuard} from "./services/authguard.service";
import {AuthCheck} from "./services/authcheck.service";
import {HomeComponent} from "./home/home.component";
import {AuthLayoutComponent} from "./layouts/auth/auth-layout.component";
import {LoginComponent} from "./pages/login/login.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {ResetPasswordComponent} from "./pages/resetPassword/resetPassword.component";
import {ConfirmComponent} from "./pages/confirm/confirm.component";
import {ResetPasswordResolver} from "./pages/resetPassword/resetPassword-resolver.service";
import {ComingSoonComponent} from "./shared/components/coming/coming.component";
import {ExchangeComponent} from "./pages/exchange/exchange.component";

export const AppRoutes: Routes = [
    {
        path: '', component: AuthLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'exchange',
                component: ExchangeComponent
            },
            {
                path: 'margin',
                component: ComingSoonComponent
            },
            {
                path: 'lending',
                component: ComingSoonComponent
            },
            {
                path: 'mining',
                component: ComingSoonComponent
            },
            {
                path: 'school',
                component: ComingSoonComponent
            },
            {
                path: 'incubator',
                component: ComingSoonComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            },
            {
                path: 'resetPassword',
                component: ResetPasswordComponent
            },
            {
                path: 'reset_password/:code',
                component: ResetPasswordComponent,
                resolve: {
                    user_id: ResetPasswordResolver
                }
            },
            {
                path: 'confirm',
                component: ConfirmComponent
            }
        ],
        resolve: {
            AuthCheck
        }
    },
    {
        path: '',
        component: AuthLayoutComponent,
        loadChildren: './account/account.module#AccountModule',
        resolve: {
            AuthGuard
        }
    },
    // {
    //     path: '',
    //     loadChildren: './pages/pages.module#PagesModule',
    //     resolve: {
    //         AuthGuard
    //     }
    // },
    { path: '**', redirectTo: '' }
];
