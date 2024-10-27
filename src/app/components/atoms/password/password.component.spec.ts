import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordComponent } from './password.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    component.label = 'Contraseña de usuario';
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(labelElement.textContent).toContain('Contraseña de usuario');
  });

  it('should toggle password visibility', () => {
    expect(component.isPasswordVisible).toBe(false);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(true);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(false);
  });

  it('should bind the FormControl to the input', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    component.control?.setValue('mypassword');
    fixture.detectChanges();
    expect(inputElement.value).toBe('mypassword');
  });

  it('should toggle input type between password and text', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputElement.type).toBe('password');

    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(inputElement.type).toBe('text');

    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(inputElement.type).toBe('password');
  });
});
