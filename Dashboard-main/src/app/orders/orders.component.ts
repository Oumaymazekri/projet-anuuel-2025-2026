import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { ProductServiceService } from '../product-service.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog.component'; // adapte le chemin


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];        // tableau d'orders
  selectedOrder: any = null; // order sélectionné pour afficher détails

  constructor(
    private http: HttpClient,
    private orderS: OrdersService,
    private productS: ProductServiceService,
    private dialog: MatDialog,
  private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderS.getOrders().subscribe(
      (res: any[]) => {
        this.orders = res;  // Assure-toi que res est un tableau d'orders
        console.log('Orders loaded:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  showProductDetails(index: number): void {
    this.selectedOrder = this.orders[index];
  }

  closeProductModal(): void {
    this.selectedOrder = null;
  }

  formatReadableDate(dateString: any): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  deleteOrderById(id: string): void {
    this.orderS.deleteOrderById(id).subscribe(
      (res) => {
        console.log('Order deleted:', res);
        // Supprime la commande localement
        this.orders = this.orders.filter(order => order._id !== id);
      },
      (err) => {
        console.error('Delete order error:', err);
      }
    );
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
      newStatus = 'Refusé'; // ou 'en_attente' si tu veux boucler
      break;
    default:
      return; // statut inconnu
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



  updateOrderStatus(id: string, newStatus: string): void {
  const order = this.orders.find(o => o._id === id);
  if (!order || order.etatCommande === newStatus) return;

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: `Voulez-vous vraiment changer le statut de la commande à "${newStatus}" ?`
    }
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (confirmed) {
      this.orderS.updateOrderStatusById(id, newStatus).subscribe(
        (res) => {
          order.etatCommande = newStatus;
          this.snackBar.open(`Statut mis à jour en "${newStatus}"`, 'Fermer', {
            duration: 3000
          });
        },
        (err) => {
          this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', {
            duration: 3000
          });
        }
      );
    }
  });
}

}
