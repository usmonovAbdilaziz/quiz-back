import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user && (user.role === 'admin' || user.role === 'teacher')) {
      return true;
    }
    throw new ForbiddenException("Sizda ruxsat yo'q");
  }
}
