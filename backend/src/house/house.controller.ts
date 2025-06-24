import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { HousesService } from './house.service';
import { Houses } from '../db/house.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth } from 'src/utils/auth.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from 'src/models/user.models';
import { Headers } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/db/user.entity';
import * as Joi from 'joi';
import { schemaHouse,schemaEditHouse } from 'src/Joi/houses.data';



@Controller('/house')
export class housesController {
  constructor(private readonly housesService: HousesService, private jwtService: JwtService) {}
  
  @UseGuards(AuthGuard)
  @Get('page/:pg')
  async index(@Auth() auth,@Param('pg') pg,@Headers() headers): Promise<Houses[]> {

    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      //console.log('decoded')

      const user = await User.findOne({where: {id}});
      //console.log(user)

    return this.housesService.findAll(user.role,id,pg);
  }  

  @UseGuards(AuthGuard)
  @Put('filter/:pg')
  async filter(@Param('pg') pg,@Headers() headers,@Body() filter:any): Promise<Houses[]> {

    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');

      const id = decoded.id;
      const user = await User.findOne({where: {id}});
//console.log('filter')
      let filters={};
      if('area' in filter)
        filters={...filters,area:filter.area}
      if('rental' in filter)
        filters={...filters,rental:filter.rental}
      if('rooms' in filter)
        filters={...filters,rooms:filter.rooms}
      if('floors' in filter)
        filters={...filters,floors:filter.floors}
        

    return this.housesService.filter(user.role,id,pg,filters);
  }

  @RoleGuard(ERole.A,ERole.M)
  @UseGuards(AuthGuard)
  @Get('myHouses/page/:pg')
  async myBikes(@Auth() auth,@Param('pg') pg,@Headers() headers): Promise<Houses[]> {

    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
      //console.log('user')
      //console.log(user)

    return this.housesService.myBikes(user.role,id,pg);
  }

  @RoleGuard(ERole.A,ERole.M)
  @UseGuards(AuthGuard)
  @Post('create')
    async create(@Body() HouseData: Houses,@Headers() headers): Promise<any> {
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;

      let houseDetails={
        address:HouseData.address.trim(),
        rental:HouseData.rental,
        area:HouseData.area,
        rooms:HouseData.rooms,
        floors:HouseData.floors,
        latitude:HouseData.latitude, 
        longitude:HouseData.longitude,
        managedBy:Number(id)
      }
      const result = schemaHouse.validate(houseDetails);

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }
      return this.housesService.create(houseDetails);
    }

    @RoleGuard(ERole.M,ERole.A)
    @UseGuards(AuthGuard)
    @Put(':id/updateDetails')
    async updateDetails(@Param('id') id, @Body() houseData: Houses,@Headers() headers): Promise<any> {

      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;
      const user = await User.findOne({where: {id:userId}})

      Object.keys(houseData).forEach((element)=>{
        ['address',
          'rental',
          'area',
          'rooms',
          'floors',
          'latitude',
          'longitude',
          'isAvailable'].indexOf(element)===-1?(delete houseData[element]):true
      })
      const result = schemaEditHouse.validate(houseData);

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

        houseData.id = Number(id);
        //console.log('Update #' + houseData.id)

        
        return this.housesService.update(houseData,id,userId,user.role);
    }

    @RoleGuard(ERole.A,ERole.M)
    @UseGuards(AuthGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id,@Headers() headers): Promise<any> {
     //console.log('reached')
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;
      const user = await User.findOne({where:{id:userId}})
//console.log('user')
//console.log(user)

     
      return this.housesService.delete(id,userId,user.role);
    }  

}