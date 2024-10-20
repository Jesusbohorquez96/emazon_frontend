import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let routerMock = {
    events: of(new NavigationEnd(0, '/', '/')),
    url: '/',
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the navbar on non-excluded routes', () => {
    routerMock.url = '/home'; 
    component.ngOnInit();
    
    expect(component.showNavbar).toBe(true);
  });

  it('should hide the navbar on excluded routes', () => {
    routerMock.url = '/login';
    component.ngOnInit();

    expect(component.showNavbar).toBe(false);
  });

  it('should hide the navbar on another excluded route', () => {
    routerMock.url = '/signup';
    component.ngOnInit();

    expect(component.showNavbar).toBe(false);
  });

  it('should toggle navbar visibility on navigation end', () => {
    const noNavbarRoutes = ['/other-page', '/login', '/signup'];

    noNavbarRoutes.forEach(route => {
      routerMock.url = route;
      component.ngOnInit();
      expect(component.showNavbar).toBe(false);
    });

    routerMock.url = '/home';
    component.ngOnInit();
    expect(component.showNavbar).toBe(true);
  });
});
