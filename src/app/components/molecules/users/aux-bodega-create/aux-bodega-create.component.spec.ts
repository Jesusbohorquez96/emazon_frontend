import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxBodegaCreateComponent } from './aux-bodega-create.component';

describe('AuxBodegaCreateComponentComponent', () => {
  let component: AuxBodegaCreateComponent;
  let fixture: ComponentFixture<AuxBodegaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuxBodegaCreateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuxBodegaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
