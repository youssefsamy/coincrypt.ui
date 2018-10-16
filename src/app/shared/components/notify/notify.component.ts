import {Component, AfterViewInit, Input} from '@angular/core';
@Component({
    selector: 'page-notify',
    templateUrl: './notify.component.html',
    styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements AfterViewInit {
    @Input() className = 'warning';

    constructor() {

    }

    ngAfterViewInit() {
    }
}