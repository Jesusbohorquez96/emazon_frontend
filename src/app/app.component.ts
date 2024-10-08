import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { APP_CONSTANTS } from 'src/styles/constants'; 

@Component({
  selector: APP_CONSTANTS.ROOT.SELECTOR,
  templateUrl: APP_CONSTANTS.ROOT.TEMPLATE_URL,
  styleUrls: APP_CONSTANTS.ROOT.STYLE_URLS
})
export class AppComponent {
  title = APP_CONSTANTS.APP_TITLE;
showNavbar: any;

  constructor(private readonly router: Router, private readonly renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
       
        if (APP_CONSTANTS.HIDE_NAVBAR_ROUTES.includes(this.router.url)) {
          this.renderer.addClass(document.body, APP_CONSTANTS.NO_NAVBAR);
        } else {
          this.renderer.removeClass(document.body, APP_CONSTANTS.NO_NAVBAR);
        }
      }
    });
  }
}

export class ParentComponent {
  currentPage = APP_CONSTANTS.PAGINATION.ZERO; 
  totalPages = APP_CONSTANTS.PAGINATION.TOTAL_PAGES;

  onPageChange(newPage: number) {
    console.log(APP_CONSTANTS.PAGINATION.PAGE_CHANGE_MESSAGE(newPage));
    this.currentPage = newPage;
  }
}