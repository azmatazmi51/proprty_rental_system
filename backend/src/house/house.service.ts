import { BadRequestException, HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Houses } from '../db/house.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import { User } from 'src/db/user.entity';


@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(Houses)
    private housesRepository: Repository<Houses>,
) { }

  async  findAll(userRole:any,id:any,pg:any):Promise<any>{
  let tempBikes= await this.housesRepository.find();
  if(userRole==='regular')
  {
    let ans=tempBikes.filter((element)=>{
      return element.isAvailable===true;
    })
    return [ans.slice((pg-1)*7,(pg-1)*7+7),Math.floor((ans.length-1)/7+1)]
  }
  else if(userRole==='manager')
  {
    let ans=tempBikes.filter((element)=>{
      return element.managedBy==id || element.isAvailable===true;
    })
    return [ans.slice((pg-1)*7,(pg-1)*7+7),Math.floor((ans.length-1)/7+1)]
  }
    else return [tempBikes.slice((pg-1)*7,(pg-1)*7+7),Math.floor((tempBikes.length-1)/7+1)];
  }

  async  filter(userRole:any,id:any,pg:any,filters:any):Promise<any>{

    let tempBikes= await this.housesRepository.find();
    let ans;
    if(userRole==='regular')
    {
      ans=tempBikes.filter((element)=>{
        return (element.isAvailable===true);
      })
      
    }
    else if(userRole==='manager')
    {
      ans=tempBikes.filter((element)=>{
        return element.managedBy==id || element.isAvailable===true;
      })
      
    }
    else ans=tempBikes;

    ans=ans.filter((element)=>{
      return ('area' in filters?(element.area>=filters.area):true && 'rental' in filters?(element.rental>=filters.rental):true && 'rooms' in filters?(element.rooms>=filters.rooms):true && 'floors' in filters?(element.floors>=filters.floors):true) 
    })

      return [ans.slice((pg-1)*7,(pg-1)*7+7),Math.floor((ans.length-1)/7+1)]
    }

  async  myBikes(userRole:any,id:any,pg:any):Promise<any>{
    let tempBikes= await this.housesRepository.find();
   //console.log('mybikes')
   //console.log(tempBikes)

      let ans=tempBikes.filter((element)=>{
        return element.managedBy==id;
      })
   //console.log(ans)

      return [ans.slice((pg-1)*7,(pg-1)*7+7),Math.floor((ans.length-1)/7+1)]
    
    }

  async  create(bike: any): Promise<Houses> {    
    return await this.housesRepository.save(bike);
}

async update(house: Houses,id:any,userId:any,role:any): Promise<UpdateResult> {

  const houseExist:any = await this.housesRepository.findOne({where:{id}});

  
  if(!houseExist)
  {
    //console.log(house)
    throw new BadRequestException("house doesn't  exist")
  }

  if(role==='admin')
    return await this.housesRepository.update(house.id, house);
  else if(role==='manager')
  {
    if(houseExist.managedBy!=userId)
    {
      throw new BadRequestException("House doesn't  belong to user")
    }
    else{
      return await this.housesRepository.update(house.id, house);
    }
  }
  }

  async delete(id: any,userId:any,userRole:any): Promise<DeleteResult> {
    const house:any = await this.housesRepository.findOne({where:{id}});
  
    //console.log('hoouse')
  
    //console.log(house)
  
    if(!house)
    {
      //console.log(house)
      throw new BadRequestException("Bike doesn't  exist")
    }

    if(userRole==='admin')
    {//console.log(';wewewe')
      return await this.housesRepository.delete(id);
    }
    else if(userRole==='manager')
    {
      if(house.managedBy==userId)
      {
        return await this.housesRepository.delete(id);
      }
      else{
        throw new BadRequestException("House doesn't belong to user")
      }
    }
  }
}