import { Injectable, NotFoundException } from '@nestjs/common';
import { loginDto } from './dto/login-auth.dto';
import { handleError, successMessage } from '../utils/global-response';
import { SuperAdmin } from '../admins/entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { CryuptoServise } from 'src/utils/crypto';
import { Token } from 'src/utils/token-servise';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SuperAdmin) private readonly adminModel: typeof SuperAdmin,
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly crypto:CryuptoServise,
    private readonly tokenService: Token
  ){}
  async login(loginAuthDto: loginDto) {
    try {
      const { email, password } = loginAuthDto;
      const admin = await this.adminModel.findOne({ where: { email } });
      if(admin){
        const data =admin.dataValues as any
        const pass = await this.crypto.decrypt(
          password,
          data.password,
        );
        if(!pass){
          throw new NotFoundException('Invalid password');
        }
        const payload ={
          id: data.id,
          email: data.email,
          role: 'admin',
        }
        const accessToken = await this.tokenService.generateAccesToken(payload);
       
        return {data,token:accessToken}
      }
      const user = await this.userModel.findOne({ where: { email } });
      if(user){
        const data =user.dataValues as any
        const pass = await this.crypto.decrypt(
          password,
          data.password,
        );
        if(!pass){
          throw new NotFoundException('Invalid password');
        }
        const payload ={
          id: data.id,
          email: data.email,
          role: 'teacher',
        }
        const accessToken = await this.tokenService.generateAccesToken(payload);
       
        return {data,token:accessToken}
      }
      return{
        message: 'Ruxsat etilmagan foydalanuvchi',
        statusCode: 409,
      }
    } catch (error) {
      handleError(error)
    }
  }
}
