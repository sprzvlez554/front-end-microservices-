import { createSlice } from "@reduxjs/toolkit";

const emptyState = () => ({
  value: 0,

  user: {},

  profile: {},

  wishlist: [],

  cart: [],

  orders: [],

  address: [],

  authPending: false,

  authError: null,
});

// Recuperar token después de recargar la página
const storedToken =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("token")
    : null;

const initialState = {
  ...emptyState(),

  user: storedToken
    ? {
        token: storedToken,
      }
    : {},
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // ==================== AUTH ====================

    authStarted(state) {
      state.authPending = true;
      state.authError = null;
    },

    authFailed(state, action) {
      state.authPending = false;
      state.authError = action.payload;
    },

    authErrorCleared(state) {
      state.authError = null;
    },

    userLogin(state, action) {
      state.user = action.payload;

      state.authPending = false;
      state.authError = null;
    },

    userSignup(state, action) {
      state.user = action.payload;

      state.authPending = false;
      state.authError = null;
    },

    userLogout() {
      return emptyState();
    },

    // ==================== PROFILE ====================

    userProfile(state, action) {
      state.profile = action.payload;

      state.wishlist = Array.isArray(action.payload.wishlist)
        ? action.payload.wishlist
        : [];

      state.cart = Array.isArray(action.payload.cart)
        ? action.payload.cart
        : [];

      state.address = Array.isArray(action.payload.address)
        ? action.payload.address
        : [];

      state.orders = Array.isArray(action.payload.orders)
        ? action.payload.orders
        : [];
    },

    // ==================== ADDRESS ====================

    addNewAddress(state, action) {
      state.address = [
        ...(state.address || []),
        action.payload,
      ];
    },

    // ==================== WISHLIST ====================

    addToWishlist(state, action) {
      const product = action.payload;

      if (!product?._id) {
        return;
      }

      const exists = state.wishlist.some(
        (item) => item?._id === product._id
      );

      if (!exists) {
        state.wishlist.push(product);
      }
    },

    removeFromWishlist(state, action) {
      const id = action.payload;

      state.wishlist = state.wishlist.filter(
        (item) => item?._id !== id
      );
    },

    // ==================== CART ====================

    addToCart(state, action) {
      const item = action.payload;

      if (!item?.product?._id) {
        return;
      }

      const productId = item.product._id;

      const existingIndex = state.cart.findIndex(
        (cartItem) =>
          cartItem?.product?._id === productId
      );

      if (existingIndex >= 0) {
        state.cart[existingIndex] = item;
      } else {
        state.cart.push(item);
      }
    },

    removeFromCart(state, action) {
      const id = action.payload;

      state.cart = state.cart.filter(
        (item) => item?.product?._id !== id
      );
    },

    // ==================== ORDER ====================

    placeOrder(state, action) {
      if (action.payload) {
        state.orders = [
          action.payload,
          ...(state.orders || []),
        ];
      }

      // Después de comprar, vaciamos el carrito
      state.cart = [];
    },
  },
});

export const {
  authStarted,
  authFailed,
  authErrorCleared,

  userLogin,
  userSignup,
  userLogout,

  userProfile,

  addNewAddress,

  addToWishlist,
  removeFromWishlist,

  addToCart,
  removeFromCart,

  placeOrder,
} = userSlice.actions;

export default userSlice.reducer;
