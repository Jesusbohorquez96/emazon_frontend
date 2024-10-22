import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandListComponent } from './brand-list.component';
import { BrandService } from '../../../services/brand.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrandResponse } from '@/app/models/brand.model';
import { EventEmitter } from '@angular/core';
import { APP_CONSTANTS } from '@/styles/constants';

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

  it('should emit brandsSelected when handleBrandChange is called', () => {
    const brands: BrandResponse[] = [{
      brandId: 1, brandName: 'Brand 1',
      brandDescription: ''
    }, {
      brandId: 2, brandName: 'Brand 2',
      brandDescription: ''
    }];
    component.brandsSelected = new EventEmitter<BrandResponse[]>();
    const emitSpy = jest.spyOn(component.brandsSelected, 'emit');
    component.handleBrandChange(brands);
    expect(emitSpy).toHaveBeenCalledWith(brands);
  });

  it('should toggleSort asendente o desendente ', () => {
    component.toggleSort();
    expect(component.sortDirection);
    component.toggleSort();
    expect(component.sortDirection);
  });

  it('should assign response.content to this.brands in loadBrands', () => {
    const response = { content: [{ id: 1, name: 'Brand 1' }, { id: 2, name: 'Brand 2' }] };
    jest.spyOn(brandService, 'getBrands').mockReturnValue(of(response));

    component.brands = [];
    component.loadBrands();

    expect(component.brands).toEqual(response.content);
  });

  it('should set size to 1 if size is less than 1', () => {
    component.size = 0;
    jest.spyOn(component, 'search');

    component.updatePageSize();

    expect(component.size).toBe(1);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });

  it('should set size to 10 if size is greater than 10', () => {
    component.size = 15;
    jest.spyOn(component, 'search');

    component.updatePageSize();

    expect(component.size).toBe(10);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });

  it('should not change size if it is between 1 and 10', () => {
    component.size = 5;
    jest.spyOn(component, 'search');

    component.updatePageSize();

    expect(component.size).toBe(5);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });

  it('should reset page and call getBrands when searchByName is called', () => {
    const getBrandsSpy = jest.spyOn(component, 'getBrands');

    component.page = 1;

    component.searchByName();

    expect(component.page).toBe(APP_CONSTANTS.PAGINATION.ZERO);
    expect(getBrandsSpy).toHaveBeenCalled();
  });

  it('should update page and call getBrands when onPageChange is called', () => {
    const newPage = 2;
    const getBrandsSpy = jest.spyOn(component, 'getBrands');

    component.onPageChange(newPage);

    expect(component.page).toBe(newPage);
    expect(getBrandsSpy).toHaveBeenCalled();
  });

  it('should update page and call getBrands when goToPage is called with a valid page', () => {
    const validPage = 1;
    const getBrandsSpy = jest.spyOn(component, 'getBrands');

    component.totalPages = 5;

    component.goToPage(validPage);

    expect(component.page).toBe(validPage);
    expect(getBrandsSpy).toHaveBeenCalled();
  });

  it('should increment page and call getBrands when nextPage is called and there are more pages', () => {
    component.page = 1;
    component.totalPages = 3;
    const getBrandsSpy = jest.spyOn(component, 'getBrands');

    component.nextPage();

    expect(component.page).toBe(2);
    expect(getBrandsSpy).toHaveBeenCalled();
  });

  it('should decrement page and call getBrands when prevPage is called and there is a previous page', () => {
    component.page = 1;
    const getBrandsSpy = jest.spyOn(component, 'getBrands');

    component.prevPage();

    expect(component.page).toBe(0);
    expect(getBrandsSpy).toHaveBeenCalled();
  });

  it('should call brandService.getBrands with correct parameters and handle response', () => {
    const mockResponse = {
      content: ['Brand1', 'Brand2'],
      totalPages: 3,
    };

    const getBrandsSpy = jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockResponse));

    component.page = 1;
    component.size = 10;
    component.sortBy = 'NAME';
    component.sortDirection = 'ASC';
    component.searchName = '';

    component.getBrands();

    expect(getBrandsSpy).toHaveBeenCalledWith(component.page, component.size, component.sortBy, component.sortDirection, component.searchName);
    expect(component.brands).toEqual(mockResponse.content);
    expect(component.totalPages).toBe(mockResponse.totalPages);
  });

  it('should log error when getBrands fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const errorMessage = 'Error al obtener marcas';
    const getBrandsSpy = jest.spyOn(brandService, 'getBrands').mockReturnValue(throwError(errorMessage));
    component.getBrands();
    expect(errorSpy).toHaveBeenCalledWith('Error al obtener marcas:', errorMessage);
    errorSpy.mockRestore();
  });

  it('should set totalPages to ZERO when response does not have totalPages', () => {
    const mockResponse = {
      content: ['Brand1', 'Brand2'],
    };
    const getBrandsSpy = jest.spyOn(brandService, 'getBrands').mockReturnValue(of(mockResponse));
    component.getBrands();
    expect(component.totalPages).toBe(APP_CONSTANTS.PAGINATION.ZERO);
  });

});
