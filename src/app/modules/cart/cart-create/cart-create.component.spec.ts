import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartCreateComponent } from './cart-create.component';
import { CartService } from 'src/app/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SimpleChange } from '@angular/core';

describe('CartCreateComponent', () => {
  let component: CartCreateComponent;
  let fixture: ComponentFixture<CartCreateComponent>;
  let mockCartService: any;
  let mockToastr: any;

  beforeEach(async () => {
    mockCartService = {
      addToCart: jest.fn(),
    };

    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CartCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CartService, useValue: mockCartService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form with default values', () => {
      component.articleId = 123;
      component.ngOnInit();
      expect(component.cartForm.value).toEqual({
        articleId: 123,
        quantity: 1
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should update articleId in the form when articleId input changes', () => {
      component.ngOnInit();
      const newArticleId = 456;
      component.articleId = newArticleId;

      component.ngOnChanges({
        articleId: new SimpleChange(null, newArticleId, false)
      });

      expect(component.cartForm.get('articleId')?.value).toBe(newArticleId);
    });
  });

  describe('addItemToCart', () => {
    it('should show error message if form is invalid', () => {
      component.ngOnInit();
      component.cartForm.get('quantity')?.setValue(null); 

      component.addItemToCart();

      expect(mockToastr.error).toHaveBeenCalledWith('Por favor, completa todos los campos correctamente.');
    });

    it('should call cartService.addToCart and show success message on success', () => {
      component.ngOnInit();
      const cartData = { articleId: 123, quantity: 2 };
      component.cartForm.setValue(cartData);

      mockCartService.addToCart.mockReturnValue(of({}));

      component.addItemToCart();

      expect(mockCartService.addToCart).toHaveBeenCalledWith(cartData);
      expect(mockToastr.success).toHaveBeenCalledWith('Artículo agregado al carrito exitosamente.');
      expect(component.cartItems).toContainEqual(cartData);
    });

    it('should handle 409 error and show appropriate error message', () => {
      component.ngOnInit();
      component.cartForm.setValue({ articleId: 123, quantity: 2 });

      mockCartService.addToCart.mockReturnValue(throwError({ status: 409 }));

      component.addItemToCart();

      expect(mockToastr.error).toHaveBeenCalledWith('No puedes agregar más de 3 artículos de esta categoría al carrito.');
    });

    it('should handle 500 error and show appropriate error message', () => {
      component.ngOnInit();
      component.cartForm.setValue({ articleId: 123, quantity: 2 });

      mockCartService.addToCart.mockReturnValue(throwError({ status: 500 }));

      component.addItemToCart();

      expect(mockToastr.error).toHaveBeenCalledWith('Error: Ya existe un artículo con el mismo ID en el carrito.');
    });

    it('should handle 404 error and show restock date message', () => {
      component.ngOnInit();
      component.cartForm.setValue({ articleId: 123, quantity: 2 });
      jest.spyOn(component, 'calculateRestockDate').mockReturnValue('martes, 21 de noviembre de 2024');

      mockCartService.addToCart.mockReturnValue(throwError({ status: 404 }));

      component.addItemToCart();

      expect(mockToastr.error).toHaveBeenCalledWith('Stock insuficiente. Fecha de abastecimiento: martes, 21 de noviembre de 2024');
    });

    it('should show generic error message for other errors', () => {
      component.ngOnInit();
      component.cartForm.setValue({ articleId: 123, quantity: 2 });

      mockCartService.addToCart.mockReturnValue(throwError({ status: 400 }));

      component.addItemToCart();

      expect(mockToastr.error).toHaveBeenCalledWith('Error al agregar el artículo al carrito.');
    });
  });

  describe('resetForm', () => {
    it('should reset form values to default', () => {
      component.ngOnInit();
      component.cartForm.setValue({ articleId: 123, quantity: 5 });

      component.resetForm();

      expect(component.cartForm.value)
    });
  });
});
