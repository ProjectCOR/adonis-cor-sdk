'use strict'
const Env = use('Env')

/*
|--------------------------------------------------------------------------
| cor-sync-sdk
|--------------------------------------------------------------------------
|
| COR SDK synchronizes model data entities with COR structure.
|
*/

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Source URLs
  |--------------------------------------------------------------------------
  |
  | The URLs of various resources queried for data.
  |
  */
  sourceURLs: {
    'sandbox': 'https://integrations.sandbox.projectcor.com/',
    'live': 'https://integrations.projectcor.com/'
  },

  /*
  |--------------------------------------------------------------------------
  | Environment
  |--------------------------------------------------------------------------
  |
  | The environment where the sdk will be pointing
  |
  */
  env: Env.get('COR_ENV', 'sandbox'),

  /*
  |--------------------------------------------------------------------------
  | App Domain
  |--------------------------------------------------------------------------
  |
  | The app domain from the origin
  |
  */
 app_domain: Env.get('APP_DOMAIN', null)
  

}