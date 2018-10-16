import {NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {PasswordValidation} from "./components/password-validator.component";
import {FieldErrorDisplayComponent} from "./components/field-error-display/field-error-display.component";
import {LoaderComponent} from "./components/loader/loader.component";
import {ComingSoonComponent} from "./components/coming/coming.component";
import {ModalDialogComponent} from "./components/dialog/modal.dialog.component";
import {TableLoaderComponent} from "./components/table-loader/table-loader.component";
import {NotifyComponent} from "./components/notify/notify.component";

@NgModule({
    exports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FieldErrorDisplayComponent,
        LoaderComponent,
        TableLoaderComponent,
        ComingSoonComponent,
        ModalDialogComponent,
        NotifyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        FieldErrorDisplayComponent,
        LoaderComponent,
        TableLoaderComponent,
        ComingSoonComponent,
        ModalDialogComponent,
        NotifyComponent
    ]
})

export class SharedModule {}
