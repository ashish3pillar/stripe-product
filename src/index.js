import { setup, renderSkuPicker } from '@contentful/ecommerce-app-base';
import StripeClient from './stripeClient';
import makeProductPagination from './productPagination';

import logo from './logo.png';
const client = new StripeClient();
const makeProductSearchResolver = async (sdk) => {
  const pagination = await makeProductPagination(client);
  console.log('makeProductSearchResolver');
  return (search) => pagination.fetchNext(search);
};

const fetchProductPreviews = async (skus) => {
  if (!skus.length) {
    return [];
  }
  const responses = await Promise.all(skus.map((sku) => client.getProductById(sku)));
  return responses;
};

const makeSkuResolver = async (sdk) => {
  return makeProductSearchResolver(sdk);
};

const DIALOG_ID = 'dialog-root';

function makeCTA() {
  return 'Select a product';
}

function validateParameters(parameters) {
  if (parameters.storefrontAccessToken.length < 1) {
    return 'Provide the storefront access token to your Stripe store.';
  }

  if (parameters.apiEndpoint.length < 1) {
    return 'Provide the Stripe API endpoint.';
  }

  return null;
}

async function renderDialog(sdk) {
  const container = document.createElement('div');
  container.id = DIALOG_ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  const skuType = sdk.parameters?.invocation?.skuType;

  await renderSkuPicker(DIALOG_ID, {
    sdk,
    fetchProductPreviews,
    fetchProducts: await makeSkuResolver(sdk),
    searchDelay: 750,
    skuType,
    makeSaveBtnText: makeCTA,
  });

  sdk.window.startAutoResizer();
}

async function openDialog(sdk, currentValue, config) {
  const skus = await sdk.dialogs.openCurrentApp({
    allowHeightOverflow: true,
    position: 'center',
    title: 'Select a product',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: config,
    width: 1400,
  });

  return Array.isArray(skus) ? skus : [];
}

function isDisabled(/* currentValue, config */) {
  // No restrictions need to be imposed as to when the field is disabled from the app's side
  return false;
}

setup({
  makeCTA,
  name: 'Stripe Products',
  logo,
  description:
    'The Stripe app allows editors to select products from their Stripe account and reference them inside of Contentful entries.',
  color: '#212F3F',
  parameterDefinitions: [
    {
      id: 'storefrontAccessToken',
      name: 'Storefront Access Token',
      description: 'The storefront access token to your Shopify store',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'apiEndpoint',
      name: 'API Endpoint',
      description: 'The Shopify API endpoint',
      type: 'Symbol',
      required: true,
    },
  ],
  skuTypes: [
    {
      id: 'product',
      name: 'Product',
    },
  ],
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters,
});
