import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,  
      [context.getHandler(), context.getClass()],
    );

    // console.log('accepted');
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required => open access
    }

    const { user } = context.switchToHttp().getRequest();

    // Ensure the user is authenticated and has a role
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
