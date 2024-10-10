import { APP_CONSTANTS } from 'src/styles/constants'; 

describe('APP_CONSTANTS', () => {

  it('should have the correct value for FULL', () => {
    expect(APP_CONSTANTS.FULL).toBe('full');
  });

  it('should have the correct API endpoints', () => {
    expect(APP_CONSTANTS.API.BASE_URL).toBe('http://localhost:8080'); 
    expect(APP_CONSTANTS.API.CATEGORIES_ENDPOINT).toBe('/categories');
    expect(APP_CONSTANTS.API.BRANDS_ENDPOINT).toBe('/brands');
  });

  it('should have correct PAGINATION constants', () => {
    expect(APP_CONSTANTS.PAGINATION.ZERO).toBe(0);
    expect(APP_CONSTANTS.PAGINATION.ASC).toBe('ASC');
    expect(APP_CONSTANTS.PAGINATION.DESC).toBe('DESC');
    expect(APP_CONSTANTS.PAGINATION.PAGE).toBe('page');
    expect(APP_CONSTANTS.PAGINATION.SORT_BY).toBe('sortBy');
  });

  it('should generate the correct pagination message', () => {
    const newPage = 3;
    const expectedMessage = `Página cambiada a: ${newPage}`;
    expect(APP_CONSTANTS.PAGINATION.PAGE_CHANGE_MESSAGE(newPage)).toBe(expectedMessage);
  });

  it('should have the correct NO_NAVBAR value', () => {
    expect(APP_CONSTANTS.NO_NAVBAR).toBe('no-navbar');
  });

  it('should have correct APP_TITLE', () => {
    expect(APP_CONSTANTS.APP_TITLE).toBe('emazon');
  });

  it('should have correct HIDE_NAVBAR_ROUTES', () => {
    expect(APP_CONSTANTS.HIDE_NAVBAR_ROUTES).toEqual(['/login', '/register', '/other-page']);
  });

  it('should have the correct NAME and DESCRIPTION length constraints', () => {
    expect(APP_CONSTANTS.NUMBER.NAME_LENGTH).toBe(50);
    expect(APP_CONSTANTS.NUMBER.DESCRIPTION_LENGTH).toBe(120);
  });

  it('should have the correct SAVE headers', () => {
    expect(APP_CONSTANTS.SAVE.TYPE).toBe('Content-Type');
    expect(APP_CONSTANTS.SAVE.JSON).toBe('application/json');
  });
});
