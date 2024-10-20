import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {

  private readonly navbarVisible = new BehaviorSubject<boolean>(true);
  private readonly footerVisible = new BehaviorSubject<boolean>(true);

  navbarVisible$ = this.navbarVisible.asObservable();
  footerVisible$ = this.footerVisible.asObservable();

  showNavbar() {
    this.navbarVisible.next(true);
  }

  hideNavbar() {
    this.navbarVisible.next(false);
  }

  showFooter() {
    this.footerVisible.next(true);
  }

  hideFooter() {
    this.footerVisible.next(false);
  }
}