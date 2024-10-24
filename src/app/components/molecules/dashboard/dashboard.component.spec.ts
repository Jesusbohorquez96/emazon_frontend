import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log token to console if token is found', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    localStorage.setItem('authToken', 'fakeToken123');
    
    component.ngOnInit();

    expect(consoleLogSpy).toHaveBeenCalledWith('Token:', 'fakeToken123');
    consoleLogSpy.mockRestore();
  });

  it('should redirect to login if no token is found', () => {
    const routerSpy = jest.spyOn(mockRouter, 'navigate');
    localStorage.removeItem('authToken');  

    component.ngOnInit();

    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
