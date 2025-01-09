import Modal from './UI/Modal.jsx';
import { useContext, useActionState } from 'react';
import CartContext from '../store/CartContext.jsx';
import { currentFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};
export default function Checkout () {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const {data, isLoading, error, sendRequest, clearData} =
    useHttp('http://localhost:3000/orders', requestConfig, []);

  const cartTotal = cartCtx.items.reduce(( totalPrice, item ) =>
    totalPrice + item.quantity * item.price, 0);

  function handleCloseCart () {
    userProgressCtx.hideCheckout();
  }

  function handleFinish () {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  async function checkoutAction ( prevState, fd ) {
    const customerData = Object.fromEntries(fd.entries());

    await sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData
        }
      })
    );
    if (data && !error) {
      return <Modal open={userProgressCtx.progress === 'checkout'}
                    onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted</p>
        <p className="modal-actions">
          <Button onClick={handleCloseCart}>Okey</Button>
        </p>
      </Modal>;
    }
    // fetch('http://localhost:3000/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     order: {
    //       items: cartCtx.items,
    //       customer: customerData
    //     }
    //   })
    // });
  }

  const [ formState, formAction, pending ] = useActionState(checkoutAction, null);
  let actions = (
    <>
      <Button type="button" textOnly onClick={handleCloseCart}>Close</Button>
      <Button>Submit Order</Button></>
  );
  if (pending) {
    actions = <span>Sending orders data</span>;
  }

  return <Modal
    onClose={handleCloseCart}
    open={userProgressCtx.progress === 'checkout'}>
    <form action={formAction}>
      <h2>Checkout</h2>
      <p>
        Total Amount: {currentFormatter.format(cartTotal)}
      </p>
      <Input label="Full Name" type="text" id="full-name"/>
      <Input label="Email Address" type="email" id="email-address"/>
      <Input label="Street Address" type="text" id="street"/>
      <div className="control-row">
        <Input label="Postal Code" type="text" id="postal-code"/>
        <Input label="city" type="text" id="city"/>
      </div>
      {error && <Error title="failed to submit error" message={error}/>}
      <p className="modal-actions">
        {actions}
      </p>
    </form>
  </Modal>;
}