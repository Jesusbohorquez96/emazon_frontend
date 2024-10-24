import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [HomeComponent]
        });

        component = TestBed.inject(HomeComponent);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should ngOnInit', () => {
        const spy = jest.spyOn(component, 'ngOnInit');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

});    
