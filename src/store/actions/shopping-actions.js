import { DeleteData, GetData, PostData, PutData } from '../../utils'
import { landingProducts, productDetails } from '../shpping-slice'
import {
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  addNewAddress,
  placeOrder,
} from '../user-slice'


export const onGetProducts = (payload) => async(dispatch) => {

    try {

        const response = await GetData('/products');

        dispatch(landingProducts(response.data));


    } catch (err) {
      console.log(err)
    }

  };


  export const onGetProductDetails = (id) => async(dispatch) => {

    try {

        const response = await GetData('/products/'+id);

        dispatch(productDetails(response.data));


    } catch (err) {
      console.log(err)
    }

  };

  /* ------------------- Wishlist --------------------- */

  export const onAddToWishlist = (_id) => async(dispatch) => {


    try {

        const response = await PutData('/wishlist', {
          _id
        });

        dispatch(addToWishlist(response.data));


    } catch (err) {
      console.log(err)
    }

  };


  export const onRemoveFromWishlist = (_id) => async(dispatch) => {

    try {

        const response = await DeleteData('/wishlist/'+_id);

        dispatch(removeFromWishlist(response.data));

    } catch (err) {
      console.log(err)
    }

  };



  /* ------------------- Cart --------------------- */

  export const onAddToCart = ({ _id, qty }) => async(dispatch) => {

    try {

        const response = await PutData('/cart', {
          _id,
          qty
        });

        dispatch(addToCart(response.data));


    } catch (err) {
      console.log(err)
    }

  };


  export const onRemoveFromCart = (_id) => async(dispatch) => {

    try {

        const response = await DeleteData('/cart/'+_id);

        dispatch(removeFromCart(response.data));

    } catch (err) {
      console.log(err)
    }

  };


  export const onCreateAddress = ({street, postalCode,city,country }) => async(dispatch) => {

    try {

        const response = await PostData('/customer/address/', {
          street, postalCode,city,country
        });

        dispatch(addNewAddress(response.data));

    } catch (err) {
      console.log(err)
    }

  };


  export const onPlaceOrder = ({txnId }) => async(dispatch) => {

    try {

        const response = await PostData('/shopping/order/', {
          txnId
        });

        dispatch(placeOrder(response.data));

    } catch (err) {
      console.log(err)
    }

  };
