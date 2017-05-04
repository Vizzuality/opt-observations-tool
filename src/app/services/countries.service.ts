import { Country } from 'app/models/country.model';
import { DatastoreService } from 'app/services/datastore.service';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';

@Injectable()
export class CountriesService {

    constructor(private datastoreService: DatastoreService) {

    }

    /**
     * Return the list of all the countries
     * @returns {Promise<Country[]>}
     */
    getCountries(): Promise<Country[]> {
        return this.datastoreService
          .query(Country, { page: { size: 10000 } })
          .toPromise();
    }
}
