import { ADD_ADDRESS, CHANGE_ORDER_CART, CHANGED_ITEM_IN_CART, INIT_CART, INIT_USER,INIT_USER_ORDERS, INIT_PRODUCTS, PLACE_ORDER, SET_SHIP_ADDRESS } from "../action";



const initailStateProduct = {
  products: []
}

const initailStateCart = {
  items: [],
  userId : ''
}

const initailStateOrder = {
  items: [],
  shipping_charges: 50,
  discount_in_percent: 10,
  shipping_address: '',
  total_items: 0,
  total_cost: 0,

}

const initialStateUser = {
}


const productReducer = (state = initailStateProduct, action) => {
  switch (action.type) {

    case INIT_PRODUCTS:
      return { ...state, products: action.payload }

    default:
      return state;
  }
}

const cartReducer = (state = initailStateCart, action) => {
  switch (action.type) {

    case INIT_CART:
      return { ...state, items: action.payload.items, userId : action.payload.userId }

    case CHANGED_ITEM_IN_CART:
      return {
        ...state,
        items: action.payload.items
      }

    default: return state;
  }
}

const orderReducer = (state = initailStateOrder, action) => {
  switch (action.type) {

      case CHANGE_ORDER_CART:
      const items = action.payload;
      const total_items = items.reduce(
        (total, item) => total + item.quantity * 1,
        0
      );
      const total_cost = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return { ...state, items: action.payload, total_items, total_cost };

    case SET_SHIP_ADDRESS:

      return { ...state, shipping_address: action.payload };

    default: return state;
  }
}


const userReducer = (state = initialStateUser, action) => {

  switch (action.type) {

    case INIT_USER_ORDERS:
      return action.payload;

    case INIT_USER:
      return action.payload

    case ADD_ADDRESS:
      return { ...state, addresses: [...state.addresses, action.payload] }

    case PLACE_ORDER:

      return { ...state, orders: [...state.orders, action.payload] };

    default: return state;
  }
}


export { productReducer, cartReducer, orderReducer, userReducer };