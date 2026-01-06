import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CostumersService } from '../costumers.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  public costumer: any;

  constructor(
    private router: Router,
    private costumerS: CostumersService
  ) {}

  ngOnInit(): void {
    this.costumer = history.state.customer;

    if (!this.costumer) {
      // Pas de client en state, on redirige
      this.router.navigate(['/customers']);
    }
  }
  getImageUrl(imageName: string): string {
  return imageName ? `http://localhost:3000/images/${imageName}` : 'http://localhost:3000/images/profileImage';
}
  public delete() {
    this.costumerS.deleteCostumerById(this.costumer._id).subscribe(
      (res: any) => {
        this.router.navigate(['/customers']);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  public formatPrice(price: any) {
    if (typeof price === 'string') {
      if (price.includes('$')) {
        return price.replace('$', '') + '$';
      } else {
        return price + '$';
      }
    } else if (typeof price === 'number') {
      return price.toString() + '$';
    } else {
      return 'N/A';
    }
  }

}
