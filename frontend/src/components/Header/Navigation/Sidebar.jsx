import React, { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { categories } from '../../../data/categories';
import "../Navigation/sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategory = (categoryId, subcategoryId) => {
    const key = `${categoryId}-${subcategoryId}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryClick = (categoryId) => {
    // Navigate to category page
    onClose();
  };

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    // Navigate to subcategory page
    onClose();
  };

  const handleSubsubcategoryClick = (categoryId, subcategoryId, subsubcategoryId) => {
    // Navigate to subsubcategory page
    onClose();
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-80 md:w-96' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 id="sidebar-title" className="text-lg font-semibold text-gray-800">Shop by Category</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close sidebar"
          >
            <RiCloseLine className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Categories List */}
        <div className="overflow-y-auto h-full pb-20">
          <div className="py-2">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                {/* Main Category */}
                <div
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => toggleCategory(category.id)}
                >
                  <Link
                    to={`/products/${category.id}`}
                    className="flex-1 text-gray-800 hover:text-orange-600 font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <div className="flex items-center">
                      {expandedCategories[category.id] ? (
                        <MdOutlineKeyboardArrowDown className="text-gray-500 text-lg" />
                      ) : (
                        <MdOutlineKeyboardArrowRight className="text-gray-500 text-lg" />
                      )}
                    </div>
                  )}
                </div>

                {/* Subcategories */}
                {expandedCategories[category.id] && category.subcategories.length > 0 && (
                  <div className="bg-gray-50 border-l-2 border-orange-200">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="relative">
                        {/* Subcategory */}
                        <div
                          className="flex items-center justify-between px-6 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => toggleSubcategory(category.id, subcategory.id)}
                        >
                          <Link
                            to={`/products/${category.id}/${subcategory.id}`}
                            className="flex-1 text-gray-700 hover:text-orange-600 text-sm transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategoryClick(category.id, subcategory.id);
                            }}
                          >
                            {subcategory.name}
                          </Link>
                          {subcategory.subsubcategories.length > 0 && (
                            <div className="flex items-center">
                              {expandedSubcategories[`${category.id}-${subcategory.id}`] ? (
                                <MdOutlineKeyboardArrowDown className="text-gray-400 text-sm" />
                              ) : (
                                <MdOutlineKeyboardArrowRight className="text-gray-400 text-sm" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Sub-subcategories */}
                        {expandedSubcategories[`${category.id}-${subcategory.id}`] && subcategory.subsubcategories.length > 0 && (
                          <div className="bg-white border-l-2 border-orange-300 ml-4">
                            {subcategory.subsubcategories.map((subsubcategory) => (
                              <Link
                                key={subsubcategory.id}
                                to={`/products/${category.id}/${subcategory.id}/${subsubcategory.id}`}
                                className="block px-8 py-2 text-gray-600 hover:text-orange-600 hover:bg-gray-50 text-sm transition-colors"
                                onClick={() => handleSubsubcategoryClick(category.id, subcategory.id, subsubcategory.id)}
                              >
                                {subsubcategory.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Browse our complete catalog
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;