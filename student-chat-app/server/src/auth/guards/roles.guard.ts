// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      // אם לא מוגדרות הרשאות, מתיר גישה
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // בודק אם תפקיד המשתמש נמצא ברשימת התפקידים המותרים
    return user && requiredRoles.includes(user.role);
  }
}
