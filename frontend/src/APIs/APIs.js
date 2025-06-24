import axios from "axios";

const token=()=>{
return JSON.parse(localStorage.getItem('token')).jwt
}

export async function houses(pg=1){
  return await axios.get(`http://localhost:3001/house/page/${pg}`,{
    headers:{
      jwt: token()
    }
})
}


export async function myHouses(pg=1){
  return await axios.get(`http://localhost:3001/house/myHouses/page/${pg}`,{
    headers:{
      jwt: token()
    }
})
}

export async function allUsersApi(pg=1){
  return await axios.get(`http://localhost:3001/user/page/${pg}`,{
    headers:{
      jwt: token()
    }
})
}

export async function userApi(){
  return await axios.get("http://localhost:3001/user/verify",{
    headers:{
      jwt: token()
    }
})
}

export async function filterApi(pg,filter){
  return await axios.put(`http://localhost:3001/house/filter/${pg}`,{...filter},{
    headers:{
      jwt: token()
    }
})
}