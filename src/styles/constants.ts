import { environment } from "src/environments/environment";

const FULL: "full" | "prefix" = "full";

export const APP_CONSTANTS = {
    FULL,
    URl: '/',
    ERROR: 'error',
    ID: 'Id',
    NAME: 'name',
    DESCRIPTION: 'description',
    lOGIN: 'login',
    HOME: 'home',
    CUSTOMER: 'cliente',
    CATEGORIES: 'categorias',
    BRANDS: 'marcas',
    ARTICLES: 'articulos',
    AUXBODEGA: 'auxbodega',
    DEFAULT: '',
    WILDCARD: '**',
    NO_NAVBAR: 'no-navbar',
    ROOT: 'root',
    CHECKBOX: {
        FIELD: 'checkbox',
        HEADER: 'Seleccionar',
    },


    CATEGORY: {
        ID: 'categoryId',
        NAME: 'categoryName',
        DESCRIPTION: 'categoryDescription',
    },

    BRAND: {
        ID: 'brandId',
        NAME: 'brandName',
        DESCRIPTION: 'brandDescription',
    },

    SPANISH: {
        NAME: 'Nombre',
        DESCRIPTION: 'Descripción',
    },

    MESSAGE: {
        FIELD: 'Este campo es requerido.',
        PRICE: 'El precio mínimo permitido es de 1000 pesos.',
        MAX: 'Excede el número máximo de caracteres.',
        MIN: 'El campo no cumple con la longitud mínima requerida.',
        NUMBER: 'El campo debe ser un número.',
        PATTERN: 'El teléfono debe empezar con "+" y tener de 7 a 13 dígitos.'
    },

    ERRORS: {
        SUCCESS: 'success',
        SAVED_MARCA: 'Saved Brand:',
        SAVED: 'Saved Category:',
        ANSWER: 'Respuesta de la API:',
        USE: 'Nombre ya en uso, elige otro.',
        DATA: 'Ususario no autorizado.',
        ERROR: 'Error al guardar la categoría:',
        ERROR_MARCA: 'Error al guardar la marca:',
        OCCURRED: 'Ocurrió un error al guardar.',
        INCOME: 'Error interno del servidor.',
        OBTAIN: 'Error al obtener las categorías:',
        OBTAIN_BRAND: 'Error al obtener las marcas:',
        CORRECT: 'Corrige los errores del formulario.',
    },

    NUMBER: {
        ZERO: 0,
        ONE: 1,
        TWO: 2,
        THREE: 3,
        MAX_RETRIES: 5,
        NAME_LENGTH: 50,
        DESCRIPTION_LENGTH: 90,
        BRAND_LENGTH: 120,
        MAX_VALUE: 1000,
        TIMEOUT_MS: 5000,
    },

    API: {
        USER_URL: environment.apiUserUrl,
        BASE_URL: environment.apiBaseUrl,
        CATEGORIES_ENDPOINT: '/categories',
        BRANDS_ENDPOINT: '/brands',
        ARTICLE_ENDPOINT: '/articles',
        LOGIN_ENDPOINT: '/auth/login',
        CUSTOMER_ENPOINT:  '/auth/register_customer',
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
        NAME: 'NAME',
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
        TYPE: 'Content-Type',
        JSON: 'application/json',
    },

    APP_TITLE: 'emazon',
}