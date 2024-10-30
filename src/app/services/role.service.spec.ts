import { TestBed } from '@angular/core/testing';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserRoleFromToken', () => {
    afterEach(() => {
      localStorage.removeItem('authToken'); 
    });

    it('should return the correct role when token is valid', () => {
      const payload = { rol: 'admin' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('authToken', token);

      const role = service.getUserRoleFromToken();
      expect(role).toBe('admin');
    });

    it('should return an empty string if no token is present', () => {
      localStorage.removeItem('authToken'); 
      const role = service.getUserRoleFromToken();
      expect(role).toBe('');
    });

    it('should return an empty string if token is malformed', () => {
      const invalidToken = 'invalidToken';
      localStorage.setItem('authToken', invalidToken);

      const role = service.getUserRoleFromToken();
      expect(role).toBe('');
    });

    it('should return an empty string if token payload does not contain "rol" field', () => {
      const payload = { otherField: 'test' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('authToken', token);

      const role = service.getUserRoleFromToken();
      expect(role).toBe('');
    });

    it('should handle JSON parse errors gracefully and return an empty string', () => {
      const invalidPayloadToken = `header.${btoa('invalidJsonPayload')}.signature`;
      localStorage.setItem('authToken', invalidPayloadToken);

      const role = service.getUserRoleFromToken();
      expect(role).toBe('');
    });
  });

  describe('setUserRole and isComponentVisible', () => {
    it('should set the user role correctly and check component visibility', () => {
      service.setUserRole('admin');
      expect(service.isComponentVisible('createForm')).toBe(true);
      expect(service.isComponentVisible('listForm')).toBe(true);
      expect(service.isComponentVisible('registroForm')).toBe(true);
    });

    it('should return false for components not visible to the role', () => {
      service.setUserRole('customer');
      expect(service.isComponentVisible('createForm')).toBe(false);
      expect(service.isComponentVisible('registroForm')).toBe(false);
    });
  });
});
