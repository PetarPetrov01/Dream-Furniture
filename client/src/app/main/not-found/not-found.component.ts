import {  NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';


import {MatButtonModule} from '@angular/material/button'

@Component({
    selector: 'app-not-found',
    imports: [NgIf, MatButtonModule, RouterLink],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit{
  private activated = inject(ActivatedRoute);

  productId: string | null = null;

  ngOnInit(): void {
    this.activated.url.subscribe(url=>{
      if(url[0]?.path == 'products'){
        this.productId = url[1].path;
      }
    })
  }
}
