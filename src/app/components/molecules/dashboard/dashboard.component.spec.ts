import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { RoleService } from '@/app/services/role.service';
import { LoginService } from '../../../services/login.service';
import { of, Subscription } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockLoginService: jest.Mocked<LoginService>;

  beforeEach(async () => {
    const loginServiceMock = {
      getAuthStatus: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: RoleService, useValue: {} },
        { provide: LoginService, useValue: loginServiceMock }
      ],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    mockLoginService = TestBed.inject(LoginService) as jest.Mocked<LoginService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a checkAuthentication en ngOnInit', () => {
    jest.spyOn<any, any>(component, 'checkAuthentication');
    component.ngOnInit();
    expect(component['checkAuthentication']).toHaveBeenCalled();
  });

  it('debería redirigir a /login si no hay token en checkAuthentication', () => {
    jest.spyOn(localStorage, 'getItem');
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    component['checkAuthentication']();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('debería redirigir a /login si getAuthStatus emite false', () => {
    mockLoginService.getAuthStatus.mockReturnValue(of(false));
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('debería desuscribirse de authSubscription en ngOnDestroy', () => {
    component.authSubscription = new Subscription();
    const unsubscribeSpy = jest.spyOn(component.authSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
