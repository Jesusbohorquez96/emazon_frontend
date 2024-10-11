import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { APP_CONSTANTS } from 'src/styles/constants';
import 'reflect-metadata';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomeComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it(`should have the selector '${APP_CONSTANTS.APP_HOME.SELECTOR}'`, () => {
        const selector = APP_CONSTANTS.APP_HOME.SELECTOR;
        const annotations = Reflect.getMetadata('annotations', component.constructor) || [];
        expect(annotations[0].selector).toBe(selector);
    });

    it('should render the template URL correctly', () => {
        const annotations = Reflect.getMetadata('annotations', component.constructor) || [];
        const templateUrl = APP_CONSTANTS.APP_HOME.TEMPLATE_URL;
        expect(annotations[0].templateUrl).toBe(templateUrl);
    });

    it('should render the style URLs correctly', () => {
        const annotations = Reflect.getMetadata('annotations', component.constructor) || [];
        const styleUrls = APP_CONSTANTS.APP_HOME.STYLE_URLS;
        expect(annotations[0].styleUrls).toEqual(styleUrls);
    });
});
