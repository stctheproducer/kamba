import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import Layout from '~/layouts/default'

interface PageModule {
  default: {
    layout?: (page: React.ReactNode) => React.ReactNode;
  };
}

export default function render(initialPage: any) {
  return createInertiaApp({
    page: initialPage,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<PageModule>('../pages/**/*.tsx', { eager: true })

      let page = pages[`../pages/${name}.tsx`]

      page.default.layout = page.default.layout || ((nestedPage) => <Layout>{nestedPage}</Layout>)

      return page
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}