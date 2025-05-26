import { RolesGuard } from './authz.guard';

describe('AuthzGuard', () => {
  it('should be defined', () => {
    expect(new RolesGuard()).toBeDefined();
  });
});
