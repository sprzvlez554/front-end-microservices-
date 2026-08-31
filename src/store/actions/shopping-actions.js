import { GetData, PostData, PutData, DeleteData } from "../../utils";

import {
  landingProducts,
  productDetails,
} from "../shpping-slice";

import {
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  addNewAddress,
  placeOrder,
} from "../user-slice";

// ==================== PRODUCTS ====================

export const onGetProducts = () => async (dispatch) => {
  try {
    const response = await GetData("/products");

    dispatch(landingProducts(response.data));
  } catch (err) {
    console.log(
      "Error obteniendo productos:",
      err.response?.data || err.message
    );
  }
};

export const onGetProductDetails = (id) => async (dispatch) => {
  try {
    const response = await GetData(`/products/${id}`);

    dispatch(productDetails(response.data));
  } catch (err) {
    console.log(
      "Error obteniendo producto:",
      err.response?.data || err.message
    );
  }
};

// ==================== WISHLIST ====================
// Se maneja localmente porque el backend actual
// no tiene endpoints /wishlist.

export const onAddToWishlist = (product) => async (dispatch) => {
  dispatch(addToWishlist(product));
};

export const onRemoveFromWishlist = (id) => async (dispatch) => {
  dispatch(removeFromWishlist(id));
};

// ==================== CART ====================
// Se maneja localmente porque el backend actual
// no tiene endpoints /cart.
//
// IMPORTANTE:
// El resto del frontend espera:
//
// {
//   product: { ...producto },
//   unit: cantidad
// }

// ==================== CART ====================

export const onAddToCart =
  ({ _id, qty = 1, ...product }) =>
  async (dispatch) => {
    dispatch(
      addToCart({
        product: {
          _id,
          ...product,
        },
        unit: qty,
      })
    );
  };

export const onRemoveFromCart =
  (id) =>
  async (dispatch) => {
    dispatch(removeFromCart(id));
  };

// ==================== ADDRESS ====================
// Se maneja localmente porque el backend actual
// no tiene /customer/address.

export const onCreateAddress =
  ({ street, postalCode, city, country }) =>
  async (dispatch) => {
    const address = {
      street,
      postalCode,
      city,
      country,
    };

    dispatch(addNewAddress(address));
  };

// ==================== ORDER ====================
// Backend:
// POST /shopping

export const onPlaceOrder = () => async (dispatch, getState) => {
  try {
    const state = getState();

    const userState = state.userReducer || {};
    const user = userState.user || {};
    const cart = userState.cart || [];

    // Intentamos encontrar el ID del cliente
    const customerId =
      user.customer?._id ||
      user.customer?.id ||
      user._id ||
      user.id ||
      localStorage.getItem("customerId");

    if (!customerId) {
      console.log("No existe customerId.");
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      console.log("El carrito está vacío.");
      return;
    }

    // Convertimos el carrito al formato que espera Shopping
    const products = cart
      .filter((item) => item?.product)
      .map((item) => ({
        productId: item.product._id,
        quantity: item.unit || 1,
        price: item.product.price,
      }));

    if (!products.length) {
      console.log("No hay productos válidos en el carrito.");
      return;
    }

    const total = products.reduce(
      (sum, product) =>
        sum + Number(product.price || 0) * Number(product.quantity || 0),
      0
    );

    const response = await PostData("/shopping", {
      customerId,
      products,
      total,
    });

    console.log("Compra creada:", response.data);

    dispatch(placeOrder(response.data));
  } catch (err) {
    console.log(
      "Error creando la compra:",
      err.response?.data || err.message
    );
  }
};
