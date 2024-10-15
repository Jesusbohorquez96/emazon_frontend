import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomeComponent]
        }).compileComponents();

    });

    it('should create the component', () => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

});
