import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      if (response.ok) {
        const productData = await response.json();
        setProducts(productData);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();

    const filtered = products.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.brand,
        // Add some common keywords for better search
        product.category === 'fashion' ? 'clothing apparel wear' : '',
        product.category === 'electronics' ? 'gadgets tech devices' : '',
        product.category === 'beauty' ? 'cosmetics makeup skincare' : '',
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });

    setFilteredProducts(filtered);
  }, [query, products]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Search Results
        </h1>
        {query && (
          <p className="text-gray-600">
            Showing results for "<span className="font-medium">{query}</span>"
          </p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
            <div className="flex gap-4">
              <select className="border p-2 rounded">
                <option>Sort by Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : query ? (
        <div className="text-center py-16">
          <div className="mb-4">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{query}". Try searching with different keywords.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products/fashion"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                Fashion
              </Link>
              <Link
                to="/products/electronics"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                Electronics
              </Link>
              <Link
                to="/products/beauty"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                Beauty
              </Link>
              <Link
                to="/products/home"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                Home & Kitchen
              </Link>
            </div>
          </div>

          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600">Enter a search term to find products.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;