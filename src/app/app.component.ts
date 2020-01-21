import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environments/environment.dev';

// declare gives Angular app access to ga function
declare let ga: Function;

const ACCEPTED_LOCALES = ['en', 'fr'];

@Component({
  selector: 'otp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLogged = false;
  lang = 'en';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.authService.loginStatus.subscribe(isLogged => this.isLogged = isLogged);

    // We set the fallback language
    this.translateService.setDefaultLang('zu');

    // Everytime the user navigates to a page, we check which
    // language to use, and update the URL and localStorage
    // consequently
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const locale = this.route.snapshot.queryParams.lang;

        // Send page views to Google Analytics
        this.sendPageView(e);

        if (!locale || !this.isAcceptedLocale(locale)) {
          // There's no lang param in the URL...
          const storageLang = localStorage.getItem('lang');

          // If it's been saved in the localStorage, the we
          // use it
          if (storageLang && this.isAcceptedLocale(storageLang)) {
            this.lang = storageLang;
          }

          // If not, we set English as the default language
          this.saveLocale();
        } else {
          // There's a lang param in the URL, then we change
          // the language
          this.lang = locale;
          this.saveLocale();
        }
      }
    });

    // Everytime the language is modified by the user, we update
    // the URL, localStorage and the translations
    this.translateService.onLangChange.subscribe(({ lang }) => {
      // NOTE: make sure the lang is different because
      // otherwise we'll enter an infinite loop reloading
      // the page
      if (lang !== this.lang) {
        this.lang = lang;
        this.saveLocale(true);
      }
    });
  }

  private sendPageView(e: NavigationEnd): void {
    if (environment.production) {
      ga('set', 'page', e.urlAfterRedirects);
      ga('send', 'pageview');
    } else {
      console.info(`[GA] Page view: ${e.urlAfterRedirects}`);
    }
  }


  /**
   * Update the lang attribute of the html tag
   * for accessibility reasons (screen readers)
   */
  setHTMLLangAttribute(): void {
    document.documentElement.lang = this.lang;
  }

  /**
   * Update the lang attribute of the html tag, update
   * the lang query param, update the localStorage and
   * load the appropriate translations according to the
   * value of this.lang
   * @param {boolean} [reload=false] Reload the page
   */
  saveLocale(reload = false): void {
    this.setHTMLLangAttribute();

    this.router.navigate([], {
      queryParams: { lang: this.lang },
      replaceUrl: true,
      relativeTo: this.route
    }).then(() => {
      localStorage.setItem('lang', this.lang);

      // NOTE: the URL needs to be updated before reloading the page
      if (reload) {
        // We reload the page to make sure the tables fetch the data
        // with the correct locale
        // Ideally, we would just fetch the data again, but the library
        // we use (angular2-jsonapi) has an issue with the relationships
        // being different after the initial fetch:
        // https://github.com/ghidoz/angular2-jsonapi/issues/124
        location.reload();
      } else {
        this.translateService.use(this.lang);
      }
    });
  }

  /**
   * Return whether the locale is accepted by the app
   * @param locale {string} Locale code (two letters)
   */
  isAcceptedLocale(locale): boolean {
    return ACCEPTED_LOCALES.indexOf(locale) !== -1;
  }
}
