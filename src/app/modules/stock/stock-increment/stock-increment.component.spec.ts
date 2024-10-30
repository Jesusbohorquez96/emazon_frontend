import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { SuppliesService } from '@/app/services/supplies.service';
import { StockIncrementComponent } from './stock-increment.component';
import { ToastrService } from 'ngx-toastr';

jest.mock('ngx-toastr');

describe('StockIncrementComponent', () => {
  let component: StockIncrementComponent;
  let fixture: ComponentFixture<StockIncrementComponent>;
  let supplyService: SuppliesService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    const supplyServiceMock = {
      updateStock: jest.fn()
    };
    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [StockIncrementComponent],
      providers: [
        { provide: SuppliesService, useValue: supplyServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockIncrementComponent);
    component = fixture.componentInstance;
    supplyService = TestBed.inject(SuppliesService);
    toastrService = TestBed.inject(ToastrService);
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should initialize the stockForm', () => {
      expect(component.stockForm).toBeDefined();
      expect(component.stockForm.get('name')).toBeTruthy();
      expect(component.stockForm.get('quantity')).toBeTruthy();
      expect(component.stockForm.get('status')).toBeTruthy();
      expect(component.stockForm.get('articleId')).toBeTruthy();
    });
  });

  describe('#updateStock', () => {
    it('should show error message if form is invalid', () => {
      component.stockForm.controls['name'].setValue('');
      component.stockForm.controls['quantity'].setValue('');

      component.updateStock();

      expect(toastrService.error).toHaveBeenCalledWith('Por favor completa todos los campos requeridos correctamente.');
    });

    it('should call supplyService.updateStock and show success message on success', () => {
      const mockStockData = { name: 'Test', quantity: 5, status: 'nuevo', articleId: 1 };
      component.stockForm.setValue(mockStockData);
      (supplyService.updateStock as jest.Mock).mockReturnValue(of({}));

      component.updateStock();

      expect(supplyService.updateStock).toHaveBeenCalledWith(mockStockData);
      expect(component.responseMessage).toBe('Stock actualizado correctamente');
      expect(toastrService.success).toHaveBeenCalledWith('Stock actualizado correctamente');
      expect(component.stockForm.value).toEqual({
        name: '',
        quantity: 0,
        status: 'nuevo',
        articleId: null
      });
    });

    it('should show server error message on InternalServerError', () => {
      const mockStockData = { name: 'Test', quantity: 5, status: 'nuevo', articleId: 1 };
      component.stockForm.setValue(mockStockData);
      (supplyService.updateStock as jest.Mock).mockReturnValue(throwError({ status: HttpStatusCode.InternalServerError }));

      component.updateStock();

      expect(supplyService.updateStock).toHaveBeenCalledWith(mockStockData);
      expect(component.responseMessage).toBe('Hubo un problema en el servidor. Intenta de nuevo más tarde.');
      expect(toastrService.error).toHaveBeenCalledWith('Hubo un problema en el servidor. Intenta de nuevo más tarde.');
    });

    it('should show conflict error message on Conflict status', () => {
      const mockStockData = { name: 'Test', quantity: 5, status: 'nuevo', articleId: 1 };
      component.stockForm.setValue(mockStockData);
      (supplyService.updateStock as jest.Mock).mockReturnValue(throwError({ status: HttpStatusCode.Conflict }));

      component.updateStock();

      expect(supplyService.updateStock).toHaveBeenCalledWith(mockStockData);
      expect(component.responseMessage).toBe('El stock ya existe o hay un conflicto en la operación.');
      expect(toastrService.error).toHaveBeenCalledWith('El stock ya existe o hay un conflicto en la operación.');
    });
  });
});
