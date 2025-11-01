// components/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
// import { addItem, removeItem, getCurrentQuantityById } from '../../pages/cart/cartSlice';
import { addItem, removeItem, getCurrentQuantityById } from '../../features/cart/cartSlice.js'
import UpdateItemQuantity from '../../pages/cart/UpdateItemQuantity.jsx';
import { Link } from 'react-router-dom';
import './ProductCard.css';


const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const {
    _id,
    name,
    description = '',
    price,
    imageUrl,
    cookTime,
    category,
    variety,
    itemType,
    discount,
    originalPrice,
  } = item;

  const currentQuantity = useSelector(getCurrentQuantityById(_id));
  const isInCart = currentQuantity > 0;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (isAdding) return;

    const newItem = {
      fooditemId: _id,
      name,
      quantity: 1,
      price,
      totalPrice: price,
    };

    setIsAdding(true);
    dispatch(addItem(newItem));
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleRemove = () => {
    if (isAdding) return;
    setIsAdding(true);
    dispatch(removeItem(_id));
    setTimeout(() => setIsAdding(false), 300);
  };

  const finalPrice = discount ? price : price;
  const hasDiscount = originalPrice || discount;

  return (
    <div className="product-card">
      <Link to={`/menu/${_id}`} className="product-image-link">
        <div className="product-image-wrapper">
          <img
            src={imageUrl || 'https://via.placeholder.com/200'}
            alt={name}
            className="product-image"
          />
          {discount && (
            <span className="discount-badge">-{discount}%</span>
          )}
          <div className="price-tag">
            {formatCurrency(finalPrice)}
          </div>
        </div>
      </Link>

      <div className="product-details">
        <h3 className="product-title">{name}</h3>

        <p className="product-desc">
          {description && description.length > 50
            ? `${description.substring(0, 50)}...`
            : description || 'Delicious and freshly prepared.'}
        </p>

        <div className="product-meta">
          <span className="cook-time">Cook: {cookTime}</span>
          <span className="category-tag">{category}</span>
        </div>

        <div className="product-actions">
          {isInCart ? (
            <>
              <UpdateItemQuantity fooditemId={_id} quantity={currentQuantity} />
              <button className="remove-btn" onClick={handleRemove} disabled={isAdding}>
                Remove
              </button>
            </>
          ) : (
            <button
              className={`add-btn ${isAdding ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          )}
        </div>

        {hasDiscount && (
          <p className="original-price">
            <del>{formatCurrency(originalPrice || price * 1.3)}</del>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;