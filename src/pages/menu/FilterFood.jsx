import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { getMenu } from '../../services/apiRestaurant.js';
import { Navigation, Pagination } from 'swiper/modules'; // Import modules if needed
import './menuItem.css';

function FoodCategoryFilter({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodType, setFoodType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getMenu();
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(['All', ...uniqueCategories]);
        setFilteredCategories(['All', ...uniqueCategories]); // Initially show all categories
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredCategories = async () => {
      if (foodType === 'All') {
        setFilteredCategories(categories);
      } else {
        try {
          const data = await getMenu();
          const filtered = data.filter(item => item.itemType === foodType).map(item => item.category);
          const uniqueFilteredCategories = Array.from(new Set(filtered));
          setFilteredCategories(['All', ...uniqueFilteredCategories]);
        } catch (error) {
          console.error('Error fetching filtered categories:', error);
          setError('Failed to filter categories');
        }
      }
    };
    fetchFilteredCategories();
  }, [foodType, categories]);

  const handleCategoryClick = async (category) => {
    if (category === 'All') {
      setSelectedCategory('All');
      setFoodType('All');
      try {
        await onCategoryChange('All', 'All');
      } catch (error) {
        console.error('Error resetting category and food type:', error);
      }
    } else {
      setSelectedCategory(category);
      try {
        await onCategoryChange(category, foodType);
      } catch (error) {
        console.error('Error changing category:', error);
      }
    }
  };

  const handleFoodTypeClick = async (type) => {
    setFoodType(type);
    setSelectedCategory('All'); // Reset category when changing food type
    try {
      await onCategoryChange('All', type);
    } catch (error) {
      console.error('Error changing food type:', error);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-div mb-7">
      <div className="background-div flex justify-center gap-4 mb-5 py-4 veg-navs border-b border-gray-200 pb-3 shadow-lg rounded-lg bg-gradient-to-r from-blue-300 via-white to-purple-200">

        <button
          className={`category-btn ${foodType === 'Veg' ? 'active' : ''}`}
          onClick={() => handleFoodTypeClick('Veg')}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/non-veg.png" alt="Veg" className="food-type-icon" />
          <span className="capitalize text-sm font-medium">Veg</span>
        </button>

        <button
          className={`category-btn ${foodType === 'Non-Veg' ? 'active' : ''}`}
          onClick={() => handleFoodTypeClick('Non-Veg')}
        >
          <img src="https://demo.foodscan.xyz/images/item-type/veg.png" alt="Non-Veg" className="food-type-icon" />
          <span className="capitalize text-sm font-medium">Non-Veg</span>
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView="auto"
        spaceBetween={12}
        className="menu-swiper"
        style={{ padding: 4 }}
        pagination={{ clickable: true }}
        navigation
      >
        {filteredCategories.map((category) => (
          <SwiperSlide key={category} className="!w-fit">
            <button
              onClick={() => handleCategoryClick(category)}
              className={`category-btn ${selectedCategory === category ? 'selected' : ''}`}
            >
              <div className="category-image-wrapper">
                <img
                  className="category-image"
                  src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB8N27tkV9kQ8toUQMw26UkRiHaL8W_81Bng&s`}
                  alt={category}
                />
              </div>
              <h3 className="category-name">{category}</h3>
            </button>
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
}

export default FoodCategoryFilter;
