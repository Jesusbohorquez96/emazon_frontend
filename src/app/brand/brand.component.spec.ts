import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandComponent } from './brand.component';
import { BrandService } from '@/app/services/brand.service';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';

const mockBrands = [
  { id: 1, name: 'Brand 1', description: 'Description 1' },
  { id: 2, name: 'Brand 2', description: 'Description 2' },
];

describe('BrandComponent', () => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: BrandService,
          useValue: {
            getBrands: jest.fn(() =>
              of({ content: mockBrands, totalPages: 2 })
            ),
            saveBrand: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BrandService', () => {
    expect(brandService).toBeTruthy();
  });

  it('should show error message on invalid form submission', () => {
    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toEqual('error');
    expect(component.errorMessage).toEqual('Corrige los errores del formulario.');
  });

  it('should load brands on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.brands.length).toBe(2);
    expect(component.brands[0].name).toEqual('Brand 1');
  });

  it('should save brand successfully', () => {
    component.brandForm.setValue({
      name: 'New Brand',
      description: 'New Description'
    });

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(of({ id: 3, name: 'New Brand', description: 'New Description' }));

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toEqual('success');
    expect(component.brandForm.value);
  });

  it('should handle error when saving brand fails', () => {
    component.brandForm.setValue({
      name: 'New Brand',
      description: 'New Description'
    });

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => new Error('Save failed')));

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toEqual('error');
  });

  it('should change page when pageChange is called', () => {
    component.onPageChange(1);
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should filter brands by name when search is performed', () => {
    component.searchName = 'Brand 1';
    component.searchByName();
    fixture.detectChanges();

    expect(component.brands[0].name).toEqual('Brand 1');
  });

  it('should go to next page when nextPage is called', () => {
    component.page = 0;
    component.totalPages = 2;

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should not go to next page if on the last page', () => {
    component.page = 1;
    component.totalPages = 2;

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
  });

  it('should go to previous page when prevPage is called', () => {
    component.page = 1;

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should not go to previous page if on the first page', () => {
    component.page = 0;

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(0);
  });

  it('should search by name when searchByName is called', () => {
    component.searchName = 'Brand 1';

    component.searchByName();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should update page size when updatePageSize is called', () => {
    component.size = 2;

    component.updatePageSize();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should go to a specific page when goToPage is called', () => {
    component.totalPages = 3;

    component.goToPage(2);
    fixture.detectChanges();

    expect(component.page).toBe(2);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should not go to an invalid page when goToPage is called', () => {
    component.totalPages = 3;

    component.goToPage(3);
    fixture.detectChanges();

    expect(component.page).not.toBe(3);
  });

  it('should toggle the sort direction and reload brands', () => {
    component.sortDirection = 'ASC';

    component.toggleSort();
    fixture.detectChanges();

    expect(component.sortDirection).toBe('DESC');
    expect(brandService.getBrands).toHaveBeenCalledWith(component.page, component.size, component.sortBy, 'DESC', component.searchName);

    component.toggleSort();
    fixture.detectChanges();

    expect(component.sortDirection).toBe('ASC');
  });

  it('should search brands by name and reset page', () => {
    component.searchName = 'Brand 1';
    component.searchByName();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(brandService.getBrands).toHaveBeenCalledWith(0, component.size, component.sortBy, component.sortDirection, 'Brand 1');
  });

  it('should handle conflict error when saving brand', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };
    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => errorResponse));

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('error');
  });

  it('should set status to error if the form is invalid', () => {
    component.brandForm.setValue({
      name: '',
      description: ''
    });

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
    expect(brandService.saveBrand).not.toHaveBeenCalled();
  });

  it('should set status to success and reset form after saving brand', () => {
    component.brandForm.setValue({
      name: 'Valid Brand',
      description: 'Valid Description'
    });

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(of({ id: 1, name: 'Valid Brand', description: 'Valid Description' }));

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('success');
    expect(component.brandForm.value);
    expect(brandService.getBrands).toHaveBeenCalled();
  });

  it('should handle error when getBrands fails', () => {
    const errorResponse = { status: 500, message: 'Internal Server Error' };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    jest.spyOn(brandService, 'getBrands').mockReturnValue(throwError(() => errorResponse));

    component.getBrands();
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error al obtener las marcas:', errorResponse);

    consoleSpy.mockRestore();
  });

  it('should set status to error if the form is invalid', () => {
    component.brandForm.setValue({
      name: '',
      description: ''
    });

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
    expect(brandService.saveBrand).not.toHaveBeenCalled();
  });

  it('should handle internal server error when saving brand', () => {
    const errorResponse = { status: HttpStatusCode.InternalServerError, error: { message: 'Detailed error message' } };

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => errorResponse));

    component.brandForm.setValue({
      name: 'Brand Name',
      description: 'Brand Description'
    });

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Error en los datos ingresados.');
  });

  it('should handle conflict error when saving brand', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => errorResponse));

    component.brandForm.setValue({
      name: 'Existing Brand',
      description: 'Brand Description'
    });

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Nombre ya en uso, elige otro.');
  });

  it('should handle general errors when saving brand', () => {
    const errorResponse = { status: 400 };  // Otro tipo de error

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => errorResponse));

    component.brandForm.setValue({
      name: 'Brand Name',
      description: 'Brand Description'
    });

    component.saveBrand();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Ocurrió un error al guardar.');
  });

});
