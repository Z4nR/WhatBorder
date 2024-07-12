import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorator/role.decorator';
import { Role } from './enum/role.enum';
import { HelperService } from 'src/application/helper-service/helper.service';

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
    const role = await this.helperService.findByIdUser(request['user'].sub);

    const admin: string[] = [];
    role.admin ? admin.push('ADMIN') : admin.push('USER');

    return requiredRoles.some((role) => admin.includes(role));
  }
}
