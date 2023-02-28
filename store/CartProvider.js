import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    return add();
  }
  if(action.type === "REMOVE"){
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );;
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if(existingItem.amount ===1){
      updatedItems = state.items.filter(it=>it.id !== action.id);
    } 
    else{
      const updateditem = {...existingItem,amount:existingItem.amount-1};
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updateditem;
    }
    return{
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };   

  }
  return defaultCartState;

  function add() {
    const upAmount = state.totalAmount + action.item.price * action.item.amount;
    const existingCartItemIndex = getItemIndex();
    const existingCartItem = state.items[existingCartItemIndex];
    let updateItems;

    if (existingCartItem) {
      const updateItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount
      };
      updateItems = [...state.items];
      updateItems[existingCartItemIndex] = updateItem;
    }
    else {
      updateItems = state.items.concat(action.item);
    }

    return {
      items: updateItems,
      totalAmount: upAmount,
    };
  }

  function getItemIndex() {
    return state.items.findIndex(
      (item) => item.id === action.item.id
    );
  }
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
