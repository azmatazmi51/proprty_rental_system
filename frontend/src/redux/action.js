import axios from 'axios'
import { allUsersApi, filterApi, houses, myHouses, userApi } from '../APIs/APIs'



export const fetchHouses =(pg=1) => {
    return (dispatch) => {
      if(JSON.parse(localStorage.getItem('token'))!==null){
      dispatch(fetchHousesRequest())
      

      
    async function fun(){
      try{
      let events=await houses(pg)
      // console.log(events)
      dispatch(fetchHousesSuccess(events.data[0]))
          dispatch(fetchTotalPages(events.data[1]))
          dispatch(fetchChangedPage(pg)) 
      }
      catch(error){
        dispatch(fetchHousesFailure(error.message))
      }
    }
    fun()    
    }
  }
}

  export const fetchMyHouses =(pg=1) => {

    return (dispatch) => {
      if(JSON.parse(localStorage.getItem('token'))!==null){
      dispatch(fetchHousesRequest())

      async function fun(){
        try{
        let events=await myHouses(pg)
        dispatch(fetchHousesSuccess(events.data[0]))
            dispatch(fetchTotalPages(events.data[1]))
            dispatch(fetchChangedPage(pg)) 
      }
      catch(error){
        dispatch(fetchHousesFailure(error.message))
       }
    }
    fun()   
    }
  }
}


  export const fetchAllUsers =(pg=1) => {
    return (dispatch) => {
    if(JSON.parse(localStorage.getItem('token'))!==null)
    {
      dispatch(fetchAllUsersRequest())

      async function fun(){
        try{
        let events=await allUsersApi(pg)
        dispatch(fetchAllUsersSuccess(events.data[0]))
        dispatch(fetchUserPagesSuccess(events.data[1])) 
      }
      catch(error){
        dispatch(fetchAllUsersFailure(error.message))
      }
    }
    fun()   
    }
  }
  }

  export const fetchUser =() => {
    return (dispatch) => {
      if(localStorage.getItem('token') && localStorage.getItem('token')!==null){
      dispatch(fetchUserRequest())

      async function fun(){
        try{
        let events=await userApi()
        dispatch(fetchUserSuccess(events.data.result))
      }
      catch(error){
        dispatch(fetchUserFailure(error.message))
      }
    }
    fun()    
      }
        else{
          dispatch(fetchUserFailure('Not sighned in'))
        }
    }
  }

  export const fetchFilteredHouses =(filter,pg=1) => {

    return (dispatch) => {
      dispatch(fetchHousesRequest())

      async function fun(){
        try{
        let events=await filterApi(pg,filter)
        dispatch(fetchIsFilterSet(true))
          dispatch(fetchHousesSuccess(events.data[0]))
          dispatch(fetchTotalPages(events.data[1]))
          dispatch(fetchChangedPage(pg))
      }
      catch(error){
        dispatch(fetchHousesFailure(error.message))
      }
    }
    fun() 
      }}
       

export const fetchHousesRequest = () => {
    return {
        type: 'FETCH_HOUSES_REQUEST'
    }
}

export const fetchAllUsersRequest = () => {
  return {
      type: 'FETCH_ALL_USERS_REQUEST'
  }
}


export const fetchUserRequest = () => {
    return {
        type: 'FETCH_USER_REQUEST'
    }
}

export const fetchHousesSuccess = events => {
    return {
      type: 'FETCH_HOUSES_SUCCESS',
      payload: events
    }
}

export const fetchFilters = events => {
  return {
    type: 'FETCH_FILTERS',
    payload: events
  }
}


export const fetchIsFilterSet = (events) => {
  return {
      type: 'FETCH_IS_FILTER_SET',
      payload: events
  }
}
export const fetchTotalPages = events => {
  return {
    type: 'FETCH_TOTAL_PAGES',
    payload: events
  }
} 


export const fetchAllUsersSuccess = events => {
  return {
    type: 'FETCH_ALL_USERS_SUCCESS',
    payload: events
  }
}
export const fetchUserSuccess = events => {
    return {
      type: 'FETCH_USER_SUCCESS',
      payload: events
    }
}
export const fetchUserPagesSuccess = events => {
  return {
    type: 'FETCH_USER_PAGES_SUCCESS',
    payload: events
  }
}
export const fetchChangedPage = page => {
  return {
    type: 'FETCH_PAGE_CHANGE_REQUEST',
    payload: page
  }
}
export const fetchHousesFailure = error => {
    return {
      type: 'FETCH_HOUSES_FAILURE',
      payload: error
    }
}



export const fetchAllUsersFailure = error => {
  return {
    type: 'FETCH_ALL_USERS_FAILURE',
    payload: error
  }
}

export const fetchUserFailure = error => {
    return {
      type: 'FETCH_USER_FAILURE',
      payload: error
    }
}
