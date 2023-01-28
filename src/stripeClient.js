import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://0czdlgfi7g.execute-api.us-east-1.amazonaws.com/v1/',
  timeout: 1000,
  headers: {
    'x-api-key': 'Q12nWBufRV8FczOZCXJVG11tXBkxxu152dsTqj36',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  },
});
export default class StripeClient {
  async getProducts(category = 'course', pageSize = 1, pageLink = null) {
    try {
      const query = `category=${category}&limit=${pageSize}`;
      const products = await instance.get(`stripe/product/search?${query}`);
      console.log('getProducts - ', products);
      const result = products.data.map((product) => {
        return {
          id: product.id,
          image: product.images.length > 0 ? product.images[0] : null,
          name: product.name,
          displaySKU: product.metadata['sku'] ? `SKU: ${product.metadata['sku']}` : `Product ID: ${product.id}`,
          sku: product.id,
        };
      });
      return { result, has_more: products.has_more, next_page: products.next_page };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProductById(id) {
    const product = await instance.get(`stripe/product/${id}`);
    return {
      id: product.id,
      image: product.images.length > 0 ? product.images[0] : '',
      name: product.name,
      displaySKU: product.metadata['sku'] ? `SKU: ${product.metadata['sku']}` : `Product ID: ${product.id}`,
      sku: product.id,
    };
  }
}
