import { RoleService } from '@/app/services/role.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../../auth/service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showNavbar = true;
  menuOpen = false;

  constructor(
    private readonly router: Router,
    public roleService: RoleService,
    private readonly loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const noNavbarRoutes = ['/other-page', '/login', '/signup']; 
        this.showNavbar = !noNavbarRoutes.includes(this.router.url);
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;  
  }
 
  logout() {
    this.loginService.logout(); 
    this.router.navigate(['/login']); 
  }
}
