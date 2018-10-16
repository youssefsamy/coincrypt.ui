import {Routes, RouterModule} from '@angular/router';
import {AuthLayoutComponent} from "../layouts/auth/auth-layout.component";
import {ChangePasswordComponent} from "./changePassword/changePassword.component";
import {ComingSoonComponent} from "../shared/components/coming/coming.component";
import {ProfileComponent} from "./profile/profile.component";

export const AccountRoutes: Routes = [
    {
        path: 'transfers',
        component: ComingSoonComponent
    },
    {
        path: 'balances',
        component: ComingSoonComponent
    },
    {
        path: 'depositHistory',
        component: ComingSoonComponent
    },
    {
        path: 'openOrders',
        component: ComingSoonComponent
    },
    {
        path: 'tradeHistory',
        component: ComingSoonComponent
    },
    {
        path: '2fa',
        component: ComingSoonComponent
    },
    {
        path: 'feeTier',
        component: ComingSoonComponent
    },
    {
        path: 'loginHistory',
        component: ComingSoonComponent
    },
    {
        path: 'changePassword',
        component: ChangePasswordComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
];
