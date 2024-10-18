import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxBodegaComponent } from './aux-bodega.component';

describe('AuxBodegaComponent', () => {
  let component: AuxBodegaComponent;
  let fixture: ComponentFixture<AuxBodegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxBodegaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuxBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
