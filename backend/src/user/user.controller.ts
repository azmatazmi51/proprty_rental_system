import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../db/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { request } from 'http';
import JwtUtil from 'src/utils/jwt.util';
import { AuthGuard } from 'src/guards/auth.guard';
import { ERole } from 'src/models/user.models';
import { RoleGuard } from 'src/guards/role.guard';
import { Headers } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';
import { schemaRegister,schemaLogin,schemaCreate,schemaEditFields } from 'src/Joi/user.data';


@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}
  
  @RoleGuard(ERole.A)
  @UseGuards(AuthGuard)
  @Get('page/:pg')
  index(@Param() pg:any): Promise<User[]> {
    //console.log('ageg');
    //console.log(pg);

    return this.userService.findAll(pg.pg);
  } 
  
  @Post('register')
    async register(@Body() userData: User): Promise<any> {
      let {name,email,password,role} =userData;

      name=name.trim()
      email=email.trim().toLowerCase()
      
      
      const result = schemaRegister.validate({name:name,email:email,password:password,role:role});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

      const hashedPassword= await bcrypt.hash(password,12)

      return this.userService.create({
        name:name,
        email:email,
        role:role, 
        password:hashedPassword
      });
    }
  
    @RoleGuard(ERole.A)
    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Body() userData: User): Promise<any> {
      let {name,email,password,role} =userData;

      name=name.trim()
      email=email.trim().toLowerCase()
      
      //console.log(userData)
      const result = schemaCreate.validate({name:name,email:email,password:password,role:role});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

      const hashedPassword= await bcrypt.hash(password,12)

      return this.userService.create({
        name:name,
        email:email,
        role:role, 
        password:hashedPassword
      });
    }

  @Post('login')
    async userLogin(@Body() userData:User,
    @Res({passthrough:true}) response:Response)
    {

      let {email,password} =userData;

      email=email.trim().toLowerCase();
      

      const result = schemaLogin.validate({email:email,password:password})

        
        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message)
        }

        const user=await  this.userService.userLogin({email});

        if(!user || !await bcrypt.compare(password,user.password))
        {
            throw new BadRequestException('invalid credentials')
        }

        const token = JwtUtil.getJwtToken(user)
      
      return {    
        jwt: token
      };
    }

    @UseGuards(AuthGuard)
  @Get('verify')
    async user(@Headers() headers) {
      // //console.log('headers')

      //console.log(headers)
      try{
        const token = headers.jwt;
        const decoded:any = jwt.verify(token,'secret');
        const id = decoded.id;
        const user = await User.findOne({where: {id}});
        //console.log(user)
        if(user){
            const {password, ...result} = user;

          return {result};
        }
      }
      catch(e){
        throw new UnauthorizedException();
      }
    }

    @RoleGuard(ERole.A)
    @UseGuards(AuthGuard)
    @Put(':id/update')
    async update(@Param('id') id, @Body() userData: User): Promise<any> {
        
        
        if(!userData.name && !userData.email && !userData.role)
        {
          throw new BadRequestException('Invalid edit fields')
        }
        let editData={};


        if(userData.name!==undefined)
        {
          editData={...editData,name:userData.name.trim()}
        }
        if(userData.email!==undefined)
        {
          editData={...editData,email:userData.email.toLowerCase().trim()}
        }
        if(userData.role!==undefined)
        {
          editData={...editData,role:userData.role}
        }
 
        
        const result = schemaEditFields.validate(editData)

        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message)
        }
        editData={...editData,id:Number(id)}
      

        return this.userService.update(editData);
    }

    @RoleGuard(ERole.A)
    @UseGuards(AuthGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.userService.delete(id);
    }  
}