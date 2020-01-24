#### What's This?

Adonis Cor SDK is a NPM package for Adonisjs that synchronizes model data entities with COR structure.

### Getting Started

Simply run the below command and follow the instructions below.

```bash
adonis install adonis-cor-sdk
```

You need to add the provider to AdonisJS at `start/app.js`:

```javascript
const providers = [
   ...
   'adonis-cor-sdk/providers/CORIntegrationProvider',
];
```

and in your `.env` file

```bash
COR_ENV={"live"|"sandbox"}
APP_DOMAIN={"https://your_domain.com"}
```


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

Adonis COR SDK is open-sourced software licensed under the ISC license.

