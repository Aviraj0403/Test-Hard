// components/menu/MenuItem.jsx
import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';

const MenuItem = ({ fooditem }) => {
  // console.log(fooditem)
  return <ProductCard item={fooditem} />;
};

export default MenuItem;