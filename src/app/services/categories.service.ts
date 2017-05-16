import { environment } from 'environments/environment.dev';
import { Http } from '@angular/http';
import { Category } from 'app/models/category.model';
import { DatastoreService } from 'app/services/datastore.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesService {

    constructor(
      private datastoreService: DatastoreService,
      private http: Http) {

    }

    getAll() {
        return this.datastoreService.query(Category).toPromise();
    }

    crateCategory(formValues): Promise<Category> {
      const payload = { category: formValues };
      return this.http.post(`${environment.apiUrl}/categories`, payload)
        .map(response => response.json())
        .toPromise();
    }

    updateCategory(category: Category): Promise<any> {
      const payload = {
        category: {
          name: category.name
        }
      };

      return this.http.patch(`${environment.apiUrl}/category/${category.id}`, payload)
        .map(response => response.json())
        .toPromise();
    }

    deleteCategory(category: Category): Promise<any> {
      return this.datastoreService.deleteRecord(Category, category.id).toPromise();
    }

    getById(categoryId: string): Promise<Category> {
      return this.datastoreService.findRecord(Category, categoryId).toPromise();
    }
}
