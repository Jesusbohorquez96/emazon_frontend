import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandListComponent } from './brand-list.component';
import { BrandService } from '../../../../services/brand.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BrandListComponent', () => {
  let component: BrandListComponent;
  let fixture: ComponentFixture<BrandListComponent>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandListComponent],
      imports: [HttpClientTestingModule],
      providers: [BrandService]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandListComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.page).toBe(0);
    expect(component.sortBy).toBe('NAME');
    expect(component.sortDirection).toBe('ASC');
    expect(component.searchName).toBe('');
  });

  it('should call getBrands on init', () => {
    const spyGetBrands = jest.spyOn(component, 'getBrands');
    component.ngOnInit();
    expect(spyGetBrands).toHaveBeenCalled();
  });

  it('should fetch brands successfully', () => {
    const mockResponse = {
      content: [
        { brandId: 1, brandName: 'Test Brand 1', brandDescription: 'Description 1' },
        { brandId: 2, brandName: 'Test Brand 2', brandDescription: 'Description 2' }
      ],
      totalPages: 1
    };

    jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockResponse));
    component.getBrands();

    expect(component.brands.length).toBe(2);
    expect(component.totalPages).toBe(1);
  });

  it('should handle error when fetching brands', () => {
    jest.spyOn(brandService, 'getBrands').mockReturnValue(throwError(() => new Error('Error al obtener las marcas')));
    component.getBrands();
    expect(component.brands.length).toBe(0);
  });

  it('should toggle sort direction and fetch brands', () => {
    component.sortDirection = 'ASC';
    component.toggleSort();
    expect(component.sortDirection).toBe('DESC');
    expect(component.page).toBe(0);

    component.toggleSort();
    expect(component.sortDirection).toBe('ASC');
  });

  it('should update page size and fetch brands', () => {
    component.size = 10;
    component.updatePageSize();
    expect(component.page).toBe(0);
  });

  it('should search by name and fetch brands', () => {
    component.searchName = 'Test Brand';
    component.searchByName();
    expect(component.page).toBe(0);
  });

  it('should change to the next page', () => {
    component.totalPages = 3;
    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(2);

    component.nextPage();
    expect(component.page).toBe(2);
  });

  it('should change to the previous page', () => {
    component.page = 2;
    component.prevPage();
    expect(component.page).toBe(1);

    component.prevPage();
    expect(component.page).toBe(0);
  });

  it('should go to a specific valid page', () => {
    component.totalPages = 5;
    component.goToPage(2);
    expect(component.page).toBe(2);
  });

  it('should not go to an invalid page', () => {
    component.totalPages = 3;
    component.goToPage(5);
    expect(component.page).not.toBe(5);
  });

  it('should call onPageChange and get brands', () => {
    const spyGetBrands = jest.spyOn(component, 'getBrands');
    component.onPageChange(2);
    expect(component.page).toBe(2);
    expect(spyGetBrands).toHaveBeenCalled();
  });

  it('should handle response without content or totalPages', () => {
    const mockResponse = {};

    jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockResponse));

    component.getBrands();

    expect(component.brands).toBe(mockResponse);
    expect(component.totalPages).toBe(0);
  });

  it('should load brands with valid response', () => {
    const mockResponse = {
      content: [
        { brandId: 1, brandName: 'Test Brand 1', brandDescription: 'Description 1' }
      ],
      totalPages: 1
    };

    jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockResponse));
    component.loadBrands();

    expect(component.brands.length).toBe(1);
  });

  it('should handle empty response in loadBrands', () => {
    const mockResponse = { content: [] };

    jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockResponse));
    component.loadBrands();

    expect(component.brands.length).toBe(0);
  });

  it('should not go to the next page if on the last page', () => {
    component.page = 2;
    component.totalPages = 3;
    component.nextPage();

    expect(component.page).toBe(2);
  });

  it('should not go to the previous page if on the first page', () => {
    component.page = 0;
    component.prevPage();

    expect(component.page).toBe(0);
  });

});
