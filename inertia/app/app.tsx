/// <reference path="../../config/inertia.ts" />
/// <reference path="../../adonisrc.ts" />

// import '../css/app.css';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import Layout from '~/layouts/default'

interface PageModule {
  default: {
    layout?: (page: React.ReactNode) => React.ReactNode;
  };
}

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#0097a7' },

  title: (title) => `${appName} | ${title}`,

  resolve: async (name) => {
    const page = await resolvePageComponent<PageModule>(
      `../pages/${name}.tsx`,
      import.meta.glob<PageModule>('../pages/**/*.tsx'),
    );

    // Apply the default layout if the page doesn't specify one
    page.default.layout = page.default.layout || ((page) => (
      <Layout>{page}</Layout>
    ));

    return page;
  },

  setup({ el, App, props }) {

    hydrateRoot(el, <App {...props} />)

  },
});