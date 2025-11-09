import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Token {
  constructor(private jwtService: JwtService) {}

  async generateAccesToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_KEY,
      expiresIn: '1d',
    });
  }

   async verifyToken(token: any, secretKey: string) {
    return this.jwtService.verify(token, {
      secret: secretKey,
    });
  }
}
