import BasePagination from './basePagination';

const productDataTransformer = (product) => {
  const image = product.images.length > 0 ? product.images[0] : null;

  return {
    id: product.id,
    image,
    name: product.name,
    displaySKU: product.metadata['sku'] ? `SKU: ${product.metadata['sku']}` : `Product ID: ${product.id}`,
    sku: product.id,
  };
};

const makePagination = async (client) => {
  return new BasePagination(productDataTransformer, client);
};

export default makePagination;
