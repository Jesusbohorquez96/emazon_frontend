import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from '@/app/services/category.service';
import { Category } from '../models/category.model';

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
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#saveCategory', () => {
        it('should include Authorization header when token is present', () => {
            const mockCategory: Category = { id: 1, name: 'Category 1', description: 'Test Description' };
            const mockToken = 'testAuthToken';

            localStorage.setItem('authToken', mockToken);

            service.saveCategory(mockCategory).subscribe(response => {
                expect(response).toEqual(mockCategory);
            });

            const req = httpMock.expectOne(`${service['apiUrl']}`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockCategory);
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
            expect(req.request.headers.get('Content-Type')).toBe('application/json');

            req.flush(mockCategory);
        });

        it('should not include Authorization header when token is missing', () => {
            const mockCategory: Category = { id: 1, name: 'Category 1', description: 'Test Description' };

            localStorage.removeItem('authToken');

            service.saveCategory(mockCategory).subscribe(response => {
                expect(response).toEqual(mockCategory);
            });

            const req = httpMock.expectOne(`${service['apiUrl']}`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockCategory);
            expect(req.request.headers.get('Authorization')).toBeNull(); 
            expect(req.request.headers.get('Content-Type')).toBe('application/json');

            req.flush(mockCategory);
        });
    });
});
