import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Cart from '../components/cart';
import { changeOrderWithCart, changeQuantityAC, removeItemAC } from '../action';
import { useEffect } from 'react';



function CartPage() {

    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const order = useSelector(state => state.order);

    useEffect(() => {

        dispatch(changeOrderWithCart(cartItems));

    }, [cartItems])

    const changeQuantity = (quantity, item) => {
        dispatch(changeQuantityAC({...item, quantity: quantity}));
    }

    const removeItem = (item) => {
        dispatch(removeItemAC(item));
    }

   


return (
    <div>
        <Navbar cartCount={cartItems.length} />
        <Cart items={cartItems} order={order} changeQuantity={changeQuantity} removeItem={removeItem} />
        <Footer />

    </div>
);
}

export default CartPage;