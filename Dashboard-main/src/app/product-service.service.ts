import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private apiUrl = 'http://localhost:3001/products';

  constructor(private http: HttpClient) {}

  public getProducts(): Observable<any> {
    return this.http.get(this.apiUrl + '/GetAllProducts');
  }

  public postProduct(productData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    
    return this.http.post(this.apiUrl + '/AddProduct', productData, {
      headers: {
        Authorization: `Bearer ${token || ''}`
      }
     
    });
  }
    public UpdateProduct(productId: string, productData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    
        const updateUrl = `${this.apiUrl}/UpdateProduct/${productId}`;
    return this.http.put(updateUrl, productData, {
      headers: {
        Authorization: `Bearer ${token || ''}`
      }
     
    });
  }
  
  

  public deleteAllProducts(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }



  public deleteProductById(productId: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/DeleteProduct/${productId}`;
    return this.http.delete(deleteUrl);
  }

 
  getProductById(id: string) {
    return this.http.get<{ data: any }>(`${this.apiUrl}/GetProductByID/${id}`);
  }
}
