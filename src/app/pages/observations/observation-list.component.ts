import { NavigationItem } from 'app/shared/navigation/navigation.component';
import { Router } from '@angular/router';
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
  private navigationItems: NavigationItem[] = [
      { name: 'For Operators', url: '/private/observations/operators' },
      { name: 'For Governance', url: '/private/observations/governance' }
    ];
  private selected = [];
  private editURL: string;

  private get rows () {
    return this.observations;
  }

  constructor(
    private router: Router,
    private observationsService: ObservationsService
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.endsWith('operators')) {
      this.observationsService.getByType('operator')
        .then(observations => this.observations = observations);
    } else if (url.endsWith('governance')) {
      this.observationsService.getByType('governance')
        .then(observations => this.observations = observations);
    }
  }

  onEdit(id): void {
    this.router.navigate([`/private/observations/edit/${id}`]);
  }
  onDelete(id): void {
    this.router.navigate([`/private/observations/delete/${id}`]);
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
