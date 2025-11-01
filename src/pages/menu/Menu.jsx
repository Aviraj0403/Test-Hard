// pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import MenuItem from './MenuItem';
import FoodCategoryFilter from './FilterFood';
import { getMenu } from '../../services/apiRestaurant';
import Header from '../../components/Header/Header';

const Menu = () => {
  const initialMenuData = useLoaderData();
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(initialMenuData)) {
      setMenu(initialMenuData);
      setFilteredMenu(initialMenuData);
    } else {
      setMenu([]);
      setFilteredMenu([]);
    }
    setLoading(false);
  }, [initialMenuData]);

  useEffect(() => {
    let filtered = menu;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (foodType !== 'All') {
      filtered = filtered.filter((item) => item.itemType === foodType);
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  }, [selectedCategory, foodType, searchQuery, menu]);

  const handleCategoryChange = (category, type) => {
    setSelectedCategory(category);
    setFoodType(type);
  };

  if (loading) return <p className="text-center py-10">Loading menu...</p>;

  return (
    <div className="menu-page min-h-screen">
      <Header setSearchQuery={setSearchQuery} />
      <FoodCategoryFilter onCategoryChange={handleCategoryChange} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <MenuItem key={item._id} fooditem={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              No items found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export async function loader() {
  try {
    const menu = await getMenu();
    console.log('Menu data loaded:', menu);
    return menu || [];
  } catch (error) {
    console.error('Error loading menu:', error);
    return [];
  }
}

export default Menu;