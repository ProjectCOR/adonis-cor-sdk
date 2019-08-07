'use strict'

/**
 * adonis-cor-sdk
 *
 * (c) Daniel Guzman <daniel@projectcor.com>
 *
 */

const got = require('got');
const FormData = require('form-data');
const prodVariables = require('./environments/production')
const devVariables = require('./environments/development')


/**
 * The CorIntegration class makes a request to a url returning a promise
 * resolved with data or rejected with an error.
 *
 * @class CorIntegration
 *
 * @param {Object} Config
 */
class CorIntegration {

  /**
   * 
   * @param {Object} Config Default config with basic setup
   */
  constructor(Config) {
    this.config = {}
    this.env = Config.env || devVariables.envName;
    this.sourceURLs = Config.sourceURLs || {
      sandbox: devVariables.apiEndpoint,
      live: prodVariables.apiEndpoint
    };

    this.auth_code = Config.auth_code || null;


  }



  /**
   * Set config data
   * 
   * @param {Object} config
   * 
   * @memberof CorIntegration
   */
  set config(config) {
    this._config = Object.assign({}, config);
  }

  /**
   * Get config data
   *
   * @returns {Object}
   * @readonly
   * @memberof CorIntegration
   */
  get config() {
    return this._config || {};
  }

  /**
   * Set environment
   * 
   * @param {String} env
   * @memberof CorIntegration
   */
  set env(env) {
    this._config.env = env;
  }

  /**
   * Get Environment
   * 
   * @returns {String}
   * @memberof CorIntegration
   */
  get env() {
    return this._config.env;
  }

  /**
   * Set source URL
   * 
   * @param {Object} sourceURLs
   * @memberof CorIntegration
   */
  set sourceURLs(sourceURLs) {
    this._config.sourceURLs = Object.assign({}, sourceURLs);
  }

  /**
   * Get source URL
   * 
   * @returns {Object}
   * @memberof CorIntegration
   */
  get sourceURLs() {
    return this._config.sourceURLs || {};
  }

  /**
   * Set Authorization Code
   * 
   * @param {String} auth_code
   * @memberof CorIntegration
   */
  set auth_code(auth_code) {
    this._config.auth_code = auth_code;
  }

  /**
   * Get Authorization Code
   * 
   * @returns {String}
   * @memberof CorIntegration
   */
  get auth_code() {
    return this._config.auth_code || null;
  }


  get currentURL() {
    return this.sourceURLs[this.env]
  }

  async _getToken(){
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        try {
          const endpoint = `/oauth2/token?grant_type=authorization_code`;

          const form = new FormData();
          form.append('code', this.auth_code);

          const options = {
            baseUrl: this.currentURL,
            body: form
          }
          const response = await got.post(endpoint, options)
          resolve(response)
        } catch (error) {
          reject(error)
        }
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Check if the service is available.
   *
   * @returns {Promise}
   * @memberof CorIntegration
   */
  checkService() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await got(this.currentURL);
        resolve(response)
      } catch (error) {
        reject(error)
      }
    });
  }

  /**
   * Create an User by passing a user Data
   *
   * @param {Object} [userData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createUser(userData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/users`;
  
            const form = new FormData();
            for(let key in userData){
                form.append(key, userData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
        
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }


  /**
   * Update an User by passing his ID and JSON data
   *
   * @param {Number} user_id User ID (COR)
   * @param {Object} [userData={}] 
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateUser(user_id, userData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/users/${user_id}`;
  
            const form = new FormData();
            for(let key in userData){
                form.append(key, userData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.put(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Create a Client by passing a Client Data
   *
   * @param {Object} [userData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createClient(clientData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/clients`;
  
            const form = new FormData();
            for(let key in clientData){
                form.append(key, clientData[key]);
            }
            
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

 
  /**
   * Update a Client by passing a client_id and client Data
   *
   * @param {Number} client_id
   * @param {Object} [clientData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateClient(client_id, clientData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/clients/${client_id}`;
  
            const form = new FormData();
            for(let key in clientData){
                form.append(key, clientData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Create a Brand by passing a Brand Data
   *
   * @param {Object} [brandData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createBrand(brandData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/brands`;
  
            const form = new FormData();
            for(let key in brandData){
                form.append(key, brandData[key]);
            }
            
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Update a Brand by passing a brand_id and brand Data
   *
   * @param {Number} brand_id
   * @param {Object} [brandData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateBrand(brand_id, brandData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/brands/${brand_id}`;
  
            const form = new FormData();
            for(let key in brandData){
                form.append(key, brandData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Create a Product by passing a Product Data
   *
   * @param {Object} [productData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createProduct(productData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/products`;
  
            const form = new FormData();
            for(let key in productData){
                form.append(key, productData[key]);
            }
            
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Update a Product by passing a product_id and Product Data
   *
   * @param {Number} product_id
   * @param {Object} [productData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateProduct(product_id, productData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/products/${product_id}`;
  
            const form = new FormData();
            for(let key in productData){
                form.append(key, productData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Create a Fee by passing a Fee Data
   *
   * @param {Object} [feeData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createFee(feeData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/fees`;
  
            const form = new FormData();
            for(let key in feeData){
                form.append(key, feeData[key]);
            }
            
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Update a Fee by passing a fee_id and Fee Data
   *
   * @param {Number} fee_id
   * @param {Object} [feeData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateFee(fee_id, feeData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/fees/${fee_id}`;
  
            const form = new FormData();
            for(let key in feeData){
                form.append(key, feeData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Create a Project by passing a Project Data
   *
   * @param {Object} [projectData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createProject(projectData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/projects`;
  
            const form = new FormData();
            for(let key in projectData){
                form.append(key, projectData[key]);
            }
            
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Update a Project by passing a project_id and Project Data
   *
   * @param {Number} project_id
   * @param {Object} [projectData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateProject(project_id, projectData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/projects/${project_id}`;
  
            const form = new FormData();
            for(let key in projectData){
                form.append(key, projectData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Create a Project Estimate by passing a Data
   *
   * @param {Number} [project_id]
   * @param {Object} [estimateData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createProjectEstimate(project_id, estimateData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/projects/${project_id}/project_estimate`;
  
            const form = new FormData();
            for(let key in estimateData){
                form.append(key, estimateData[key]);
            }
            
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }

  /**
   * Update a Project Estimate by passing a project_id, estimate_id and Project Data
   *
   * @param {Number} project_id
   * @param {Number} estimate_id
   * @param {Object} [estimateData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateProject(project_id, estimate_id, estimateData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
        .then(async (res) => {
          try {
            const endpoint = `/projects/${project_id}/project_estimate/${estimate_id}`;
  
            const form = new FormData();
            for(let key in estimateData){
                form.append(key, estimateData[key]);
            }
  
            const options = {
              baseUrl: this.currentURL,
              body: form,
              headers: {
                Authorization: `Bearer ${JSON.parse(res.body).access_token}`
              }
            }
            const response = await got.post(endpoint, options)
            resolve(response)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(new Error('Undefined Authorization Code'))
      }
    })
  }


} module.exports = CorIntegration