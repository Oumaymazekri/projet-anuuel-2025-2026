import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductServiceService } from '../../product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'taille', 'marque', 'couleur', 'stock', 'rating', 'image'];

  products: any[] = [];
  currentRoutePath: string = '';
  dataSource = new MatTableDataSource<any>([]);
  url = "http://localhost:3001/images";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private productService: ProductServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("ngOnInit() exécuté !");
    this.route.url.subscribe((urlSegments) => {
      this.currentRoutePath = urlSegments.map(segment => segment.path).join('/');
      console.log("Chemin de la route:", this.currentRoutePath);
    });

    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    // S'assurer que paginator et sort sont bien affectés après l'affichage du template
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchProducts(): void {
    console.log("fetchProducts() exécuté !");
    this.productService.getProducts().subscribe(
      (res) => {
        console.log("Réponse API complète:", res);
  
        if (Array.isArray(res)) {
          this.products = res; // Correction ici
          this.dataSource.data = this.products;
        } else if (res?.data && Array.isArray(res.data)) {
          this.products = res.data;
          this.dataSource.data = this.products;
        } else {
          console.error("Format de réponse inattendu :", res);
        }
      },
      (err) => console.error("Erreur API:", err)
    );
  }
  public getImageUrl(imagePath: string): string {
    return imagePath ? `${this.url}/${imagePath}` : 'assets/default-image.jpg'; // Fallback si l'image est absente
  }
  
  
  

  navigateToProduct(product: any) :void{
  this.router.navigate(['/products', product.id], {
    state: { product: product }
  });
}

  Filterchange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

public formatPrice(price: any): string {
  if (typeof price === 'number') {
    return `${price.toFixed(2)} TND`;
  }
  return price || 'N/A';
}

}
