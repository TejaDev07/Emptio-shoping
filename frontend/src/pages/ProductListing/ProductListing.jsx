import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { useParams } from 'react-router-dom';

const ProductListing = () => {
  const params = useParams();
  const { category, subcategory, subsubcategory } = params || {};
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('');

  // Fetch products from API with category filter (only use top-level category in the query)
  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, subsubcategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Only request top-level category to avoid excluding products that lack subcategory fields
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      const queryString = params.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;

      console.log('🔍 Frontend: Fetching products from:', url);

      const response = await fetch(url);
      if (response.ok) {
        let productData = await response.json();
        console.log(`✅ Frontend: Received ${productData.length} products`);

        // If a subcategory is requested, attempt client-side filtering when possible
        if (subcategory) {
          const filteredBySub = productData.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase());
          if (filteredBySub.length > 0) {
            productData = filteredBySub;
          }
        }

        setProducts(productData);
        setFilteredProducts(productData); // Set filtered products directly
      } else {
        console.log('❌ Frontend: Failed to load products, status:', response.status);
        setError('Failed to load products');
      }
    } catch (err) {
      console.log('💥 Frontend: Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sort products (filtering is now done on backend)
  useEffect(() => {
    let sorted = [...products];

    // Filter by search term (only client-side filtering remaining)
    if (filterBy) {
      sorted = sorted.filter(p =>
        p.name.toLowerCase().includes(filterBy.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(filterBy.toLowerCase()))
      );
    }

    // Sort products
    sorted.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(sorted);
  }, [products, sortBy, filterBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {!category ? 'All Products' :
           !subcategory ? `${category.replace('-', ' ')}` :
           !subsubcategory ? `${subcategory.replace('-', ' ')}` :
           `${subsubcategory.replace('-', ' ')}`}
          <span className="text-gray-500 text-lg ml-2">({filteredProducts.length} items)</span>
        </h1>
        <div className="flex gap-4">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="discount">Sort by Discount</option>
          </select>
          <input
            type="text"
            placeholder="Search products..."
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border p-2 rounded min-w-[200px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListing;