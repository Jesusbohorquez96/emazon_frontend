import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandService } from 'src/app/services/brand.service';
import { Brand } from '../models/brand.model';
import { APP_CONSTANTS } from 'src/styles/constants';

describe('BrandService', () => {
    let service: BrandService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BrandService]
        });

        service = TestBed.inject(BrandService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#getBrands', () => {
        it('should return a list of brands from the API via GET', () => {
            const dummyBrands = {
                content: [{ id: 1, name: 'Brand 1' }, { id: 2, name: 'Brand 2' }],
                totalPages: 1
            };

            service.getBrands(0, 10, 'name', 'asc', '').subscribe(brands => {
                expect(brands.content.length).toBe(2);
                expect(brands).toEqual(dummyBrands);
            });

            const req = httpMock.expectOne(
                `${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.BRANDS_ENDPOINT}?page=0&size=10&sortBy=name&sortDirection=asc`
            );
            expect(req.request.method).toBe('GET');
            req.flush(dummyBrands);
        });

        it('should pass the name parameter when provided', () => {
            const dummyBrands = {
                content: [{ id: 1, name: 'Brand 1' }],
                totalPages: 1
            };

            service.getBrands(0, 10, 'name', 'asc', 'Brand 1').subscribe(brands => {
                expect(brands).toEqual(dummyBrands);
            });

            const req = httpMock.expectOne(
                `${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.BRANDS_ENDPOINT}?page=0&size=10&sortBy=name&sortDirection=asc&name=Brand%201`
            );
            expect(req.request.method).toBe('GET');
            req.flush(dummyBrands);
        });
    });

    describe('#saveBrand', () => {
        it('should send a POST request to save a brand', () => {
            const newBrand: Brand = { id: 3, name: 'Brand 3', description: 'A new brand' };

            service.saveBrand(newBrand).subscribe(response => {
                expect(response).toEqual(newBrand);
            });

            const req = httpMock.expectOne(`${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.BRANDS_ENDPOINT}`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newBrand);
            req.flush(newBrand);
        });
    });
});
