import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Category } from '../../interfaces/category/category';
import { Observable } from 'rxjs';
import { CategoriesPaged } from '../../interfaces/category/categories-paged';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl: string = environment.apiUrl; 
  private url = `${this.baseUrl}/api/categories`;
  
  constructor(private http: HttpClient) { }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }
  getAllCategories(): Observable<CategoriesPaged> {
    return this.http.get<CategoriesPaged>(this.url);
  }
  deleteCategory(id: number){
    const deleteUrl = `${this.url}/${id}`;
    return this.http.delete<void>(deleteUrl);
  }
}
