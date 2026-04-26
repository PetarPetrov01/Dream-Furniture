import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import {  Subscription } from 'rxjs';
import { APIProduct } from '../../types/Product';

import { RouterLink } from '@angular/router';
import { LoaderCardComponent } from '../../shared/loader-card/loader-card.component';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

@Component({
    selector: 'app-home',
    imports: [RouterLink, LoaderCardComponent, FloorPricePipe, DecimalSlicePipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
products: APIProduct[] | [] = [];
isLoading: boolean = false;

subscription: Subscription | null = null;

constructor (private apiService: ApiService){
}

  ngOnInit(): void {
    this.isLoading = true;
    
    this.subscription = this.apiService.getProducts({limit: 3, sort: 'createdAt:asc'}).subscribe(products=>{
      setTimeout(()=>{
        this.products = products;
        this.isLoading = false;
      },2000)
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
