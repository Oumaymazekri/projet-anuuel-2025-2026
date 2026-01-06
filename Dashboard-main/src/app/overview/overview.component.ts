import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../product-service.service';
import { OrdersService } from '../orders.service';
import { CostumersService } from '../costumers.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { TagsService } from '../tags.service';
import { CommentsService } from '../comments.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public product: any[] = [];
  orders: any[] = [];
  public Costumers: any[] = [];
  public Totalamount: number = 0;
  public nbOrders: number = 0;
  public errorMsg: any[] = [];
  public cats: any[] = [];
  public tags: any[] = [];
  public comments: any[] = [];

  constructor(
    private productService: ProductServiceService,
    private orderS: OrdersService,
    private costumerS: CostumersService,
    private http: HttpClient,
    private router: Router,
    private catS: CategoriesService,
    private tagS: TagsService,
    private comment: CommentsService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCostumers();
    this.fetchOrders();
    this.fetchCats();
    this.fetchTags();
    this.fetechComments();
  }

  public fetechComments() {
    this.comment.getComments().subscribe(
      (res: any) => {
        this.comments = res;
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public fetchCats() {
    this.catS.getAllCategories().subscribe(
      (data: any[]) => {
        this.cats = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public fetchTags() {
    this.tagS.getAllTags().subscribe(
      (data: any[]) => {
        this.tags = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  public fetchProducts() {
  this.productService.getProducts().subscribe(
    (res: any) => {
      console.log("..............", res);

      // On stocke tous les clients dans this.Costumers
      this.product = Array.isArray(res) ? res : (res?.products ?? []);
    },
    (err: any) => {
      console.log(err);
    }
  );
}

public fetchCostumers() {
  this.costumerS.getCostumer().subscribe(
    (res: any) => {
      console.log("..............", res);

      // On stocke tous les clients dans this.Costumers
      this.Costumers = Array.isArray(res) ? res : (res?.customers ?? []);
    },
    (err: any) => {
      console.log(err);
    }
  );
}




public fetchOrders() {
  this.orderS.getOrders().subscribe(
    (res: any) => {
      console.log('Response from getOrders():', res);

      // On filtre uniquement celles en attente
      const pendingOrders = (Array.isArray(res) ? res : []).filter(order => order.etatCommande === 'en_attente');

      // Tri décroissant par date de création
      pendingOrders.sort((a, b) => new Date(b.DateCreation).getTime() - new Date(a.DateCreation).getTime());

      // On garde uniquement les 5 dernières
      this.orders = pendingOrders.slice(0, 5);

      this.Totalamount = this.calculateTotalAmountWithStatusTrue(this.orders);
      this.nbOrders = this.getOrderLength(this.orders);
    },
    (error) => {
      console.error('Error fetching orders:', error);
    }
  );
}


  navigateToProduct(productId: string) {
    this.router.navigate(['/products', productId]);
  }

   navigateCustomers() {
    this.router.navigate(['/customers']);
  }
  public deleteProductById(id: string) {
    this.productService.deleteProductById(id).subscribe(
      (res) => {
        console.log(res);
        this.fetchProducts();
      },
      (err) => {
        console.log(err);
      }
    );
  }

formatReadableDate(dateString: any): string {
  if (!dateString) return 'Date non disponible';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Date invalide';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return date.toLocaleString('fr-FR', options);
}

  calculateTotalAmountWithStatusTrue(orders: any[]): number {
    return orders
      .filter(order => order.etatCommande === 'Accepté')
      .reduce((total, order) => total + (order.prixTotal ?? 0), 0);
  }

  getOrderLength(orders: any[]): number {
    return orders.length;
  }

  toggleOrderStatusById(id: string): void {
    const order = this.orders.find(o => o._id === id);
    if (!order) return;

    let newStatus: string;

    switch (order.etatCommande) {
      case 'en_attente':
        newStatus = 'en_attente';
        break;
      case 'Accepté':
        newStatus = 'Accepté';
        break;
      case 'Refusé':
        newStatus = 'Refusé';
        break;
      default:
        return;
    }

    this.orderS.updateOrderStatusById(id, newStatus).subscribe(
      (res) => {
        console.log('Order status updated:', res);
        order.etatCommande = newStatus;
      },
      (err) => {
        console.error('Error updating status:', err);
      }
    );
  }

  deleteOrderById(id: string): void {
    this.orderS.deleteOrderById(id).subscribe(
      (res) => {
        console.log('Order deleted:', res);
        this.orders = this.orders.filter(order => order._id !== id);
      },
      (err) => {
        console.error('Delete order error:', err);
      }
    );
  }

  private updateProductQuantities(result: any, status?: boolean) {
    for (const updatedProduct of result.order.products) {
      const productId = updatedProduct.product._id;
      const allQuantity = parseInt(updatedProduct.product.quantity, 10);
      const subQuantity = parseInt(updatedProduct.quantity, 10);

      const newQuantity = status ? allQuantity - subQuantity : allQuantity + subQuantity;
      const updateUrl = `http://localhost:3000/api/v1/products/product/${productId}`;

      console.log(updatedProduct, newQuantity);

      this.http.put(updateUrl, { quantity: newQuantity }).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          if (error.status === 404) {
            console.log('Product not found.');
          } else {
            console.error(error);
          }
        }
      );
    }
  }

  public deleteCostumer(id: string) {
    this.costumerS.deleteCostumerById(id).subscribe(
      (res: any) => {
        this.fetchCostumers();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public deleteTag(id: string) {
    this.tagS.deleteTagById(id).subscribe(
      (data) => {
        console.log(data);
        this.fetchTags();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public deleteCat(id: string) {
    this.catS.deleteCategoryById(id).subscribe(
      (data) => {
        console.log(data);
        this.fetchCats();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
