import { useContext } from 'react'
import logoImg from '../assets/logo.jpg'
import Button from './UI/Button'
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgessContext';

export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity
    }, 0); // we have to show total elements not the length

    function handleShowCart() {
        userProgressCtx.showCart();
    }

    return (
        <header id="main-header" >
            <div id="title">
                <img src={logoImg} alt="react food" />
                <h1>REACTFOOD</h1>
            </div>
            <nav>
                <Button textOnly onClick={() => handleShowCart()}>
                    CART ({totalCartItems})
                </Button>
            </nav>
        </header>
    )
}