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

// Mensajes de error para mostrar en español
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

export const onClearAuthError = () => (dispatch) =>
  dispatch(authErrorCleared());

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

      const { token } = response.data;

      await SetAuthToken(token);

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

      const { token } = response.data;

      await SetAuthToken(token);

      return dispatch(userLogin(response.data));
    } catch (err) {
      return dispatch(authFailed(describeAuthError(err)));
    }
  };

// ==================== LOGOUT ====================

export const onLogout = () => async (dispatch) => {
  await SetAuthToken(null);

  return dispatch(userLogout());
};

// ==================== PROFILE ====================

export const onViewProfile = (id) => async (dispatch) => {
  try {
    const response = await GetData(`/customers/profile/${id}`);

    return dispatch(userProfile(response.data));
  } catch (err) {
    console.log(err);
  }
};