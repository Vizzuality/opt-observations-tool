import { UserDetailComponent } from './pages/users/user-detail.component';
import { UsersService } from 'app/services/users.service';
import { TabsComponent } from 'app/shared/tabs/tabs.component';
import { ObservationDetailComponent } from 'app/pages/observations/observation-detail.component';
import { FieldListComponent } from 'app/pages/fields/field-list.component';
import { FieldDetailComponent } from 'app/pages/fields/field-detail.component';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { UserListComponent } from 'app/pages/users/user-list.component';
import { BottombarComponent } from 'app/shared/bottombar/bottombar.component';
import { SidebarComponent } from 'app/shared/sidebar/sidebar.component';
import { DatastoreService } from 'app/services/datastore.service';
import { CountriesService } from 'app/services/countries.service';
import { RegisterComponent } from 'app/pages/register/register.component';
import { ObservationListComponent } from 'app/pages/observations/observation-list.component';
import { AuthService, TokenService } from 'app/services/auth.service';
import { LoginComponent } from 'app/pages/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonApiModule } from 'angular2-jsonapi';
import { HttpModule, RequestOptions } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { OauthRequestOptions } from 'app/services/oauth-request.service';
import { CustomFormsModule } from 'ng2-validation';
import { AppComponent } from './app.component';
import { SpinnerModule } from 'angular2-spinner/dist';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ObservationListComponent,
    ObservationDetailComponent,
    RegisterComponent,
    SidebarComponent,
    BottombarComponent,
    UserListComponent,
    UserDetailComponent,
    ProfileComponent,
    FieldListComponent,
    FieldDetailComponent,
    TabsComponent
  ],
  imports: [
    JsonApiModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CustomFormsModule,
    SpinnerModule,
    NgxDatatableModule
  ],
  providers: [
    TokenService,
    AuthService,
    CountriesService,
    DatastoreService,
    UsersService,
    { provide: RequestOptions, useClass: OauthRequestOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
