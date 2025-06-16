import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Experimental flags
  |--------------------------------------------------------------------------
  |
  | The following features will be enabled by default in the next major release
  | of AdonisJS. You can opt into them today to avoid any breaking changes
  | during upgrade.
  |
  */
  experimental: {
    mergeMultipartFieldsAndFiles: true,
    shutdownInReverseOrder: true,
  },

  /*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register from packages. The application commands
  | will be scanned automatically from the "./commands" directory.
  |
  */
  commands: [
    () => import('@adonisjs/core/commands'),
    () => import('@foadonis/maintenance/commands'),
    () => import('@adonisjs/cache/commands'),
    () => import('@jrmc/adonis-attachment/commands'),
    () => import('adonis-lucid-filter/commands'),
    () => import('@tuyau/core/commands'),
    () => import('@adonisjs/lucid/commands'),
    () => import('@adonisjs/mail/commands'),
    () => import('@foadonis/actions/commands'),
    () => import('@adocasts.com/dto/commands'),
    () => import('@adonisjs/bouncer/commands')
  ],

  /*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to import and register when booting the
  | application
  |
  */
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    {
      file: () => import('@adonisjs/core/providers/repl_provider'),
      environment: ['repl', 'test'],
    },
    () => import('@adonisjs/core/providers/vinejs_provider'),
    () => import('@adonisjs/core/providers/edge_provider'),
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/vite/vite_provider'),
    () => import('@adonisjs/shield/shield_provider'),
    () => import('@adonisjs/static/static_provider'),
    () => import('@adonisjs/cors/cors_provider'),
    () => import('@adonisjs/auth/auth_provider'),
    () => import('@adonisjs/inertia/inertia_provider'),
    () => import('@foadonis/maintenance/maintenance_provider'),
    () => import('@adonisjs/cache/cache_provider'),
    () => import('@adonisjs/transmit/transmit_provider'),
    () => import('@adonisjs/limiter/limiter_provider'),
    () => import('@adonisjs/ally/ally_provider'),
    () => import('@jrmc/adonis-attachment/attachment_provider'),
    () => import('adonis-lucid-filter/provider'),
    () => import('@stouder-io/adonis-auditing/auditing_provider'),
    () => import('@holoyan/adonisjs-activitylog/activity_log_provider'),
    () => import('adonis-captcha-guard/providers/captcha_provider'),
    () => import('@tuyau/core/tuyau_provider'),
    () => import('@adonisjs/drive/drive_provider'),
    () => import('@adonisjs/lucid/database_provider'),
    () => import('@adonisjs/mail/mail_provider'),
    () => import('@adonisjs/lock/lock_provider'),
    () => import('adonis-lucid-soft-deletes/provider'),
    () => import('#providers/database_pragma_provider'),
    () => import('#providers/usage_service_provider'),
    () => import('@adonisjs/bouncer/bouncer_provider')
  ],

  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [
    () => import('#start/routes'),
    () => import('#start/kernel'),
    () => import('#start/events'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  |
  | List of test suites to organize tests by their type. Feel free to remove
  | and add additional suites.
  |
  */
  tests: {
    suites: [
      {
        files: ['tests/unit/**/*.spec(.ts|.js)'],
        name: 'unit',
        timeout: 2000,
      },
      {
        files: ['tests/functional/**/*.spec(.ts|.js)'],
        name: 'functional',
        timeout: 30000,
      },
    ],
    forceExit: false,
  },

  /*
  |--------------------------------------------------------------------------
  | Metafiles
  |--------------------------------------------------------------------------
  |
  | A collection of files you want to copy to the build folder when creating
  | the production build.
  |
  */
  metaFiles: [
    {
      pattern: 'resources/views/**/*.edge',
      reloadServer: false,
    },
    {
      pattern: 'public/**',
      reloadServer: false,
    },
  ],

  assetsBundler: false,
  hooks: {
    onBuildStarting: [() => import('@adonisjs/vite/build_hook')],
  },
  directories: {
    audit_resolvers: 'app/audit_resolvers',
  },
})
