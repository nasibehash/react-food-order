import Modal from './UI/Modal.jsx';
import { useContext } from 'react';
import CartContext from '../store/CartContext.jsx';
import { currentFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';

export default function Checkout () {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce(( totalPrice, item ) =>
    totalPrice + item.quantity * item.price, 0);

  function handleCloseCart () {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit ( event ) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
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

  return <Modal
    onClose={handleCloseCart}
    open={userProgressCtx.progress === 'checkout'}>
    <form onSubmit={handleSubmit}>
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
      <p className="modal-actions">
        <Button type="button" textOnly onClick={handleCloseCart}>Close</Button>
        <Button>Submit Order</Button>
      </p>
    </form>
  </Modal>;
}