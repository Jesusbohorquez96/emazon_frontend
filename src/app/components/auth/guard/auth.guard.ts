import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly loginService: LoginService, 
    private readonly router: Router) {}

  canActivate(): boolean {
    if (this.loginService.isAuthenticated()) { 
      return true;
    } else {
      this.router.navigate(['/login']);  
      return false;
    }
  }
}
