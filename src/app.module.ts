import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SuperAdmin } from './admins/entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { QuizModule } from './test/test.module';
import { Quiz } from './test/entities/test.entity';
import { ResaultModule } from './resault/resault.module';
import { Result } from './resault/entities/resault.entity';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_DATABASE as string,
      autoLoadModels: true,
      synchronize: true,
      models: [SuperAdmin, User, Quiz, Result],
      logging: false,
    }),
    SequelizeModule.forFeature([SuperAdmin]),
    UsersModule,
    QuizModule,
    ResaultModule,
    AuthModule,
    ExamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
