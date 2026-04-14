import React, { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const CategoryPage = () => {

  const { fetchProductsByCategory, products } = useProductStore()
  const { category } = useParams()

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);
  return (
    <div>
      <div className=' grid sm:grid-cols-2 lg:grid-cols-3 mx-3 gap-3'>
        {products?.map((product) => (
          <div key={product._id}>
            <ProductCard  product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage

 