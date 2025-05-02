import React from "react";

function Cart({ cartItems, removeFromCart }) {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Cart</h2>
      {cartItems.length === 0 && <p>No items in cart.</p>}
      {cartItems.map((item, index) => (
        <div key={index}>
          {item.name} - ${item.price}
          <button onClick={() => removeFromCart(index)} style={{ marginLeft: "10px" }}>
            Remove
          </button>
        </div>
      ))}
      {cartItems.length > 0 && <h3>Total: ${total}</h3>}
    </div>
  );
}

export default Cart;
