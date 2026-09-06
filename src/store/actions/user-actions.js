import { GetData, PostData } from "../../utils";

import {
  authStarted,
  authFailed,
  authErrorCleared,
  userLogin,
  userSignup,
  userLogout,
  userProfile,
} from "../user-slice";

// ==================== MENSAJES DE ERROR ====================

const API_ERROR_MESSAGES = {
  "Invalid credentials": "Correo o contraseña incorrectos.",
  "Email already registered": "Ese correo ya tiene una cuenta registrada.",
};

const describeAuthError = (err) => {
  if (!err?.response) {
    return "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
  }

  const apiMessage = err.response.data?.message;

  if (apiMessage && API_ERROR_MESSAGES[apiMessage]) {
    return API_ERROR_MESSAGES[apiMessage];
  }

  if (err.response.status >= 500) {
    return "El servidor tuvo un problema. Inténtalo de nuevo en un momento.";
  }

  return "No pudimos completar la operación. Revisa los datos e inténtalo de nuevo.";
};

// ==================== ERROR ====================

export const onClearAuthError = () => (dispatch) => {
  dispatch(authErrorCleared());
};

// ==================== TOKEN ====================

export const SetAuthToken = async (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// ==================== SIGNUP ====================

export const onSignup =
  ({ name, email, password, phone }) =>
  async (dispatch) => {
    try {
      dispatch(authStarted());

      const response = await PostData("/customers/signup", {
        name,
        email,
        password,
        phone,
      });

      const { token, customer } = response.data;

      // Guardar token
      await SetAuthToken(token);

      // Guardar ID del cliente
      if (customer?._id) {
        localStorage.setItem("customerId", customer._id);
      }

      return dispatch(userSignup(response.data));
    } catch (err) {
      return dispatch(authFailed(describeAuthError(err)));
    }
  };

// ==================== LOGIN ====================

export const onLogin =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      dispatch(authStarted());

      const response = await PostData("/customers/login", {
        email,
        password,
      });

      const { token, customer } = response.data;

      // Guardar token
      await SetAuthToken(token);

      // Guardar ID del cliente
      if (customer?._id) {
        localStorage.setItem("customerId", customer._id);
      }

      return dispatch(userLogin(response.data));
    } catch (err) {
      return dispatch(authFailed(describeAuthError(err)));
    }
  };

// ==================== LOGOUT ====================

export const onLogout = () => async (dispatch) => {
  await SetAuthToken(null);

  // Eliminar ID del cliente
  localStorage.removeItem("customerId");

  return dispatch(userLogout());
};

// ==================== PROFILE ====================

export const onViewProfile = () => async (dispatch, getState) => {
  try {
    const state = getState();

    const user = state.userReducer?.user || {};

    const id =
      user._id ||
      user.id ||
      user.customer?._id ||
      user.customer?.id ||
      localStorage.getItem("customerId");

    if (!id) {
      console.log("No se encontró el ID del cliente.");
      return;
    }

    const response = await GetData(`/customers/profile/${id}`);

    const profileData = response.data || {};

    let orders = [];

    try {
      const ordersResponse = await GetData(`/shopping/customer/${id}`);

      if (Array.isArray(ordersResponse.data?.shoppings)) {
        orders = ordersResponse.data.shoppings;
      }
    } catch (ordersErr) {
      console.log(
        "Error obteniendo pedidos:",
        ordersErr.response?.data || ordersErr.message
      );
    }

    return dispatch(userProfile({ ...profileData, orders }));
  } catch (err) {
    console.log(
      "Error obteniendo perfil:",
      err.response?.data || err.message
    );
  }
};