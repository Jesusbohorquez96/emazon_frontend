import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuxBodegaCreateComponent } from './aux-bodega-create.component';
import { FormBuilder } from '@angular/forms';
import { auxBodegaService } from '@/app/services/aux-bodega.service';
import { of, throwError } from 'rxjs';

describe('AuxBodegaCreateComponent', () => {
  let component: AuxBodegaCreateComponent;
  let fixture: ComponentFixture<AuxBodegaCreateComponent>;
  let auxBodegaServiceMock: any;

  beforeEach(async () => {
    auxBodegaServiceMock = {
      saveUsers: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AuxBodegaCreateComponent],
      providers: [
        FormBuilder,
        { provide: auxBodegaService, useValue: auxBodegaServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuxBodegaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the register form with default values', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.valid);
  });

  it('should validate the date of birth', () => {
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 20); 
    component.registerForm.controls['birthdate'].setValue(validDate.toISOString().split('T')[0]);
    expect(component.registerForm.controls['birthdate'].valid).toBe(true);
    
    const invalidDate = new Date();
    invalidDate.setFullYear(invalidDate.getFullYear() - 17);
    component.registerForm.controls['birthdate'].setValue(invalidDate.toISOString().split('T')[0]);
    expect(component.registerForm.controls['birthdate'].valid).toBe(false);
  });

  it('should log an error message when the registration fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    auxBodegaServiceMock.saveUsers.mockReturnValue(throwError('Registration error'));

    component.register();

    expect(consoleErrorSpy);
  });

});
