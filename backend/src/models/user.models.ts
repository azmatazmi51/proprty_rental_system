// Interfaces

export enum ERole {
  M = 'manager',
  A = 'admin',
  R='regular'
}

export interface IUser{
  name: string;
  email: string;
  password: string;
  role:string;
  id: number;
  reserved: string;
  manages: string;

}

