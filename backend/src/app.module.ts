import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule,TypeOrmModule.forRoot({
    type :"sqlite",
    database: "houseDB",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true
  }),JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '1d'}
})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
