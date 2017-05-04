import { ObserverListComponent } from './pages/fields/observers/observer-list.component';
import { LawListComponent } from 'app/pages/fields/laws/law-list.component';
import { SpeciesDetailComponent } from 'app/pages/fields/species/species-detail.component';
import { ObserverDetailComponent } from 'app/pages/fields/observers/observer-detail.component';
import { LawDetailComponent } from 'app/pages/fields/laws/law-detail.component';
import { GovernmentDetailComponent } from 'app/pages/fields/governments/government-detail.component';
import { GovernmentListComponent } from 'app/pages/fields/governments/government-list.component';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { FieldListComponent } from 'app/pages/fields/field-list.component';
import { FieldDetailComponent } from 'app/pages/fields/field-detail.component';
import { UserListComponent } from 'app/pages/users/user-list.component';
import { AuthGuard } from 'app/services/auth.guard';
import { ObservationListComponent } from 'app/pages/observations/observation-list.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { RegisterComponent } from 'app/pages/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObservationDetailComponent } from 'app/pages/observations/observation-detail.component';
import { UserDetailComponent } from 'app/pages/users/user-detail.component';
import { WrapperComponent } from 'app/shared/wrapper/wrapper.component';
import { CategoryListComponent } from 'app/pages/fields/categories/category-list-component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'private',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children: [
      // -------------OBSERVATIONS------------------
      {
        path: 'observations/:id',
        component: ObservationDetailComponent
      },
      {
        path: 'observations',
        component: ObservationListComponent
      },
      {
        path: 'observations/new',
        component: ObservationDetailComponent
      },
      // ----------------USERS----------------------
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'users/:id/edit',
        component: UserDetailComponent
      },
      {
        path: 'users/new',
        component: UserDetailComponent
      },
      // -------------FIELDS------------
      {
        path: 'fields',
        component: FieldListComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'categories'
          },
          // --------------CATEGORIES--------------
          {
            path: 'categories',
            component: CategoryListComponent
          },
          // --------------GOVERNMENTS-----------------
          {
            path: 'governments',
            component: GovernmentListComponent
          },
          {
            path: 'governments/new',
            component: GovernmentDetailComponent
          },
          // --------------LAWS-----------------
          {
            path: 'laws',
            component: LawListComponent
          },
          {
            path: 'laws/new',
            component: LawDetailComponent
          },
          // --------------OBSERVERS-----------------
          {
            path: 'observers',
            component: ObserverListComponent
          },
          {
            path: 'observers/new',
            component: ObserverDetailComponent
          },
          // --------------SPECIES-----------------
          {
            path: 'species/new',
            component: SpeciesDetailComponent
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    ],
  providers: [
    AuthGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
