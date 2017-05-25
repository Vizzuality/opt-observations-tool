import { NavigationItem } from 'app/shared/navigation/navigation.component';
import { Component } from '@angular/core';

@Component({
  selector: 'otp-my-otp',
  templateUrl: './my-otp.component.html',
  styleUrls: ['./my-otp.component.scss']
})
export class MyOTPComponent {

  navigationItems: NavigationItem[] = [
    { name: 'Organization profile', url: 'profile' },
    { name: 'My observations', url: 'observations' },
  ]

}
