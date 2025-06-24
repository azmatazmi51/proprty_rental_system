import { HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/user.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import Joi from 'joi';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
) { }


  async  findAll(pg:any): Promise<any> {
    const Users= await this.userRepository.find();
    let len=Math.floor((Users.length-1)/7+1)
    //console.log('pg')

    // //console.log(pg)
    // let po=[1,2,3,4,5,6,7,8,9,0]
    // let ab=pg;
    // //console.log(po.slice((pg-1)*7,(pg-1)*7+7))
    return [Users.splice((pg-1)*7,7),len];
  }

  async  create(user: User | any): Promise<User> {
  
    const newUser= await this.userRepository.findOne({where: {email:user.email}});

    if(newUser)
    {
       throw new HttpException('User already registered',400)
    }
    else {
      return await this.userRepository.save(user);
    }
  }

  async userLogin({ email}:{ email: string;}):Promise<User> {
    const user= await this.userRepository.findOne({where: {email:email}});
  
    if(!user)
    {
      throw new HttpException('invalid credetials',400)
    }
    else {
      return user
    }
  }

  async update(user: any): Promise<UpdateResult>{
    if(user.email!==undefined)
    {
      const userExist=await this.userRepository.findOne({where:{email:user.email}});

      if(userExist)
      {
      throw new HttpException('Email already exists',400)
      }
    }
    //console.log('uop')
    //console.log(user)

      return await this.userRepository.update(user.id, user);
  }
  
  async delete(id: string | number| FindOptionsWhere<User>): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}