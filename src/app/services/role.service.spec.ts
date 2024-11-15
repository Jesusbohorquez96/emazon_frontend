import { TestBed } from '@angular/core/testing';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleService],
    });

    service = TestBed.inject(RoleService);
    localStorage.clear();
  });

  describe('getUserRoleFromToken', () => {
    it('should return the role from a valid token', () => {
      const mockToken = createMockToken({ rol: 'admin' });
      localStorage.setItem('authToken', mockToken);

      expect(service.getUserRole());
    });

    it('should return an empty string if the token is missing', () => {
      localStorage.removeItem('authToken');

      expect(service.getUserRole());
    });

    it('should return an empty string if the token is invalid', () => {
      localStorage.setItem('authToken', 'invalid.token');

      expect(service.getUserRole()).toBe('');
    });
  });

  describe('getUserRole', () => {
    it('should return the currently set user role', () => {
      service['setUserRole']('customer');

      expect(service.getUserRole()).toBe('customer');
    });
  });

  describe('isComponentVisible', () => {
    it('should return true if the component is visible for the admin role', () => {
      service['setUserRole']('admin');

      expect(service.isComponentVisible('createForm')).toBe(true);
      expect(service.isComponentVisible('listForm')).toBe(true);
      expect(service.isComponentVisible('registroForm')).toBe(true);
    });

    it('should return false if the component is not visible for the current role', () => {
      service['setUserRole']('aux_bodega');

      expect(service.isComponentVisible('registroForm')).toBe(false);
    });

    it('should return true if the component is visible for the aux_bodega role', () => {
      service['setUserRole']('aux_bodega');

      expect(service.isComponentVisible('listForm')).toBe(true);
      expect(service.isComponentVisible('updateForm')).toBe(true);
      expect(service.isComponentVisible('cartFrom')).toBe(true);
    });

    it('should return false if the component is not visible for the customer role', () => {
      service['setUserRole']('customer');

      expect(service.isComponentVisible('createForm')).toBe(false);
    });
  });

  describe('updateUserRole', () => {
    it('should update the role based on the current token', () => {
      const mockToken = createMockToken({ rol: 'customer' });
      localStorage.setItem('authToken', mockToken);

      service.updateUserRole();

      expect(service.getUserRole()).toBe('customer');
    });

    it('should set an empty role if the token is missing', () => {
      localStorage.removeItem('authToken');

      service.updateUserRole();

      expect(service.getUserRole()).toBe('');
    });
  });

  function createMockToken(payload: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    return `${headerBase64}.${payloadBase64}.signature`;
  }
});
