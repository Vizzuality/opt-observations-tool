import { Law } from 'app/models/law.model';
import { DatastoreService } from 'app/services/datastore.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LawsService {

    constructor(private datastoreService: DatastoreService) {

    }

    getAll(){
        return this.datastoreService.query(Law).toPromise();
    }
}
