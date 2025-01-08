import { currentFormatter } from '../util/formatting.js';

export default function CartItem ( {name, quantity, price, onDecrease, onIncrease} ) {

  return <li className="cart-item">
    <p>
      {name} -{quantity} * {currentFormatter.format(price)}
    </p>
    <p className="cart-item-actions">
      <button onClick={onDecrease}>-</button>
      <button>{quantity}</button>
      <button onClick={onIncrease}>+</button>
    </p>
  </li>;
}