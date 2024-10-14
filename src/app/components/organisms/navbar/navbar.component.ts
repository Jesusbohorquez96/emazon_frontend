import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showNavbar = true;

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const noNavbarRoutes = ['/other-page', '/login', '/signup']; 
        this.showNavbar = !noNavbarRoutes.includes(this.router.url);
      }
    });
  }
}
