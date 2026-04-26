import { Component, OnInit, inject } from '@angular/core';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-error',
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit{
  private errorService = inject(ErrorService);

  error: string | null = null;

  ngOnInit(): void {
    this.errorService.error$.subscribe((err)=>{
      this.error = err
    })
  }
}
