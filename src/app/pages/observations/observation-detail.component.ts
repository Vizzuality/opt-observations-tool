import { Observation } from './../../models/observation.model';
import { DatastoreService } from 'app/services/datastore.service';
import { SubcategoriesService } from 'app/services/subcategories.service';
import { Subcategory } from 'app/models/subcategory.model';
import { ObservationsService } from 'app/services/observations.service';
import { Severity } from 'app/models/severity.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Operator } from 'app/models/operator.model';
import { OperatorsService } from 'app/services/operators.service';
import { ObserversService } from 'app/services/observers.service';
import { Observer } from 'app/models/observer.model';
import { Government } from 'app/models/government.model';
import { GovernmentsService } from 'app/services/governments.service';
import { Http } from '@angular/http';
import { CountriesService } from 'app/services/countries.service';
import { Country } from 'app/models/country.model';
import { Component } from '@angular/core';

@Component({
  selector: 'otp-observation-detail',
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.scss']
})
export class ObservationDetailComponent {
  loading = false;
  observation: Observation = null; // Only for edit mode
  countries: Country[] = [];
  subcategories: Subcategory[] = [];
  severities: Severity[] = [];
  operators: Operator[] = [];
  governments: Government[] = [];

  // User selection
  _type: string = null;
  _country: Country = null;
  _details: string;
  _severity: Severity = null;
  _subcategory: Subcategory = null;
  _operator: Operator = null; // Only for type operator
  _opinion: string; // Only for type operator
  _pv: string; // Only for type operator
  _latitude: number; // Only for type operator
  _longitude: number; // Only for type operator
  _government: Government = null; // Only for type government

  get type() { return this.observation ? this.observation['observation-type'] : this._type; }
  set type(type) {
    if (this.observation) {
      this.observation['observation-type'] = type;
    } else {
      this._type = type;

      // We also reset the different user selections
      this.country = null;
      this.details = null;
      this.subcategory = null;
      this.operator = null;
      this.opinion = null;
      this.pv = null;
      this.government = null;
    }

    // When the type change we load the necessary additional information
    this.countriesService.getAll(type === 'government' ? { include: 'governments'} : {})
      .then(countries => this.countries = countries)
      .then(() => {
        // If we're editing an observation, the object Country of the observation won't
        // match any of the objects of this.countries, so we search for the "same" model
        // and set it
        if (this.observation) {
          this.country = this.countries.find((country) => country.id === this.observation.country.id);
        }
      });

    this.subcategoriesService.getByType(<'operator'|'government'>type, { include: 'severities' })
      .then(subcategories => this.subcategories = subcategories)
      .then(() => {
          // If we're editing an observation, the object Subcategory of the observation won't
          // match any of the objects of this.subcategories, so we search for the "same" model
          // and set it
          if (this.observation) {
            this.subcategory = this.subcategories.find((subcategory) => subcategory.id === this.observation.subcategory.id);
          }
        })
      .catch((err) => console.error(err)); // TODO: visual feedback

    if (type === 'operator') {
      this.operatorsService.getAll()
        .then(operators => this.operators = operators)
        .then(() => {
          // If we're editing an observation, the object Operator of the observation won't
          // match any of the objects of this.operators, so we search for the "same" model
          // and set it
          if (this.observation) {
            this.operator = this.operators.find((operator) => operator.id === this.observation.operator.id);
          }
        })
        .catch((err) => console.error(err)); // TODO: visual feedback
    }
  }

  get country() { return this.observation ? this.observation.country : this._country; }
  set country(country) {
    if (this.observation) {
      this.observation.country = country;
    } else {
      this._country = country;
    }

    // We automatically update the governments options
    if (this.type === 'government') {
      this.governments = country ? country.governments : [];

      if (this.observation && this.country.id === this.observation.country.id) {
        this.government = this.governments.find(government => government.id === this.observation.government.id);
      } else {
        this.government = null;
      }
    }
  }

  get operator() { return this.observation ? this.observation.operator : this._operator; }
  set operator(operator) {
    if (this.observation) {
      this.observation.operator = operator;
    } else {
      this._operator = operator;
    }
  }

  get subcategory() { return this.observation ? this.observation.subcategory : this._subcategory; }
  set subcategory(subcategory) {
    if (this.observation) {
      this.observation.subcategory = subcategory;
    } else {
      this._subcategory = subcategory;
    }

    // We automatically update the severities options
    this.severities = subcategory ? subcategory.severities : [];

    if (this.observation && this.subcategory.id === this.observation.subcategory.id) {
      this.severity = this.severities.find(severity => severity.id === this.observation.severity.id);
    } else {
      this.severity = null;
    }
  }

  get severity() { return this.observation ? this.observation.severity : this._severity; }
  set severity(severity) {
    if (this.observation) {
      this.observation.severity = severity;
    } else {
      this._severity = severity;
    }
  }

  get latitude() { return this.observation ? this.observation.lat : this._latitude; }
  set latitude(latitude) {
    if (this.observation) {
      this.observation.lat = latitude;
    } else {
      this._latitude = latitude;
    }
  }

  get longitude() { return this.observation ? this.observation.lng : this._longitude; }
  set longitude(longitude) {
    if (this.observation) {
      this.observation.lng = longitude;
    } else {
      this._longitude = longitude;
    }
  }

  get details() { return this.observation ? this.observation.details : this._details; }
  set details(details) {
    if (this.observation) {
      this.observation.details = details;
    } else {
      this._details = details;
    }
  }

  get opinion() { return this.observation ? this.observation['concern-opinion'] : this._opinion; }
  set opinion(opinion) {
    if (this.observation) {
      this.observation['concern-opinion'] = opinion;
    } else {
      this._opinion = opinion;
    }
  }

  get pv() { return this.observation ? this.observation.pv : this._pv; }
  set pv(pv) {
    if (this.observation) {
      this.observation.pv = pv;
    } else {
      this._pv = pv;
    }
  }

  get government() { return this.observation ? this.observation.government : this._government; }
  set government(government) {
    if (this.observation) {
      this.observation.government = government;
    } else {
      this._government = government;
    }
  }

  constructor(
    private observationsService: ObservationsService,
    private countriesService: CountriesService,
    private subcategoriesService: SubcategoriesService,
    private operatorsService: OperatorsService,
    private datastoreService: DatastoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // If we edit an existing observation, we have a bit of
    // code to execute
    if (this.route.snapshot.params.id) {
      this.loading = true;
      this.observationsService.getById(this.route.snapshot.params.id, { include: 'country,operator,subcategory,severity'})
        .then((observation) => {
          this.observation = observation;

          // We force some of the attributes to execute the setters
          this.type = this.observation['observation-type'];
        })
        .catch((err) => console.error(err)) // TODO: visual feedback
        .then(() => this.loading = false);
    }
  }

  onCancel(): void {
    // Without relativeTo, the navigation doesn't work properly
    this.router.navigate([this.observation ? '../..' : '..'], { relativeTo: this.route });
  }

  onSubmit(): void {
    let observation: Observation;

    if (this.observation) {
      observation = this.observation;
    } else {
      const model: any = {
        'observation-type': this.type,
        'publication-date': new Date(),
        'is-active': true,
        country: this.country,
        subcategory: this.subcategory,
        details: this.details,
        severity: this.severity
      };

      if (this.type === 'operator') {
        model.operator = this.operator;
        model.lat = this.latitude;
        model.lng = this.longitude;
        model['concern-opinion'] = this.opinion;
        model.pv = this.pv;
      } else {
        model.government = this.government;
      }

      observation = this.datastoreService.createRecord(Observation, model);
    }

    observation.save()
      .toPromise()
      .then(() => {
        if (this.observation) {
          alert('The observation has been successfully updated.');
        } else {
          alert('The observation has been submitted and is awaiting approval.');
        }

        // Without relativeTo, the navigation doesn't work properly
        this.router.navigate(['..'], { relativeTo: this.route });
      })
      .catch((err) => {
        if (this.observation) {
          alert('The update of the observation has been unsuccessful.');
        } else {
          alert('The creation of the observation has been unsuccessful.');
        }
        console.error(err);
      });
  }

}
