import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from './enum/role.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorator/role.decorator';
import { AuthzService } from './authz.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authzService: AuthzService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request['user'].sub) {
      throw new ForbiddenException('User not authenticated');
    }

    const roleUser = await this.authzService.findUserRole(request['user'].sub);
    console.log('role user:', roleUser);

    if (roleUser === null || roleUser === undefined) {
      throw new ForbiddenException('Role tidak valid');
    }

    const userRoleNames = [roleUser.role_name];
    const hasRole = requiredRoles.some((r) => userRoleNames.includes(r));

    console.log('Required roles:', requiredRoles); // From decorator
    console.log('User roles from DB:', roleUser); // Raw DB
    console.log('Mapped codes:', userRoleNames); // After .map()

    if (!hasRole) {
      throw new ForbiddenException(
        `Maaf, akun anda dengan peran ${userRoleNames.join(', ')} tidak memiliki hak akses ini.`,
      );
    }

    return true;
  }
}
