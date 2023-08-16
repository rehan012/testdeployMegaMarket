import axios from 'axios';
axios.defaults.withCredentials = true;

export const CHANGED_ITEM_IN_CART = 'CHANGED_ITEM_IN_CART';
export const CHANGE_ORDER_CART = 'CHANGE_ORDER_CART';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const SET_SHIP_ADDRESS = 'SET_SHIP_ADDRESS';
export const PLACE_ORDER = 'PLACE_ORDER';
export const EMPTY_CART = 'EMPTY_CART';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const INIT_PRODUCTS = 'INIT_PRODUCTS';
export const INIT_CART = 'INIT_CART';
export const INIT_USER = 'INIT_USER';

export const loginAC = (user,navigate)=>{
  return function(dispatch){
    axios.post('https://servermegamarket.onrender.com//login',{user}).then(function (response) {
        if(response.data.status){
          dispatch({type:INIT_USER, payload: response.data.user})
          dispatch(initializeCartAC(response.data.user._id));
          navigate('/');
        };
       
      })
      .catch(function (error) {
        console.log(error.response.data);
        alert('Incorrect Credentials');
      })  
}
}

export const checkAuthAC = (navigate)=>{
  return function(dispatch){
    axios.get('https://servermegamarket.onrender.com//user').then(function (response) {
      //console.log('auth',response.data);
        if(response.data.status){
          dispatch({type:INIT_USER, payload: response.data.user})
          dispatch(initializeCartAC(response.data.user._id));
          navigate('/');
        } else {
          navigate('/login');
        }
       
      })
      .catch(function (error) {
        console.log(error.response.data);
        navigate('/login');
      })  
}
}

export const signupAC = (user,navigate)=>{
  return function(dispatch){
    axios.post('https://servermegamarket.onrender.com//signup',{user}).then(function (response) {
      if(response.data.status){
        dispatch({type:INIT_USER, payload: response.data.user})
        dispatch(initializeCartAC(response.data.user._id));
        navigate('/');

      };
      })
      .catch(function (error) {
        console.log(error.response.data);
        alert('Username already exist');

      })  
}
}


export const logoutAC = (navigate)=>{
  return function(dispatch){
    axios.get('https://servermegamarket.onrender.com//logout').then(function (response) {
     //console.log('logoutAC');   
    if(response.data.status){
          dispatch({type:INIT_USER, payload: {}})
          navigate('/login');
        };
       
      })
      .catch(function (error) {
        console.log(error.response.data);
      })  
}
}

export const initializeProductsAC = () => {  //AC = Action Creator
    return function (dispatch) {
        axios.get("https://servermegamarket.onrender.com//product").then(function (response) {
            dispatch({ type: INIT_PRODUCTS, payload: response.data })
        }).catch(function (error) {
            console.log(error);
        })
    }

}

export const initializeCartAC = (userId) => {
    return function (dispatch) {
        axios.get('https://servermegamarket.onrender.com//cart').then(function (response) {
            //console.log(response.data);
            dispatch({ type: INIT_CART, payload: { items: response.data.items, userId: userId } })
        })
            .catch(function (error) {
                console.log(error);
            })
    }
}

// export const initializeUserAC = () => {
//     return function (dispatch) {
//         axios.get('https://servermegamarket.onrender.com//user').then(function (response) {
//             //console.log("Error is ", response.data)
//             dispatch({ type: INIT_USER, payload: response.data })
//             dispatch(initializeCartAC(response.data._id))
//         })
//             .catch(function (error) {
//                 console.log(error);
//             })
//     }
// }

export const addToCartAC = (item) => {  //AC = Action Creator
    return function (dispatch) {
        changeCart(dispatch, item)
    }
}

export const changeQuantityAC = (item) => {  //AC = Action Creator
    return function (dispatch) {
        changeCart(dispatch, item)

    }
}

export const changeCart = (dispatch, item) => {

    axios.post("https://servermegamarket.onrender.com//cart", { item: item }).then(function (response) {
        dispatch({ type: CHANGED_ITEM_IN_CART, payload: response.data })
    }).catch(function (error) {
        console.log(error);
    })

}

export const changeOrderWithCart = (cartItems) => {
    return function (dispatch) {
        dispatch({ type: CHANGE_ORDER_CART, payload: cartItems })
    }
}

export const addAddressAC = (address) => {  //AC = Action Creator
    return function (dispatch) {
        axios.post('https://servermegamarket.onrender.com//updateUserAddress', { address: address }).then(function (response) {
            //console.log(response);
            dispatch({ type: ADD_ADDRESS, payload: response.data })
        })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export const setShipAddressAC = (address) => {  //AC = Action Creator
    return function (dispatch) {
        dispatch({ type: SET_SHIP_ADDRESS, payload: address })
    }
}

export const placeOrderAC = (order,navigate) => {  //AC = Action Creator
    return function (dispatch) {
        axios.post('https://servermegamarket.onrender.com//order', { order: order }).then(function (response) {
            //console.log(response);
            dispatch({ type: PLACE_ORDER, payload: response.data })
            navigate('/ordersuccess/'+response.data._id);
          })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export const emptyCartAC = () => {  //AC = Action Creator
    return function (dispatch) {
        axios.post('https://servermegamarket.onrender.com//emptyCart').then(function (response) {
            //console.log(response);
            dispatch({ type: CHANGED_ITEM_IN_CART, payload: response.data })
        })
            .catch(function (error) {
                console.log(error);
            })
        // dispatch({type:EMPTY_CART,})
    }
}
export const removeItemAC = (item) => {  //AC = Action Creator
    return function (dispatch) {
        axios.post('https://servermegamarket.onrender.com//removeItem', { item: item }).then(function (response) {
            //console.log(response);
            dispatch({ type: CHANGED_ITEM_IN_CART, payload: response.data })
        })
            .catch(function (error) {
                console.log(error);
            })

        // dispatch({type:REMOVE_ITEM,payload:item})
    }
}
