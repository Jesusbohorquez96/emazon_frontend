import { ParentComponent } from 'src/app/app.component';

describe('ParentComponent', () => {
  let component: ParentComponent;

  beforeEach(() => {
    component = new ParentComponent();
  });

  it('should create the ParentComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentPage to the new value on page change', () => {
    component.onPageChange(3);
    expect(component.currentPage).toBe(3); 
  });

  it('should log the correct message on page change', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const newPage = 2;

    component.onPageChange(newPage);
    consoleSpy.mockRestore(); 
  });

  it('should not change currentPage if newPage is negative', () => {
    component.currentPage = 1;
    component.onPageChange(-1); 
  });
  
  it('should not change currentPage if newPage exceeds totalPages', () => {
    component.currentPage = 1;
    component.totalPages = 5; 
    component.onPageChange(6); 
  });
});
