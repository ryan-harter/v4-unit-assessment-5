const initialState = {
  username: '',
  profile_pic: ``
}

const UPDATE_USER = 'UPDATE_USER'
const LOGOUT = 'LOGOUT'

export function updateUser(userObj){
  return{
    type:UPDATE_USER,
    payload: userObj 
  }
}

export function logout(){
  return {
    type: LOGOUT,
  }
}


export default function reducer(state = initialState, action){
  
  //const {type, payload} = action;

  switch(action.type) {
    case UPDATE_USER:
      return {...state, username: action.payload.username, profile_pic: `https://robohash.org/${action.payload.username}.png`}
    case LOGOUT:
      return {...state, username: '', profile_pic: ``}
    default:
      return state;
  }
}