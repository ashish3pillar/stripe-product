import Stripe from 'stripe';

export default class StripeClient {
  constructor() {
    this.stripe = new Stripe(
      'sk_test_51M2GNCEr4p5zg8WUOnBrMHzZ76OChbP1m7oQxOUYHl8oEyZJCkEp7RpLT9BVroW8Rc2An03HlChC7MAj0rCRBD0i00xT0swNVj',
      {
        apiVersion: '2022-11-15',
      }
    );
  }

  async getProducts(category = 'course', pageSize = 1, pageLink = null) {
    try {
      const query = pageLink
        ? {
            query: `active:'true' AND metadata['category']:'${category}'`,
            limit: pageSize,
            page: pageLink,
          }
        : {
            query: `active:'true' AND metadata['category']:'${category}'`,
            limit: pageSize,
          };
      const products = await this.stripe.products.search(query);
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
    const product = await this.stripe.products.retrieve(id);
    return {
      id: product.id,
      image: product.images.length > 0 ? product.images[0] : '',
      name: product.name,
      displaySKU: product.metadata['sku'] ? `SKU: ${product.metadata['sku']}` : `Product ID: ${product.id}`,
      sku: product.id,
    };
  }
}
