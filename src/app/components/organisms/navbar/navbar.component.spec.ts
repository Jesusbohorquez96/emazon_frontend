import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { RoleService } from '@/app/services/role.service';
import { LoginService } from '../../../services/login.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockRouter: any;
  let mockLoginService: any;
  let roleService: RoleService;

  beforeEach(async () => {
    mockRouter = {
      events: of(new NavigationEnd(0, '/other-page', '/other-page')),
      url: '/other-page',
      navigate: jest.fn(),
    };

    mockLoginService = {
      logout: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: LoginService, useValue: mockLoginService },
        RoleService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    roleService = TestBed.inject(RoleService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide navbar on specific routes', () => {
    mockRouter.url = '/login';
    component.ngOnInit();
    expect(component.showNavbar).toBe(false);

    mockRouter.url = '/dashboard';
    component.ngOnInit();
    expect(component.showNavbar).toBe(true);
  });

  it('should toggle menuOpen when toggleMenu is called', () => {
    expect(component.menuOpen).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
    component.toggleMenu();
    expect(component.menuOpen).toBe(false);
  });

  it('should call logout on LoginService and navigate to login on logout', () => {
    component.logout();
    expect(mockLoginService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
