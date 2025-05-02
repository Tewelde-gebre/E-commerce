import React from "react";

const products = [
  { id: 1, name: "Laptop", price: 900 },
  { id: 2, name: "Phone", price: 400 },
  { id: 3, name: "Headphones", price: 100 },
];

function ProductList({ addToCart }) {
  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "10px" }}>
          <strong>{product.name}</strong> - ${product.price}
          <button onClick={() => addToCart(product)} style={{ marginLeft: "10px" }}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
