import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Token } from '../utils/token-servise';
import { CryuptoServise } from '../utils/crypto';
import { OwnerModule } from '../admins/owner.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SuperAdmin } from '../admins/entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    OwnerModule,
    SequelizeModule.forFeature([SuperAdmin, User]),
    JwtModule.register({
      secret: String(process.env.JWT_ACCESS_KEY),
      signOptions: { expiresIn:'1d'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Token, CryuptoServise],
  exports: [Token],
})
export class AuthModule {}
