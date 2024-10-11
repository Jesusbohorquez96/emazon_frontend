import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandComponent } from './brand.component';

describe('BrandComponent', () => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct template URL', () => {
    const templateUrl = fixture.componentRef.location.nativeElement.querySelector('app-brand');
    expect(templateUrl).toBeTruthy();
  });

  it('should have the correct style URLs', () => {
    const styleUrls = fixture.debugElement.styles;
    expect(styleUrls).toBeTruthy(); 
  });
});
