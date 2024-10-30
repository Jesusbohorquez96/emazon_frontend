import { TestBed } from '@angular/core/testing';
import { VisibilityService } from './visibility.service';

describe('VisibilityService', () => {
  let service: VisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisibilityService]
    });
    service = TestBed.inject(VisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have navbar visible initially', (done) => {
    service.navbarVisible$.subscribe((visible) => {
      expect(visible).toBe(true);
      done();
    });
  });

  it('should have footer visible initially', (done) => {
    service.footerVisible$.subscribe((visible) => {
      expect(visible).toBe(true);
      done();
    });
  });

  it('should hide navbar', (done) => {
    service.hideNavbar();
    service.navbarVisible$.subscribe((visible) => {
      expect(visible).toBe(false);
      done();
    });
  });

  it('should show navbar', (done) => {
    service.hideNavbar();
    service.showNavbar();
    service.navbarVisible$.subscribe((visible) => {
      expect(visible).toBe(true);
      done();
    });
  });

  it('should hide footer', (done) => {
    service.hideFooter();
    service.footerVisible$.subscribe((visible) => {
      expect(visible).toBe(false);
      done();
    });
  });

  it('should show footer', (done) => {
    service.hideFooter();
    service.showFooter();
    service.footerVisible$.subscribe((visible) => {
      expect(visible).toBe(true);
      done();
    });
  });
});
