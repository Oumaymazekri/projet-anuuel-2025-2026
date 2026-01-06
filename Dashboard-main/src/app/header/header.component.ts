import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public errorMsg: any[] = [];
  public divTop = '-200px'; 

  constructor(private productService: ProductServiceService) {}

  togglePosition() {
    this.divTop = this.divTop === '-200px' ? '60px' : '-200px';
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (res) => {
        if (res?.data) {
          this.errorMsg = res.data
            .filter((product: any) => product.quantity === 0)
            .map((product: any) => ({
              name: product.name,
              id: product._id,
              image: product.image || 'assets/default-image.png', // Image par défaut si absente
              errorMessage: `Error: Quantity for ${product.name} is 0. Please update the quantity.`,
            }));
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des produits", error);
      }
    );
  }

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  public formatPrice(price: any) {
    if (typeof price === 'number') return `${price}$`;
    if (typeof price === 'string') return price.includes('$') ? price : `${price}$`;
    return 'N/A';
  }
}
