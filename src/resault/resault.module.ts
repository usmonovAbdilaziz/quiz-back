import { Module } from '@nestjs/common';
import { ResaultService } from './resault.service';
import { ResaultController } from './resault.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Result } from './entities/resault.entity';
import { UsersModule } from '../users/users.module';
import { QuizModule } from '../test/test.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Result]),UsersModule,QuizModule,AuthModule],
  controllers: [ResaultController],
  providers: [ResaultService],
  exports:[ResaultService]
})
export class ResaultModule {}
