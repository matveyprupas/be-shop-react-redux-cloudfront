import { ProductType } from '../db/products'

const products = require('../db/products.json')

export const getOneProductsById = async (id: string): Promise<ProductType> => {
    return products.filter( (product: ProductType) => {
        const productId = product.title.toLowerCase().split(' ').join('');
        return productId === id;
      })[0]
}