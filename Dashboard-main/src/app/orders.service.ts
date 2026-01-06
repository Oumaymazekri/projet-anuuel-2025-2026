import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:3002/api/order';

  constructor(private http: HttpClient) { }

  public getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllOrder`);
    
  }

  

  public postProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, JSON.stringify(productData));
  }

  public getOrderById(id:string){
    return this.http.get(`${this.apiUrl}/${id}`);
  }


    public deleteOrderById(id:string): Observable<any>{
      return this.http.delete(`${this.apiUrl}/supprimerCommande/${id}`);
    }

    

   updateOrderStatusById(id: string, newStatus: string) {
  return this.http.patch(`${this.apiUrl}/updateOrderStatusById/${id}`, {
    etatCommande: newStatus
  });

    
}
}
