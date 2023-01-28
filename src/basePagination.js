// import * as _ from 'lodash';
const PER_PAGE = 1;

export default class BasePagination {
  hasNextProductPage = false;
  nextPageLink = null;
  products = [];
  prevSearch = '';
  stripeClient;
  dataTransformer;

  constructor(dataTransformer, stripeClient) {
    this.dataTransformer = dataTransformer;
    this.stripeClient = stripeClient;
  }

  async init(hasNextProductPage, nextPageLink) {
    this.hasNextProductPage = hasNextProductPage;
    this.nextPageLink = nextPageLink;
  }

  async fetchNext(search) {
    const searchHasChanged = search !== this.prevSearch;

    if (searchHasChanged) {
      this.prevSearch = search;
      this._resetPagination();
    }

    const products = await this._fetchMoreProducts(search);

    console.log('base page ', products);
    return {
      pagination: {
        hasNextPage: this.hasNextProductPage,
      },
      products: products.map(this.dataTransformer),
    };
  }

  /**
   * This method will either fetch the first batch of products or the next page
   * in the pagination based on the user search and depending on whether the user
   * has already requested an initial batch of products or not
   */
  async _fetchMoreProducts(search) {
    const noProductsFetchedYet = this.products.length === 0;
    const nextProducts = noProductsFetchedYet ? await this._fetchProducts(search) : await this._fetchNextPage(search);
    console.log('_fetchMoreProducts', nextProducts);
    this.init(nextProducts.has_more, nextProducts.next_page);

    // const newProducts = _.differenceBy(nextProducts.result, this.products, 'id');
    this.products = [...this.products, ...nextProducts.result];
    console.log(nextProducts);
    return nextProducts.result;
  }

  /**
   * This method is used when the user is fetching products for the first time.
   * i.e. when they just opened the product picker widget or when they just applied
   * a new search term.
   */
  async _fetchProducts(search) {
    console.log('_fetchProducts', search);
    return await this.stripeClient.getProducts(search, PER_PAGE, null);
  }

  /**
   * This method is used when the user has already fetched a batch of products
   * and now want to render the next page.
   */
  async _fetchNextPage(search) {
    return await this.stripeClient.getProducts(search, PER_PAGE, this.nextPageLink);
  }

  _resetPagination() {
    this.products = [];
    this.hasNextProductPage = false;
    this.nextPageLink = null;
  }
}
