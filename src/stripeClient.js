export default class StripeClient {
  async getProducts(category, pageSize, pageLink = null) {
    category = category.length > 0 ? category : 'course';
    pageSize = pageSize ? pageSize : 1;
    try {
      let query = `category=${category}&limit=${pageSize}`;
      if (pageLink) query = `category=${category}&limit=${pageSize}&page=${pageLink}`;
      const products = await window.fetch(
        `https://0czdlgfi7g.execute-api.us-east-1.amazonaws.com/v1/stripe/product/search?${query}`,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          headers: {
            Accept: 'application/json',
          },
        }
      );
      const response = await products.json();
      console.log('getProducts - ', response);
      return { result: response.data, has_more: response.has_more, next_page: response.next_page };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProductById(id) {
    const response = await window.fetch(
      `https://0czdlgfi7g.execute-api.us-east-1.amazonaws.com/v1/stripe/product/${id}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          Accept: 'application/json',
        },
      }
    );
    const product = await response.json();
    return {
      id: product.id,
      image: product.images.length > 0 ? product.images[0] : '',
      name: product.name,
      displaySKU: product.metadata['sku'] ? `SKU: ${product.metadata['sku']}` : `Product ID: ${product.id}`,
      sku: product.id,
    };
  }
}
