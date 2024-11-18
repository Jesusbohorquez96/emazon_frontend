import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartListComponent } from './cart-list.component';
import { CartService } from '@/app/services/cart.service';
import { APP_CONSTANTS } from '@/styles/constants';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;
  let mockCartService: any;
  let mockToastr: any;

  beforeEach(async () => {
    mockCartService = {
      getFilteredArticles: jest.fn().mockReturnValue(of({
        content: [],
        totalPages: 1,
      })),
      deleteFromCart: jest.fn(),
    };

    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CartListComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ToastrService, useValue: mockToastr },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadFilteredArticles and checkScreenSize on initialization', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      jest.spyOn(component, 'checkScreenSize');

      component.ngOnInit();

      expect(component.loadFilteredArticles).toHaveBeenCalled();
      expect(component.checkScreenSize).toHaveBeenCalled();
    });
  });

  describe('loadFilteredArticles', () => {
    it('should load cart items successfully', () => {
      const mockResponse = {
        content: [
          {
            articleId: 1,
            articleName: 'Test Article',
            quantity: 2,
            articlePrice: 100,
            articleCategories: [{ categoryName: 'Category1' }],
            articleBrand: { brandId: 1, brandName: 'Brand1' },
            updateDate: new Date().toISOString(),
          },
        ],
        totalPages: 1,
      };

      mockCartService.getFilteredArticles.mockReturnValue(of(mockResponse));

      component.loadFilteredArticles();

      expect(mockCartService.getFilteredArticles).toHaveBeenCalledWith(
        component.page,
        component.size,
        component.sortBy,
        component.sortDirection,
        component.selectedCategory,
        component.selectedBrand
      );

      expect(component.cartItems.length).toBe(1);
      expect(component.cartItems[0].total).toBe(200);
      expect(component.isEmpty).toBe(false);
    });

    it('should handle error when loading cart items', () => {
      mockCartService.getFilteredArticles.mockReturnValue(throwError(() => new Error('Error fetching cart')));

      component.loadFilteredArticles();

      expect(mockCartService.getFilteredArticles).toHaveBeenCalled();
      expect(component.isEmpty).toBe(true);
      expect(mockToastr.error);
    });
  });

  describe('deleteCartItem', () => {
    it('should delete a cart item successfully', () => {
      const articleId = 1;
      component.cartItems = [{
        articleId,
        articleName: 'Test Article',
        quantity: 1,
        articlePrice: 100,
        articleCategories: [],
        articleBrand: { brandId: 1, brandName: 'Brand1' },
        categoryNames: 'Category1',
        brandName: 'Brand1',
        total: 100,
        id: 1,
        userId: 1,
        creationDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        articleDescription: 'Test Description',
        articleStock: 10,
      }];
      mockCartService.deleteFromCart.mockReturnValue(of(null));

      component.deleteCartItem(articleId);

      expect(mockCartService.deleteFromCart).toHaveBeenCalledWith(articleId);
      expect(mockToastr.success).toHaveBeenCalledWith('Artículo Test Article eliminado del carrito');
    });

    it('should handle error when deleting a cart item', () => {
      const articleId = 1;
      mockCartService.deleteFromCart.mockReturnValue(throwError(() => new Error('Delete error')));

      component.deleteCartItem(articleId);

      expect(mockCartService.deleteFromCart).toHaveBeenCalledWith(articleId);
      expect(mockToastr.error).toHaveBeenCalledWith(`Error al eliminar el artículo con ID ${articleId}:`, expect.any(Error));
    });
  });

  describe('onResize', () => {
    it('should update isMobileView when the window is resized', () => {
      jest.spyOn(component, 'checkScreenSize');

      window.dispatchEvent(new Event('resize'));

      expect(component.checkScreenSize).toHaveBeenCalled();
    });
  });

  describe('checkScreenSize', () => {
    it('should set isMobileView to true if window width is <= 768', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      component.checkScreenSize();
      expect(component.isMobileView).toBe(true);
    });

    it('should set isMobileView to false if window width is > 768', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      component.checkScreenSize();
      expect(component.isMobileView).toBe(false);
    });
  });

  describe('getLastAction', () => {
    it('should return the most recent add/update date if it is after the delete date', () => {
      component.cartItems = [
        { updateDate: '2024-11-10T10:00:00Z' },
        { updateDate: '2024-11-12T15:00:00Z' },
      ] as any;
      component.lastDeleteDate = '2024-11-11T00:00:00Z';

      const result = component.getLastAction();

      expect(result).toEqual({
        message: 'Última actualización',
        date: new Date('2024-11-12T15:00:00Z').toLocaleString('es-ES'),
      });
    });

    it('should return "Sin actividad reciente" if no activity is found', () => {
      component.cartItems = [];
      component.lastDeleteDate = null;

      const result = component.getLastAction();

      expect(result).toEqual({ message: 'Sin actividad reciente', date: null });
    });
  });

  describe('updatePageSize', () => {
    it('should set the size to 1 if the current size is less than 1', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      component.size = 0;
      component.updatePageSize();
      expect(component.size).toBe(1);
      expect(component.page).toBe(0);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  
    it('should set the size to 10 if the current size is greater than 10', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      component.size = 15;
      component.updatePageSize();
      expect(component.size).toBe(10);
      expect(component.page).toBe(0);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  
    it('should keep the size as is if it is within the valid range', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      component.size = 5;
      component.updatePageSize();
      expect(component.size).toBe(5);
      expect(component.page).toBe(0);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  
    it('should reset the page to 0 regardless of the size value', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      component.page = 3;
      component.size = 5;
      component.updatePageSize();
      expect(component.page).toBe(0);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  });
  
  describe('toggleSortDirection', () => {
    it('should toggle sortDirection from ASC to DESC and reload filtered articles', () => {
      component.sortDirection = APP_CONSTANTS.PAGINATION.ASC;
      jest.spyOn(component, 'loadFilteredArticles');
  
      component.toggleSortDirection();
  
      expect(component.sortDirection).toBe(APP_CONSTANTS.PAGINATION.DESC);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  
    it('should toggle sortDirection from DESC to ASC and reload filtered articles', () => {
      component.sortDirection = APP_CONSTANTS.PAGINATION.DESC;
      jest.spyOn(component, 'loadFilteredArticles');
  
      component.toggleSortDirection();
  
      expect(component.sortDirection).toBe(APP_CONSTANTS.PAGINATION.ASC);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  
    it('should call loadFilteredArticles after toggling sortDirection', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      component.toggleSortDirection();
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  });
  
  describe('onPageChange', () => {
    it('should update the page number and reload filtered articles', () => {
      const newPage = 2;
      jest.spyOn(component, 'loadFilteredArticles');
  
      component.onPageChange(newPage);
  
      expect(component.page).toBe(newPage);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  
    it('should call loadFilteredArticles when the page changes', () => {
      jest.spyOn(component, 'loadFilteredArticles');
      component.onPageChange(1);
      expect(component.loadFilteredArticles).toHaveBeenCalled();
    });
  });

  describe('getLastAction', () => {
    it('should return the delete date if it is more recent than the add/update date', () => {
      component.cartItems = [
        { updateDate: '2024-11-10T10:00:00Z' },
        { updateDate: '2024-11-11T15:00:00Z' },
      ] as any;
      component.lastDeleteDate = '2024-11-12T00:00:00Z';
  
      const result = component.getLastAction();
  
      expect(result).toEqual({
        message: 'Última eliminacion',
        date: new Date('2024-11-12T00:00:00Z').toLocaleString('es-ES'),
      });
    });
  
    it('should return the add/update date if it is more recent than the delete date', () => {
      component.cartItems = [
        { updateDate: '2024-11-10T10:00:00Z' },
        { updateDate: '2024-11-12T15:00:00Z' },
      ] as any;
      component.lastDeleteDate = '2024-11-11T00:00:00Z';
  
      const result = component.getLastAction();
  
      expect(result).toEqual({
        message: 'Última actualización',
        date: new Date('2024-11-12T15:00:00Z').toLocaleString('es-ES'),
      });
    });
  
    it('should return the delete date if there are no cart items', () => {
      component.cartItems = [];
      component.lastDeleteDate = '2024-11-12T00:00:00Z';
  
      const result = component.getLastAction();
  
      expect(result).toEqual({
        message: 'Última eliminacion',
        date: new Date('2024-11-12T00:00:00Z').toLocaleString('es-ES'),
      });
    });
  
    it('should return the add/update date if there is no delete date', () => {
      component.cartItems = [
        { updateDate: '2024-11-10T10:00:00Z' },
        { updateDate: '2024-11-12T15:00:00Z' },
      ] as any;
      component.lastDeleteDate = null;
  
      const result = component.getLastAction();
  
      expect(result).toEqual({
        message: 'Última actualización',
        date: new Date('2024-11-12T15:00:00Z').toLocaleString('es-ES'),
      });
    });
  
    it('should return "Sin actividad reciente" if there are no cart items or delete date', () => {
      component.cartItems = [];
      component.lastDeleteDate = null;
  
      const result = component.getLastAction();
  
      expect(result).toEqual({
        message: 'Sin actividad reciente',
        date: null,
      });
    });
  });  
  
  describe('getLastDeleteDate', () => {
    it('should return the lastDeleteDate if it exists', () => {
      const mockDate = '2024-11-15T00:00:00Z';
      component.lastDeleteDate = mockDate;
  
      const result = component.getLastDeleteDate();
  
      expect(result).toBe(mockDate);
    });
  
    it('should return null if lastDeleteDate is not set', () => {
      component.lastDeleteDate = null;
  
      const result = component.getLastDeleteDate();
  
      expect(result).toBeNull();
    });
  });
  
});
