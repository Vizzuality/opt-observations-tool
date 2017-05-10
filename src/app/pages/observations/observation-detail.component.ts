import { Observation } from 'app/models/observation.model';
import { ObservationsService } from 'app/services/observations.service';
import { Severity } from './../../models/severity.model';
import { Router } from '@angular/router';
import { Operator } from 'app/models/operator.model';
import { OperatorsService } from 'app/services/operators.service';
import { ObserversService } from 'app/services/observers.service';
import { Observer } from 'app/models/observer.model';
import { Government } from 'app/models/government.model';
import { GovernmentsService } from 'app/services/governments.service';
import { AnnexGovernance } from 'app/models/annex-governance.model';
import { AnnexOperator } from 'app/models/annex-operator.model';
import { SubCategoriesService } from 'app/services/sub-categories.service';
import { Http } from '@angular/http';
import { CountriesService } from 'app/services/countries.service';
import { Country } from 'app/models/country.model';
import { Component, OnInit } from '@angular/core';
import { DatePickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'otp-observation-detail',
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.scss']
})
export class ObservationDetailComponent implements OnInit {

  private titleText: String = 'New observation';
  private submitButtonText: String = 'Create';
  private model: any = {};
  private loading = false;
  private returnUrl: string;
  private countries: Country[];
  private governments: Government[];
  private observers: Observer[];
  private operators: Operator[];
  private subCategories: any;
  private severities: Severity[];
  private dateOptions: DatePickerOptions;
  private type: String;
  private governanceSelected: boolean;
  private mode: string;
  private observationID: string;
  private observation: Observation;
  private observationIsFromGovernance = false;
  // data loaded flags
  private countriesLoaded = false;
  private subcategoriesLoaded = false;
  private severitiesLoaded = false;
  private observersLoaded = false;
  private operatorsLoaded = false;

  constructor(
    private countriesService: CountriesService,
    private subCategoriesService: SubCategoriesService,
    private governmentsService: GovernmentsService,
    private observersService: ObserversService,
    private operatorsService: OperatorsService,
    private observationsService: ObservationsService,
    private router: Router,
    private http: Http) {

      this.countries = new Array<Country>();
      this.dateOptions = new DatePickerOptions();
      this.type = 'operator';
      this.governanceSelected = false;

      const url = this.router.url;

      if (url.endsWith('new')) {
        this.setMode('new');
      } else {
        this.setMode('edit');
        const values: string[] = url.split('/');
        this.observationID = values[values.length-1];
      }
  }

  setMode(mode: string) {
    this.mode = mode;
    if (this.mode === 'edit') {
      this.titleText = 'Edit observation';
      this.submitButtonText = 'Update';
    }else if(this.mode === 'new') {
      this.titleText = 'New observation';
      this.submitButtonText = 'Create';
    }
  }

  loadObservation() {
    this.observationsService.getById(this.observationID).then(
      observationData => {
        this.observationIsFromGovernance = observationData.observation_type === 'AnnexGovernance';
        if (this.observationIsFromGovernance) {
          this.subCategoriesService.getAllGovernances().then(
            data => {
              this.subCategories = data;
              this.observation = observationData;
            }
          );
        } else {
          this.subCategoriesService.getAllOperators().then(
            data => {
              this.subCategories = data;
              this.observation = observationData;
            }
          );
        }
    });
  }

  onTypeChange(event): void{
    this.type = event.target.value;
    this.governanceSelected = this.type === 'AnnexGovernance';

    if (this.type === 'AnnexOperator') {
      this.loadAllOperators();
    } else if(this.type === 'AnnexGovernance') {
      this.loadAllGovernances();
    }
  }

  loadAllOperators(): void{
    this.subCategoriesService.getAllOperators().then(
        data => this.subCategories = data
      );
  }

  loadAllGovernances(): void{
    this.subCategoriesService.getAllGovernances().then(
        data => this.subCategories = data
      );
  }

  onCancel(): void{
    this.router.navigate(['/private/observations']);
  }

  onSubmit(formValues): void{
    const formattedDate = formValues.publication_date.formatted;
    const valuesUpdated = formValues;
    delete valuesUpdated.publication_date;
    valuesUpdated.publication_date = formattedDate;

    this.loading = true;

    if (this.mode === 'new') {
      this.observationsService.createObservation(valuesUpdated).then(
        data => {
          alert('Observation created successfully!');
          this.loading = false;
          this.router.navigate(['/private/observations']);
        }
      ).catch(error => {
        const errorMessage = error.json().errors[0].title;
        alert(errorMessage);
        this.loading = false;
      });
    } else if (this.mode === 'edit') {
      this.observationsService.updateObservation(valuesUpdated).then(
        data => {
          alert('Observation updated successfully!');
          this.loading = false;
        }
      ).catch(error => {
        const errorMessage = error.json().errors[0].title;
        alert(errorMessage);
        this.loading = false;
      });
    }
  }

  ngOnInit(): void {

    // ----- COUNTRIES ----
    this.countriesService.getAll().then(
      data => {
         this.countries = data;
         this.countriesLoaded = true;
         this.initialDataLoaded();
      }
    );
    // ----- OBSERVERS ----
    this.observersService.getAll().then(
      data => {
         this.observers = data;
         this.observersLoaded = true;
         this.initialDataLoaded();
      }
    );
    // ----- OPERATORS ----
    this.operatorsService.getAll().then(
      data => {
         this.operators = data;
         this.operatorsLoaded = true;
         this.initialDataLoaded();
      }
    );
  }

  initialDataLoaded(): void{
    if (this.operatorsLoaded && this.observersLoaded && this.countriesLoaded) {
      if (this.mode === 'edit') {
      this.loadObservation();
    }
    }
  }

  onSubCategoryChange(value) {
    debugger;
    this.severities = this.subCategories.find((val) => {
      return val.id === value;
    }).severities;
  }

  onCountryChange(value) {
    this.governmentsService.getByCountry(value).then(
      data => {
         this.governments = data;
      }
    );;
  }

  getSubcategory(value){
    if (this.governanceSelected) {
      return value.governance_problem;
    } else {
      return value.illegality;
    }
  }

}
