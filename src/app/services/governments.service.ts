import { Country } from 'app/models/country.model';
import { Government } from './../models/government.model';
import { DatastoreService } from 'app/services/datastore.service';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';

@Injectable()
export class GovernmentsService {

    constructor(
      private datastoreService: DatastoreService,
      private http: Http){

    }

    getGovernments(country: Country){
        return this.http.get(`${environment.apiUrl}/governments`)
          .map(response => response.json()).toPromise();
    }
}