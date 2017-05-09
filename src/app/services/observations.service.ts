import { environment } from './../../environments/environment';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { DatastoreService } from 'app/services/datastore.service';
import { Observation } from 'app/models/observation.model';

@Injectable()
export class ObservationsService {

  constructor (
    private datastoreService: DatastoreService,
    private http: Http
  ) {}

  getAll(): Promise<Observation[]> {
    return this.datastoreService.query(Observation).toPromise();
  }
  getByType(type: String): Promise<Observation[]> {
    return this.datastoreService.query(Observation, {
      type: type,
      page: { size: 10000 }
    }).toPromise();
  }
  getById(observationId: String): Promise<Observation[]> {
    return this.datastoreService.query(Observation, {
      id: observationId
    }).toPromise();
  }

  createObservation(formValues): Promise<any> {
    const payload = { observation: formValues };
    return this.http.post(`${environment.apiUrl}/observations`, payload)
      .map(response => response.json())
      .toPromise();
  }

  updateObservation(formValues): Promise<any> {
    const payload = { observation: formValues };
    return this.http.patch(`${environment.apiUrl}/observations`, payload)
      .map(response => response.json())
      .toPromise();
  }

  deleteObservationWithId(id): Promise<any>{
    return this.http.delete(`${environment.apiUrl}/observations/${id}`)
      .map(response => response.json())
      .toPromise();;
  }

}
