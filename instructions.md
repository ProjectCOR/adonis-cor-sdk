## Register provider
Register provider inside `start/app.js` file.

```js
const providers = [
  'adonis-cor-sdk/providers/CORIntegrationProvider'
]
```

And then you can access it as follows

```js
const Sophos = use('adonis-cor-sdk')
```