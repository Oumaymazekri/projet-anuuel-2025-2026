import { Component, OnInit } from '@angular/core';
import { CostumersService } from '../costumers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  public result: any[] = [];

  constructor(
    private router: Router,
    private costumers: CostumersService
  ) {}

ngOnInit(): void {
  this.costumers.getCostumer().subscribe(
    (res: any[]) => {
      console.log(res);
      // Ne garder que ceux avec role 'client'
      this.result = res.filter(customer => customer.role === 'client');
    },
    (err) => {
      console.error(err);
    }
  );
}

  navigateTo(id: string,customer: any): void {
  this.router.navigate(['/customers', id], { state: { customer } });
}

  getImageUrl(imageName: string): string {
  return imageName ? `http://localhost:3000/images/${imageName}` : 'http://localhost:3000/images/profileImage';
}

  formatReadableDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
