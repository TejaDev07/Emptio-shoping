// categories.js - Navigation categories data
export const categories = [
  {
    id: 'fashion',
    name: 'Fashion',
    subcategories: [
      {
        id: 'men',
        name: 'Men',
        subsubcategories: [
          { id: 't-shirts', name: 'T-Shirts' },
          { id: 'shirts', name: 'Shirts' },
          { id: 'jeans', name: 'Jeans' },
          { id: 'shoes', name: 'Shoes' },
          { id: 'innerwear', name: 'Innerwear' },
        ]
      },
      {
        id: 'women',
        name: 'Women',
        subsubcategories: [
          { id: 'dresses', name: 'Dresses' },
          { id: 'jeans', name: 'Jeans' },
          { id: 'lingerie', name: 'Lingerie' },
        ]
      },
      {
        id: 'kids',
        name: 'Kids',
        subsubcategories: [
          { id: 't-shirts', name: 'T-Shirts' },
          { id: 'jackets', name: 'Jackets' },
        ]
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics',
    subcategories: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        subsubcategories: []
      },
      {
        id: 'laptops',
        name: 'Laptops',
        subsubcategories: []
      },
      {
        id: 'tablets',
        name: 'Tablets',
        subsubcategories: []
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    subcategories: [
      {
        id: 'running',
        name: 'Running',
        subsubcategories: [
          { id: 'shoes', name: 'Shoes' },
          { id: 'apparel', name: 'Apparel' },
        ]
      }
    ]
  },
  {
    id: 'bags',
    name: 'Bags',
    subcategories: [
      {
        id: 'backpacks',
        name: 'Backpacks',
        subsubcategories: []
      },
      {
        id: 'duffel-bags',
        name: 'Duffel Bags',
        subsubcategories: []
      },
      {
        id: 'tote-bags',
        name: 'Tote Bags',
        subsubcategories: []
      }
    ]
  }
];