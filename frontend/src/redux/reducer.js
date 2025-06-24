const initialState = {
    loading: false,
    userLoading:false,
    housePagesLoading:false,
    houses: [],
    allUsers:[],
    error: '',
    usersError:'',
    user:[],
    userError:'',
    housePagesError:'',
    totalPages:1,
    currentHousePage:1,
    userPage:1,
    filterSet:false,
    filter:[]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_HOUSES_REQUEST':
        return {
          ...state,
          loading: true
        }
        case 'FETCH_PAGE_CHANGE_REQUEST':
          return {
            ...state,
            currentHousePage:action.payload
          }
      case 'FETCH_ALL_USERS_REQUEST':
        return {
          ...state,
          loading: true
        }
      case 'FETCH_HOUSES_SUCCESS':
        return {
          ...state,
          loading: false,
          houses: action.payload,
          error: ''
        }
        case 'FETCH_IS_FILTER_SET':
          return {
            ...state,
            filterSet: action.payload,
          }
        case 'FETCH_TOTAL_PAGES':
          return {
            ...state,
            totalPages:action.payload
          }
          case 'FETCH_FILTERS':
            return {
              ...state,
              filter:action.payload
            }
        case 'FETCH_USER_REQUEST':
          return {
            ...state,
            userLoading: true,
          }
        case 'FETCH_USER_SUCCESS':
          return {
            ...state,
            userLoading: false,
            user: action.payload,
            userError: ''
          }
          case 'FETCH_USER_PAGES_SUCCESS':
          return {
            ...state,
            userPage: action.payload,
          }
          case 'FETCH_ALL_USERS_SUCCESS':
            return {
              ...state,
              loading: false,
              allUsers: action.payload,
              usersError: ''
            }
        case 'FETCH_HOUSES_FAILURE':
          return {
            loading: false,
            error: action.payload,
            user:[]
          }
        case 'FETCH_USER_FAILURE':
          return {
            userLoading: false,
            userError: action.payload,
            user:[]
          }
          case 'FETCH_ALL_USERS_FAILURE':
            return {
              loading: false,
              usersError: action.payload,
              user:[]
            }
      default: return state
    }
}

export default reducer
