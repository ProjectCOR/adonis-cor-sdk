#### What's This?

Adonis Cor SDK is a NPM package for Adonisjs that synchronizes model data entities with COR structure.

### Getting Started

Simply run the below command and follow the instructions.

```bash
adonis install adonis-cor-sdk
```

With this installation, the sdk should create the `config/cor-sdk.js` file. In this file, you can define the SourceURLs you need in order to make tests:

```
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
    'live': 'https://integrations.projectcor.com/',
    // You can add any other env and url.
    '<your_env>': 'http://your_test_integration_enpoint.com'
  },
```

The current configuration options, allows you define the Environments and SourceUrls as per your needs. By default there are two available environments, `live` and `sandbox`. If you need to use another integration environment rather than the default ones, you can define it in your in your `.env` file

```bash
COR_ENV={"live"|"sandbox"|"<your_env>"}
APP_DOMAIN={"https://your_domain.com"}
```

Finally, you need to add the provider to AdonisJS at `start/app.js`:

```javascript
const providers = [
   ...
   'adonis-cor-sdk/providers/CORIntegrationProvider',
];
```

### Checking the service status

Once you've done the setup, you can easily check the status of your defined environment. You just need to run the following command within the project:

`adonis check:service`

This should return the current status of the API:

![Check Service](https://user-images.githubusercontent.com/5767551/93396472-20d21d80-f84e-11ea-9305-415e21cedda7.png)


### Examples


In the following example, we are going to create a new client: 

```javascript
'use strict'

const COR = use('adonis-cor-sdk')

class ExampleClass {

  ...

  async method ({ data }) {
    
    ...

    COR.auth_code = '{User_Auth_code}';
        
    await COR.createClient(clientData)
      .then((res) => {
          //Success
      })
      .catch((err) => {
          //Error
      });

  }
}

module.exports = ExampleClass

```

## Official documentation for Node.js apps

https://docs.sentry.io/clients/node/

## Issues & PR

It is always helpful if we try to follow certain practices when creating issues or PR's, since it will save everyone's time.

1. Always try creating regression tests when you find a bug (if possible).
2. Share some context on what you are trying to do, with enough code to reproduce the issue.
3. For general questions, please create a forum thread.
4. When creating a PR for a feature, make sure to create a parallel PR for docs too.

## License

Adonis COR SDK is open-sourced software licensed under the ISC license. Read [LICENSE](https://github.com/ProjectCOR/adonis-cor-sdk/blob/master/LICENSE) for more licensing information.


