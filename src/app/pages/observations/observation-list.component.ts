import { AuthService } from 'app/services/auth.service';
import { NavigationItem } from 'app/shared/navigation/navigation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ObservationsService } from 'app/services/observations.service';
import { Observation } from 'app/models/observation.model';
import { Tab } from 'app/shared/tabs/tabs.component';

@Component({
  selector: 'otp-observation-list',
  templateUrl: './observation-list.component.html',
  styleUrls: ['./observation-list.component.scss']
})
export class ObservationListComponent implements OnInit {


  private observations: Observation[] = [];
  navigationItems: NavigationItem[] = [
      { name: 'Operators', url: '../operators' },
      { name: 'Governance', url: '../governance' }
    ];
  private selected = [];
  private editURL: string;

  get rows () {
    return this.observations;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private observationsService: ObservationsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    const isMyOTP = /my\-otp/.test(url);
    const observationType = url.endsWith('operators') ? 'operators' : 'governance';

    this.observationsService[isMyOTP ? 'getByTypeAndUser' : 'getByType'](observationType)
      .then(observations => this.observations = observations);
  }

  onEdit(row): void {
    // Without relativeTo, the navigation doesn't work properly
    this.router.navigate([`../edit/${row.id}`], { relativeTo: this.route });
  }

  onDelete(row): void {
    if(confirm(`Are you sure to delete the observation with details: ${row.details}?`)) {
      this.observationsService.deleteObservationWithId(row.id).then(
        data => {
          alert(data.messages[0].title);
          this.ngOnInit();
        });
    }
  }

  /**
   * Return whether the logged user can edit or delete an observation
   * @param {Observation} observation
   * @returns {boolean}
   */
  canEdit(observation: Observation): boolean {
    return observation.user
      ? observation.user.id === this.authService.userId
      : this.authService.userRole === 'admin';
  }

  getCategory(row): string {
    if (row.annex_operator) {
      return row.annex_operator.illegality;
    } else if (row.annex_governance) {
      return row.annex_governance.governance_pillar;
    } else {
      return '';
    }
  }
}
