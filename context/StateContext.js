import product from "@/sanity/product";
import { isRouteMatch } from "next/dist/server/future/route-matches/route-match";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  //hooks
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundItem;

  const addToCart = (product, quantity) => {
    //check if product is in cart already
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    //update total price and quantity
    setTotalPrice(
      (prevTotalPrice) =>
        Math.round((prevTotalPrice + product.price * quantity) * 100) / 100
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      //if item is in cart already, replace quantity with new quantity
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        } else {
          return cartProduct;
        }
      });

      setCartItems(updatedCartItems);
    } else {
      //if item is not in cart, add item to cart
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    //display success toast notification
    toast.success(`${qty} ${product.name} added to the cart.`);
    //reset item quantity to 1
    setQty(1);
  };

  const removeFromCart = (itemToRemove) => {
    //find the item
    foundItem = cartItems.find((item) => item._id === itemToRemove._id);

    //remove the item from the cart
    const updatedItems = cartItems.filter(
      (item) => item._id != itemToRemove._id
    );
    setCartItems(updatedItems);

    //update total price and quantity
    setTotalPrice(
      (prevTotalPrice) =>
        Math.round(
          (prevTotalPrice - foundItem.price * foundItem.quantity) * 100
        ) / 100
    );
    setTotalQuantities((prevTotalQty) => prevTotalQty - foundItem.quantity);
  };

  const changeCartItemQuantity = (id, value) => {
    //find the item with matching id
    foundItem = cartItems.find((item) => item._id === id);

    if (value === "increase") {
      //update the item
      const updatedCartItems = cartItems.map((item) => {
        if (item._id == id) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
      setCartItems(updatedCartItems);

      //increase total price and total quantity
      setTotalPrice(
        (prevTotalPrice) =>
          Math.round((prevTotalPrice + foundItem.price) * 100) / 100
      );
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "decrease") {
      //make sure quantity is no less than 1
      if (foundItem.quantity > 1) {
        //update cart item
        const updatedCartItems = cartItems.map((item) => {
          if (item._id == id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
        setCartItems(updatedCartItems);

        //decrease total price and total quantity
        setTotalPrice(
          (prevTotalPrice) =>
            Math.round((prevTotalPrice - foundItem.price) * 100) / 100
        );
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const increaseQty = () => {
    //increase quantity by 1
    setQty((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    //decrease quantity by 1, make sure it is not less than 1
    setQty((prevQty) => {
      if (prevQty - 1 < 1) {
        return 1;
      } else {
        return prevQty - 1;
      }
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        increaseQty,
        decreaseQty,
        addToCart,
        setShowCart,
        setCartItems,
        changeCartItemQuantity,
        removeFromCart,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
