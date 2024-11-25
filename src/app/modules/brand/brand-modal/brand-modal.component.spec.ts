import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandModalComponent } from './brand-modal.component';
import { BrandResponse } from 'src/app/models/brand.model';

describe('BrandModalComponent', () => {
  let component: BrandModalComponent;
  let fixture: ComponentFixture<BrandModalComponent>;

  const mockBrands: BrandResponse[] = [
    { brandId: 1, brandName: 'Brand 1', brandDescription: '' },
    { brandId: 2, brandName: 'Brand 2', brandDescription: '' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModalEvent when closeModal is called', () => {
    const closeModalSpy = jest.spyOn(component.closeModalEvent, 'emit');
    component.closeModal();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should emit brandSelectedEvent when valid brand is selected', () => {
    const brandSelectedSpy = jest.spyOn(component.brandSelectedEvent, 'emit');
    component.handleBrandChange([mockBrands[0]]);
    expect(component.selectedBrands.length).toBe(1);
    expect(brandSelectedSpy).toHaveBeenCalledWith([mockBrands[0]]);
  });

  it('should display error message when more than one brand is selected', () => {
    component.handleBrandChange(mockBrands);
    expect(component.errorMessageB).toBe('Solo puedes seleccionar una 1 marca');
    expect(component.selectedBrands.length).toBe(1); 
  });

  it('should clear error message if a valid selection is made', () => {
    component.errorMessageB = 'Error previo';
    component.handleBrandChange([mockBrands[0]]);
    expect(component.errorMessageB).toBe('');
  });

  it('should emit selected brand and close modal when acceptSelection is called with valid selection', () => {
    const closeModalSpy = jest.spyOn(component, 'closeModal');
    const brandSelectedSpy = jest.spyOn(component.brandSelectedEvent, 'emit');
    
    component.selectedBrands = [mockBrands[0]];
    component.acceptSelection();

    expect(brandSelectedSpy).toHaveBeenCalledWith([mockBrands[0]]);
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should display error message if acceptSelection is called without selecting a brand', () => {
    component.selectedBrands = [];
    component.acceptSelection();
    expect(component.errorMessageB).toBe('Por favor, selecciona una marca.');
  });

  it('should return the correct brand name for a valid brandId', () => {
    component.selectedBrands = mockBrands;
    const brandName = component.getBrandName(1);
    expect(brandName).toBe('Brand 1');
  });

  it('should return "Marca " for an invalid brandId', () => {
    component.selectedBrands = mockBrands;
    const brandName = component.getBrandName(999); 
    expect(brandName).toBe('Marca ');
  });
});
