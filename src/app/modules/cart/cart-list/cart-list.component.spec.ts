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
      getCartByUser: jest.fn().mockReturnValue(of({
        content: [],
        totalPages: 1,
      })),
      deleteFromCart: jest.fn(),
    };

    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
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

  describe('loadCartItems', () => {
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

      mockCartService.getCartByUser.mockReturnValue(of(mockResponse));

      component.loadCartItems();

      expect(mockCartService.getCartByUser).toHaveBeenCalledWith(
        component.page,
        component.size,
        component.sortBy,
        component.sortDirection
      );

      expect(component.cartItems.length).toBe(1);
      expect(component.cartItems[0].total).toBe(200);
      expect(component.isEmpty).toBe(false);
    });

    it('should handle error when loading cart items', () => {
      mockCartService.getCartByUser.mockReturnValue(throwError(() => new Error('Error fetching cart')));

      component.loadCartItems();

      expect(mockCartService.getCartByUser).toHaveBeenCalled();
      expect(component.isEmpty).toBe(true);
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
        id: 1,
        userId: 1,
        creationDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        articleCategories: [],
        articleBrand: { brandId: 1, brandName: 'Brand1' },
        total: 100,
        articleDescription: 'Test Description',
        categoryNames: '',
        brandName: 'Brand1',
        articleStock: 10
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

  describe('getLastAction', () => {
    it('should return no recent activity when no dates exist', () => {
      component.cartItems = [];
      component.lastDeleteDate = null;

      const result = component.getLastAction();

      expect(result).toEqual({ message: 'Sin actividad reciente', date: null });
    });
  });

  describe('onPageChange', () => {
    it('should update the page number and reload cart items', () => {
      jest.spyOn(component, 'loadCartItems');

      const newPage = 2;

      component.onPageChange(newPage);

      expect(component.page).toBe(newPage);
      expect(component.loadCartItems).toHaveBeenCalled();
    });
  });

  describe('updatePageSize', () => {
    it('should set the size to 1 if the current size is less than 1', () => {
      jest.spyOn(component, 'loadCartItems');

      component.size = 0;
      component.updatePageSize();

      expect(component.size).toBe(1);
      expect(component.page).toBe(0);
      expect(component.loadCartItems).toHaveBeenCalled();
    });

    it('should set the size to 10 if the current size is greater than 10', () => {
      jest.spyOn(component, 'loadCartItems');

      component.size = 15;
      component.updatePageSize();

      expect(component.size).toBe(10);
      expect(component.page).toBe(0);
      expect(component.loadCartItems).toHaveBeenCalled();
    });

    it('should keep the current size if it is within valid range', () => {
      jest.spyOn(component, 'loadCartItems');

      component.size = 5;
      component.updatePageSize();

      expect(component.size).toBe(5);
      expect(component.page).toBe(0);
      expect(component.loadCartItems).toHaveBeenCalled();
    });

    it('should reset the page to 0', () => {
      jest.spyOn(component, 'loadCartItems');

      component.page = 3;
      component.size = 5;
      component.updatePageSize();

      expect(component.page).toBe(0);
      expect(component.loadCartItems).toHaveBeenCalled();
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

  describe('toggleSortDirection', () => {
    it('should toggle sortDirection from ASC to DESC', () => {
      component.sortDirection = APP_CONSTANTS.PAGINATION.ASC;
      jest.spyOn(component, 'loadCartItems');

      component.toggleSortDirection();

      expect(component.sortDirection).toBe(APP_CONSTANTS.PAGINATION.DESC);
      expect(component.loadCartItems).toHaveBeenCalled();
    });

    it('should toggle sortDirection from DESC to ASC', () => {
      component.sortDirection = APP_CONSTANTS.PAGINATION.DESC;
      jest.spyOn(component, 'loadCartItems');

      component.toggleSortDirection();

      expect(component.sortDirection).toBe(APP_CONSTANTS.PAGINATION.ASC);
      expect(component.loadCartItems).toHaveBeenCalled();
    });

    it('should call loadCartItems after toggling sortDirection', () => {
      component.sortDirection = APP_CONSTANTS.PAGINATION.ASC;
      const loadItemsSpy = jest.spyOn(component, 'loadCartItems');

      component.toggleSortDirection();

      expect(loadItemsSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call loadCartItems on initialization', () => {
      jest.spyOn(component, 'loadCartItems');

      component.ngOnInit();

      expect(component.loadCartItems).toHaveBeenCalled();
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
  
      expect(result)
    });
  
    it('should return the delete date if it is more recent than the add/update dates', () => {
      component.cartItems = [
        { updateDate: '2024-11-10T10:00:00Z' },
        { updateDate: '2024-11-11T15:00:00Z' },
      ] as any;
      component.lastDeleteDate = '2024-11-12T00:00:00Z';
  
      const result = component.getLastAction();
  
      expect(result)
    });
  
    it('should return the add/update date if there is no delete date', () => {
      component.cartItems = [
        { updateDate: '2024-11-10T10:00:00Z' },
        { updateDate: '2024-11-12T15:00:00Z' },
      ] as any;
      component.lastDeleteDate = null; 
  
      const result = component.getLastAction();
  
      expect(result)
      
    });
  
    it('should return the delete date if there are no cart items', () => {
      component.cartItems = []; 
      component.lastDeleteDate = '2024-11-12T00:00:00Z';
  
      const result = component.getLastAction();
  
      expect(result)
      
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

  describe('handleAction', () => {  
    it('should not call deleteCartItem when the action is not "delete"', () => {
      const deleteSpy = jest.spyOn(component, 'deleteCartItem');
      const mockEvent = { action: 'update', row: { articleId: 1 } };
  
      component.handleAction(mockEvent);
  
      expect(deleteSpy).not.toHaveBeenCalled();
    });
  });

});

