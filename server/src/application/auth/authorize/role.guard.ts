import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HelperService } from 'src/application/helper-service/helper.service';
import { Role } from './enum/role.enum';
import { ROLES_KEY } from './decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly helperService: HelperService,
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
    const roleUser = await this.helperService.findByIdUser(request['user'].sub);

    const role: string[] = [];
    switch (roleUser.role_code) {
      case 3:
        role.push(Role.USER);
        break;
      case 2:
        role.push(Role.ADMIN);
        break;
      case 1:
        role.push(Role.SUPER);
        break;
      default:
        role.push(Role.OWNER);
        break;
    }
    console.log('role saat ini :', roleUser);

    return requiredRoles.some((roleUser) => role.includes(roleUser));
  }
}
