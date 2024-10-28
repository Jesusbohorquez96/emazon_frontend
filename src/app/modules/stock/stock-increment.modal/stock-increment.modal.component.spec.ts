import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIncrementModalComponent } from './stock-increment.modal.component';

describe('StockIncrementModalComponent', () => {
  let component: StockIncrementModalComponent;
  let fixture: ComponentFixture<StockIncrementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockIncrementModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockIncrementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
