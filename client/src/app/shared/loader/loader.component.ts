import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-loader',
    imports: [NgIf],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.css'
})
export class LoaderComponent {
  @Input()color: string = '#fff'
  @Input()diameter: string = '48px'
  @Input()width: string = '5px'
  @Input()type: ('spinner' | 'dots') = 'spinner';
}
