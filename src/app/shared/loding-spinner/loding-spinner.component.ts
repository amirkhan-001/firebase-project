import { style } from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    selector: 'app-loding-spinner',
    template: `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`,
    styleUrls:['./loding-spinner.component.css']
})
export class LodingSpinnerComponent{}