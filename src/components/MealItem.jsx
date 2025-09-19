import { useContext } from "react"
import { currencyFormatter } from "../util/formatting"
import CartContext from "../store/CartContext";

export default function Meal({ meal }) {
    const cartCtx = useContext(CartContext); // accessing value of the context

    function handleAddMealToCart() {
        console.log(meal)
        cartCtx.addItem(meal)
    }

    return (
        <li className='meal-item'>
            <article>
                <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
                <div>
                    <h3>{meal.name}</h3>
                    <p className='meal-item-price'>
                        {currencyFormatter.format(meal.price)}
                    </p>
                    <p className="meal-item-description">{meal.description}</p>
                </div>
                <p>
                    <button className='button meal-item-actions' onClick={handleAddMealToCart}>
                        Add to Cart
                    </button>
                </p>
            </article>
        </li>
    )
}