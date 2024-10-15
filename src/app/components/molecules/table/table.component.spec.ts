import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { SimpleChange } from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;

  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  const mockSelectedItems = [
    { id: 1, name: 'Item 1' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty selectedItems', () => {
    expect(component.selectedItems).toEqual([]);
  });

  it('should update data selection when data changes', () => {
    const dataChange = new SimpleChange(null, mockData, false);
    component.ngOnChanges({ data: dataChange });

    expect(component.dataSelected.length); 
  });

  it('should update data selection when selectedItems changes', () => {
    const selectedItemsChange = new SimpleChange(null, mockSelectedItems, false);
    component.ngOnChanges({ selectedItems: selectedItemsChange });

    expect(component.selectedItems.length);
  });

  it('should check if a row is selected correctly', () => {
    component.selectedItems = mockSelectedItems;
    const isSelected = component.isSelected(mockData[0]);
    expect(isSelected).toBe(true);
  });

  it('should emit selectedChangue event when a row is selected', () => {
    const selectedChangueSpy = jest.spyOn(component.selectedChangue, 'emit');
    component.selectedEnabled = true;
    component.onRowSelectionChange(mockData[1], { target: { checked: true } } as any);

    expect(selectedChangueSpy).toHaveBeenCalledWith([mockData[1]]);
  });

  it('should remove selected item when unchecked', () => {
    component.selectedItems = mockSelectedItems;
    component.selectedEnabled = true;
    component.onRowSelectionChange(mockSelectedItems[0], { target: { checked: false } } as any);

    expect(component.selectedItems.length).toBe(0);
  });

  it('should not update data selection if selectedEnabled is false', () => {
    component.selectedEnabled = false;
    component.updateDataSelection();

    expect(component.dataSelected.length).toBe(0); 
  });

  it('should map data items correctly when updateDataSelection is called', () => {
    component.selectedEnabled = true;
    component.data = mockData;
    component.selectedItems = mockSelectedItems;

    component.updateDataSelection();
    expect(component.dataSelected[0]).toBe(true); 
    expect(component.dataSelected[1]).toBe(false); 
  });

  it('should call updateDataSelection if selectedEnabled is true on init', () => {
    const updateDataSelectionSpy = jest.spyOn(component, 'updateDataSelection');
    
    component.selectedEnabled = true;
    component.ngOnInit();
    
    expect(updateDataSelectionSpy).toHaveBeenCalled();
  });
  
});
