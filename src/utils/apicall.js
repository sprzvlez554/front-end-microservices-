import api from 'axios';

 
api.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

const setHeader = () => {
    const token = localStorage.getItem('token');
    if(token){
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

// The API only answers 401 from the auth middleware (a missing, invalid or
// expired token). Failed credentials on /customer/login come back as 400, so
// this never fires while someone is trying to sign in.
export const registerUnauthorizedHandler = (onUnauthorized) => {
  api.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err?.response?.status === 401) {
        onUnauthorized();
      }
      return Promise.reject(err);
    }
  );
};

export const GetData = async(endPoint) => {
  setHeader();
  const response = await api.get(endPoint);
  return response;
}

export const PostData = async(endPoint, options) => {
  setHeader();
  const response = await api.post(endPoint, options);
  return response;
}

export const PutData = async(endPoint, options) => {
  setHeader();
  const response = await api.put(endPoint, options);
  return response;
}

export const DeleteData = async(endPoint) => {
  setHeader();
  const response = await api.delete(endPoint);
  return response;
}