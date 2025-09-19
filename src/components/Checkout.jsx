import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgessContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import { useActionState } from "react";

const requestConfig = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const { data, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig);

    const cartTotals = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

    function handleClose() {
        userProgressCtx.hideCheckout()
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData(); // this will clear data after success modal close
    }

    async function checkoutAction(prevState, fd) { // async adding here will not make a difference because we are not checking status of the form

        // event.preventDefault(); // <form onSubmit= ... >
        // const fd = new FormData(event.target);
        // const customerData = Object.fromEntries(fd.entries()) 
        // { email:test@example.com, key with value will come with fd.entries() }

        // <form action = .... >
        const customerData = Object.fromEntries(fd.entries())


        await sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        )

        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        });
    }

    const [formState, formAction, isSending] = useActionState(checkoutAction, null);


    let actions = (
        <>
            <Button textOnly onClick={handleClose}>Close</Button>
            <Button>Submit Order</Button>
        </>
    );

    if (isSending) { // earlier this isSending was referring from cartContext isLoading
        actions = <span>Sending order data...</span>
        // not needed pending now because we are awaiting submit action handler now
    }

    if (data && !error) {
        return (
            <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
                <h2>Success!</h2>
                <p>Your order was submitted successfully.</p>
                <p>We will get back to you with more details via email within the next few minutes.</p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Okay</Button>
                </p>
            </Modal>
        );
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form action={formAction}>
            <h2>Checkout</h2>
            <p>Total Amount : {currencyFormatter.format(cartTotals)}</p>

            <Input label="Full Name" type="text" id="name" />
            <Input label="E-Mail Address" type="email" id="email" />
            <Input label="Street" type="text" id="street" />
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code" />
                <Input label="City" type="text" id="city" />
            </div>

            {error && <Error title="Failed to submit order" message={error} />}
            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}