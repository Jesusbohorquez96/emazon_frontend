export const APP_CONSTANTS = {
    NAME: 'name',
    WELCOME: 'welcome',
    CATEGORIES: 'categorias',
    BRANDS: 'marcas',
    DEFAULT: '',
    WILDCARD: '**',
    FULL: 'full',
    NO_NAVBAR: 'no-navbar',

    ROOT: {
        SELECTOR: 'app-root',
        TEMPLATE_URL: './app.component.html',
        STYLE_URLS: ['./app.component.scss'],
    },

    APP_WELCOME: {
        SELECTOR: 'app-welcome',
        TEMPLATE_URL: './welcome.component.html',
        STYLE_URLS: ['./welcome.component.scss'],
    },

    HIDE_NAVBAR_ROUTES: ['/login', '/register', '/other-page'],

    PAGINATION: {
        ZERO: 0,
        TOTAL_PAGES: 10,
        PAGE: 'page',
        SIZE: 'size',
        PAGE_CHANGE_MESSAGE: (newPage: number) => `Página cambiada a: ${newPage}`,
    },

    APP_TITLE: 'emazon_frontend',
}