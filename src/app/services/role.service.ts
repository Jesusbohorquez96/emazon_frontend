import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private role: string = '';

  private readonly roleComponentVisibilityMap: { [role: string]: string[] } = {
    'admin': ['createForm', 'listForm', 'registroForm'],
    'aux_bodega': [ 'listForm', 'updateForm', 'updateForm'],
    'customer': ['listForm',]
  };

  constructor() {
    this.setUserRole(this.getUserRoleFromToken());
  }

  getUserRoleFromToken(): string {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return '';
    }

    try {
      const payloadBase64 = token.split('.')[1]; 
      const decodedPayload = atob(payloadBase64); 
      const payload = JSON.parse(decodedPayload); 

      return payload.rol || ''; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  setUserRole(role: string): void {
    this.role = role;
  }

  isComponentVisible(componentName: string): boolean {
    const visibleComponents = this.roleComponentVisibilityMap[this.role];
    return visibleComponents ? visibleComponents.includes(componentName) : false;
  }

  updateUserRole(): void {
    this.setUserRole(this.getUserRoleFromToken());
  }
}
