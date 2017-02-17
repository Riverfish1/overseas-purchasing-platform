import React from 'react';
import { Router } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Products from './routes/Products';

const cached = {};
function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

function RouterConfig({ history, app }) {
  const routes = [
    {
      path: '/',
      name: 'IndexPage',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, IndexPage);
        });
      },
    },
    {
      path: '/products',
      name: 'ProductsPage',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/products'));
          cb(null, Products);
        });
      },
    },
  ];

  return <Router history={history} routes={routes} />;
}

export default RouterConfig;
