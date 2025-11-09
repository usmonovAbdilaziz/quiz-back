import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Token } from 'src/utils/token-servise';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: Token) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException("Token yo'q");
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await this.tokenService.verifyToken(
        token,
        process.env.JWT_SECRET || '1111',
      );
      req.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException("Token noto'g'ri");
    }
  }
}
