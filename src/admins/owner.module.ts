import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SuperAdmin } from './entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([SuperAdmin]), forwardRef(() => AuthModule)],
  exports: [SequelizeModule],
})
export class OwnerModule {}
