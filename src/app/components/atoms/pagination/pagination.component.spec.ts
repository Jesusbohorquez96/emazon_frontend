import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit previous page if page is greater than 0', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.page = 2;

    component.prevPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit previous page if page is 0', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.page = 0;

    component.prevPage();

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit next page if page is less than totalPages', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.page = 1;
    component.totalPages = 3;

    component.nextPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit next page if page is at totalPages - 1', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.page = 2;
    component.totalPages = 3;

    component.nextPage();

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit the correct page number when goToPage is called', () => {
    jest.spyOn(component.pageChange, 'emit');

    component.goToPage(3);

    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });
});
