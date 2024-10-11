import { environment } from "src/environments/environment";

const FULL: "full" | "prefix" = "full";

export const APP_CONSTANTS = {
    FULL,
    NAME: 'name',
    HOME: 'home',
    CATEGORIES: 'categorias',
    BRANDS: 'marcas',
    DEFAULT: '',
    WILDCARD: '**',
    NO_NAVBAR: 'no-navbar',
    ROOT: 'root',

    NUMBER: {
        ZERO: 0,
        ONE: 1,
        TWO: 2,
        THREE: 3,
        MAX_RETRIES: 5,
        NAME_LENGTH: 50,
        DESCRIPTION_LENGTH: 120,
        MAX_VALUE: 1000,
        TIMEOUT_MS: 5000,
    },
   
    API: {
        BASE_URL: environment.apiBaseUrl,  
        CATEGORIES_ENDPOINT: '/categories', 
        BRANDS_ENDPOINT: '/brands',

      },

    APP_ROOT: {
        SELECTOR: 'app-root',
        TEMPLATE_URL: './app.component.html',
        STYLE_URLS: ['./app.component.scss'],
    },

    APP_HOME: {
        SELECTOR: 'app-home',
        TEMPLATE_URL: './home.component.html',
        STYLE_URLS: ['./home.component.scss'],
    },
    HIDE_NAVBAR_ROUTES: ['/login', '/register', '/other-page'],

    PAGINATION: {
        SPACE: '',
        ZERO: 0,
        DEFAULT_NAME: 'NAME',
        TOTAL_PAGES: 10,
        MIN_ASC: 'asc',
        ASC: 'ASC',
        DESC: 'DESC',
        PAGE: 'page',
        SIZE: 'size',
        SORT_BY: 'sortBy',
        SORT_DERECTION: 'sortDirection',
        PAGE_CHANGE_MESSAGE: (newPage: number) => `Página cambiada a: ${newPage}`,
    },

    SAVE: {
        TYPE:'Content-Type',
        JSON: 'application/json',
    },

    APP_TITLE: 'emazon',
}