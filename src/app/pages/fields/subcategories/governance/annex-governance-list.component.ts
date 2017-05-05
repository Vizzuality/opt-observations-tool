import { AnnexGovernance } from 'app/models/annex-governance.model';
import { SubCategoriesService } from 'app/services/sub-categories.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'otp-annex-governance-list',
  templateUrl: './annex-governance-list.component.html',
  styleUrls: ['./annex-governance-list.component.scss']
})
export class AnnexGovernanceListComponent implements OnInit {

  private annexGovernances: AnnexGovernance[];

  constructor(
    private subCategoriesService: SubCategoriesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.subCategoriesService.getAllGovernances().then((data) => {
      this.annexGovernances = data;
    });
  }

  triggerNewAnnexGovernance(): void{
    this.router.navigate(['private/fields/subcategories/governance/new']);
  }


}
