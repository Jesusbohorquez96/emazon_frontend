import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from '@/app/services/category.service';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CategoryService]
        });

        service = TestBed.inject(CategoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#getCategories', () => {
        it('should return a list of categories from the API via GET', () => {
            const dummyCategories = {
                content: [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }],
                totalPages: 1
            };

            service.getCategories(0, 10, 'name', 'asc').subscribe(categories => {
                expect(categories.content.length).toBe(2);
                expect(categories).toEqual(dummyCategories);
            });

            const req = httpMock.expectOne(`${environment.apiBaseUrl}/categories?page=0&size=10&sortBy=name&sortDirection=asc`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyCategories);
        });

        it('should pass the name parameter when provided', () => {
            const dummyCategories = {
                content: [{ id: 1, name: 'Category 1' }],
                totalPages: 1
            };

            service.getCategories(0, 10, 'name', 'asc', 'searchName').subscribe(categories => {
                expect(categories).toEqual(dummyCategories);
            });

            const req = httpMock.expectOne(`${environment.apiBaseUrl}/categories?page=0&size=10&sortBy=name&sortDirection=asc&name=searchName`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyCategories);
        });
    });

    describe('#saveCategory', () => {
        it('should send a POST request to save a category', () => {
            const newCategory: Category = { id: 3, name: 'Category 3', description: 'A new category' };

            service.saveCategory(newCategory).subscribe(response => {
                expect(response).toEqual(newCategory);
            });

            const req = httpMock.expectOne(`${environment.apiBaseUrl}/categories`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newCategory);
            req.flush(newCategory);
        });
    });
});
