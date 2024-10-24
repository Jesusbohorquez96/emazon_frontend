import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  token: string | null = '';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    
    if (!this.token) {
      console.log('No token found. Redirecting to login.');
      this.router.navigate(['/login']); 
    } else {
      console.log('Token:', this.token);
    }
  }
}