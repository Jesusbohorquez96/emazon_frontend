import { NavigationEnd } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let rendererMock: Renderer2;
  let routerMock: any;

  beforeEach(() => {
    rendererMock = { addClass: jest.fn(), removeClass: jest.fn() } as any;
    routerMock = {
      events: {
        subscribe: jest.fn()
      },
      url: ''
    };

    component = new AppComponent(routerMock, rendererMock);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to router events on initialization', () => {
    const subscribeSpy = jest.spyOn(routerMock.events, 'subscribe');
    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('should initialize the component correctly', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should add no-navbar class when navigating to /other-page', () => {
    const mockEvent = new NavigationEnd(0, '/other-page', '/other-page');
    routerMock.url = '/other-page';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, 'no-navbar');
    expect(rendererMock.removeClass).not.toHaveBeenCalled();
  });

  it('should do nothing if router.url is an empty string', () => {
    const mockEvent = new NavigationEnd(0, '', '');
    routerMock.url = ''; // URL vacía

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.removeClass).not.toHaveBeenCalled();
  });

  it('should subscribe to router events on initialization', () => {
    const subscribeSpy = jest.spyOn(routerMock.events, 'subscribe');

    component = new AppComponent(routerMock, rendererMock);

    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('should remove no-navbar class when navigating to a route that does not include /other-page', () => {
    const mockEvent = new NavigationEnd(0, '/some-other-route', '/some-other-route');
    routerMock.url = '/some-other-route';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    const mockBody = document.createElement('body');
    jest.spyOn(document, 'body', 'get').mockReturnValue(mockBody);

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.removeClass).toHaveBeenCalledWith(mockBody, 'no-navbar');
    expect(rendererMock.addClass).not.toHaveBeenCalled();
  });

  it('should do nothing if router.url is null', () => {
    const mockEvent = new NavigationEnd(0, '/null', '/null');
    routerMock.url = null; // URL nula

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.addClass).not.toHaveBeenCalled();
  });

  it('should not add no-navbar class when navigating to a route that contains /other-page as a substring', () => {
    const mockEvent = new NavigationEnd(0, '/other-page-sub', '/other-page-sub');
    routerMock.url = '/other-page-sub';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.addClass).not.toHaveBeenCalled();
    expect(rendererMock.removeClass).toHaveBeenCalledWith(document.body, 'no-navbar');
  });

  it('should handle gracefully when document.body is undefined', () => {
    const mockEvent = new NavigationEnd(0, '/other-page', '/other-page');
    routerMock.url = '/other-page';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    jest.spyOn(document, 'body', 'get').mockReturnValue(undefined as any);

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.removeClass).not.toHaveBeenCalled();
  });

  it('should do nothing if event is not NavigationEnd', () => {
    const mockEvent = { id: 1, url: '/test-route' };

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);

    expect(rendererMock.addClass).not.toHaveBeenCalled();
    expect(rendererMock.removeClass).not.toHaveBeenCalled();
  });

  it('should subscribe to router events on initialization', () => {
    const subscribeSpy = jest.spyOn(routerMock.events, 'subscribe');

    component = new AppComponent(routerMock, rendererMock);

    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('should throw an error when querySelector is called', () => {
    expect(() => component.querySelector('some-selector')).toThrowError('Method not implemented.');
  });

  it('should remove no-navbar class when navigating to a route other than /other-page', () => {
    const mockEvent = new NavigationEnd(0, '/some-other-route', '/some-other-route');
    routerMock.url = '/some-other-route';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.removeClass).toHaveBeenCalledWith(document.body, 'no-navbar');
    expect(rendererMock.addClass).not.toHaveBeenCalled();
  });

  it('should do nothing if event is not NavigationEnd', () => {
    const mockEvent = { id: 1, url: '/test-route' };
    routerMock.url = '/test-route';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.addClass).not.toHaveBeenCalled();
    expect(rendererMock.removeClass).not.toHaveBeenCalled();
  });

  it('should throw an error when querySelector is called', () => {
    expect(() => component.querySelector('some-selector')).toThrowError('Method not implemented.');
  });

  it('should not add no-navbar class when navigating to a route that contains /other-page as a substring but is not exactly /other-page', () => {
    const mockEvent = new NavigationEnd(0, '/other-page-extra', '/other-page-extra');
    routerMock.url = '/other-page-extra';

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.addClass).not.toHaveBeenCalled();
    expect(rendererMock.removeClass).toHaveBeenCalledWith(document.body, 'no-navbar');
  });

  it('should do nothing if router.url is null or undefined', () => {
    const mockEvent = new NavigationEnd(0, '/null', '/null');
    routerMock.url = null;

    (routerMock.events.subscribe as jest.Mock).mockImplementation((callback: Function) => {
      callback(mockEvent);
    });

    component = new AppComponent(routerMock, rendererMock);
    component.ngOnInit();

    expect(rendererMock.addClass).not.toHaveBeenCalled();
  });
});
