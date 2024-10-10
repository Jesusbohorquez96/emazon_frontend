import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ngOnInit(): void {}
  querySelector(arg0: string) {
    throw new Error('Method not implemented.');
  }
  title = 'emazon';
showNavbar: any;

  constructor(private readonly router: Router, private readonly renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
       
        if ('/other-page'.includes(this.router.url)) {
          this.renderer.addClass(document.body, 'no-navbar');
        } else {
          this.renderer.removeClass(document.body, 'no-navbar');
        }
      }
    });
  }
}

export class ParentComponent {
  currentPage = 0; 
  totalPages = 10;

  onPageChange(newPage: number) {
    console.log((newPage: number) => `Página cambiada a: ${newPage}`);
    this.currentPage = newPage;
  }
}
