import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Houses } from 'src/db/house.entity';
import { HousesService } from 'src/house/house.service';
import { housesController } from 'src/house/house.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Houses]),
    JwtModule.register({
        secret:'secret',
        signOptions:{expiresIn:'1d'}
    })
  ],
  providers: [UserService,HousesService],
  controllers: [UserController,housesController]
})
export class UserModule {}