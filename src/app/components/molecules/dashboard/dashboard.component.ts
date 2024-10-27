import { RoleService } from '@/app/services/role.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public authSubscription!: Subscription;

  constructor(
    private readonly router: Router,
    public roleService: RoleService,
    private readonly loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.authSubscription = this.loginService.getAuthStatus().subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        console.log('Usuario no autenticado. Redirigiendo a login.');
        this.router.navigate(['/login']);
      }
    });
  }

  private checkAuthentication() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No se encontró token. Redirigiendo a login.');
      this.router.navigate(['/login']);
    } else {
      console.log('Token encontrado:', token);
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}