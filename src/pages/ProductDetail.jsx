import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  onGetProductDetails,
  onAddToWishlist,
  onAddToCart,
  onRemoveFromWishlist,
  onRemoveFromCart,
} from "../store/actions";

const dmSans = { fontFamily: "'DM Sans', sans-serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { currentProduct } = useAppSelector(
    (state) => state.shoppingReducer
  );

  const { wishlist, cart } = useAppSelector(
    (state) => state.userReducer
  );

  const [currentUnit, setCurrentUnit] = useState(0);

  // Obtener producto
  useEffect(() => {
    if (id) {
      dispatch(onGetProductDetails(id));
    }
  }, [dispatch, id]);

  // Revisar si el producto ya está en el carrito
  useEffect(() => {
    if (!currentProduct || !Array.isArray(cart)) {
      setCurrentUnit(0);
      return;
    }

    const productId = currentProduct._id;

    const exist = cart.find(
      (item) => item?.product?._id === productId
    );

    if (exist) {
      setCurrentUnit(exist.unit || exist.quantity || 0);
    } else {
      setCurrentUnit(0);
    }
  }, [currentProduct, cart]);

  // Mientras llega la respuesta del backend
  if (!currentProduct) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={inter}
      >
        Cargando...
      </div>
    );
  }

  // Aquí ya sabemos que existe
  const {
    _id,
    banner,
    price,
    name,
    desc,
    type,
  } = currentProduct;

  const addCart = () => {
    const newUnit = currentUnit + 1;

    setCurrentUnit(newUnit);

    dispatch(
      onAddToCart({
        _id,
        qty: newUnit,
      })
    );
  };

  const removeCart = () => {
    if (currentUnit <= 0) {
      return;
    }

    const newUnit = currentUnit - 1;

    setCurrentUnit(newUnit);

    if (newUnit > 0) {
      dispatch(
        onAddToCart({
          _id,
          qty: newUnit,
        })
      );
    } else {
      dispatch(onRemoveFromCart(_id));
    }
  };

  const isWishlisted =
    Array.isArray(wishlist) &&
    wishlist.some(
      (item) => item?._id === _id
    );

  const cartEntry =
    Array.isArray(cart) &&
    cart.find(
      (item) => item?.product?._id === _id
    );

  return (
    <div className="min-h-screen bg-[#F5F5F3] px-5 sm:px-8 lg:px-10 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Imagen */}
        <div className="bg-black/5">
          <img
            src={banner}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información */}
        <div className="p-6 sm:p-8 flex flex-col gap-4">

          <span
            className="text-black/50 text-sm"
            style={inter}
          >
            Categoría →{" "}
            <span className="text-black capitalize">
              {type}
            </span>
          </span>

          <h1
            className="text-3xl sm:text-4xl"
            style={{
              ...dmSans,
              letterSpacing: "-0.03em",
            }}
          >
            {name}
          </h1>

          <p
            className="text-2xl font-medium"
            style={inter}
          >
            ${price?.toLocaleString()}
          </p>

          <p
            className="text-black/70"
            style={inter}
          >
            {desc}
          </p>

          <p
            className="text-black/40 text-sm"
            style={inter}
          >
            *El vehículo estará disponible a través del canal
            de entrega estándar.
          </p>

          {/* Carrito */}
          <div className="flex items-center gap-4 mt-4">

            {cartEntry ? (
              <div className="flex items-center gap-3">

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-amber-400"
                  onClick={removeCart}
                >
                  <Minus size={18} />
                </button>

                <span className="text-xl w-6 text-center">
                  {currentUnit}
                </span>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-amber-400"
                  onClick={addCart}
                >
                  <Plus size={18} />
                </button>

              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-md bg-amber-400 text-black"
                style={inter}
                onClick={addCart}
              >
                Agregar
                <ShoppingCart size={18} />
              </button>
            )}

            {/* Wishlist */}
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-md text-white ${
                isWishlisted
                  ? "bg-gray-400"
                  : "bg-pink-500"
              }`}
              style={inter}
              onClick={() =>
                dispatch(
                  isWishlisted
                    ? onRemoveFromWishlist(_id)
                    : onAddToWishlist(_id)
                )
              }
            >
              {isWishlisted ? "Quitar" : "Wishlist"}
              <Heart size={18} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductDetails };
