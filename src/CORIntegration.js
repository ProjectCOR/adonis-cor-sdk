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
    this.app_domain = Config.app_domain || null    
    this.auth_code = Config.auth_code || null;
    this.sourceURLs = Config.sourceURLs || {
      sandbox: devVariables.apiEndpoint,
      live: prodVariables.apiEndpoint
    };


    if (Config.merge !== undefined) {
      this.config = Config.merge('cor-sdk', {
        sourceURLs: this.sourceURLs,
        env: this.env,
        app_domain: this.app_domain,
        auth_code: this.auth_code
      })
    }

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
   * Set app_domain
   * 
   * @param {String} app_domain
   * @memberof CorIntegration
   */
  set app_domain(app_domain) {
    this._config.app_domain = app_domain;
  }

  /**
   * Get app_domain
   * 
   * @returns {String}
   * @memberof CorIntegration
   */
  get app_domain() {
    return this._config.app_domain;
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


  /**
   * Return the current URL as per the environment.
   *
   * @readonly
   * @memberof CorIntegration
   */
  get currentURL() {
    return this.sourceURLs[this.env]
  }

  /**
   * Get the access Token granted by the API with OAut2.
   *
   * @returns {Promise}
   * @memberof CorIntegration
   */
  async _getToken() {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        try {
          const endpoint = `/oauth2/token?grant_type=authorization_code`;

          const response = await this._sendRequest({
            endpoint: endpoint,
            type: 'POST',
            data: {
              code: this.auth_code
            }
          })
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
   * Sends an Http Request to the endpoint.
   * 
   * It receives an object with the basic setup: endpoint (default null),
   * type (default GET), headers and some data to be sent into a form data.
   *
   * @param {*} [{ endpoint: endpoint = null, type: type = 'GET', headers: headers = {}, data: data = {} }={}]
   * @param {*} arg
   * @returns {Promise} A Promise object from the http request.
   * @memberof CorIntegration
   */
  async _sendRequest({ endpoint: endpoint = null, type: type = 'GET', headers: headers = {}, data: data = {} } = {}, ...arg) {

    const form = new FormData();
    for (let key in data) {
      if (data[key] != undefined) form.append(key, data[key]);
    }
    if (this.app_domain != undefined){
      headers['Origin'] = this.app_domain;
    }

    const options = {
      baseUrl: this.currentURL,
      method: type.toUpperCase(),
      body: form,
      headers: headers,
      retry:0
    }
    return await got(endpoint, options)
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


  /**********************************
   *                                *
   *    API INTEGRATION CALLS       *
   *                                *
   **********************************/

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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: userData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: userData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete User by passing a user_id
   *
   * @param {Number} user_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteUser(user_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/users/${user_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * @param {Object} [clientData={}]
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: clientData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: clientData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete a Client by passing a client_id
   *
   * @param {Number} client_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteClient(client_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/clients/${client_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: brandData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: brandData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete a Brand by passing a brand_id
   *
   * @param {Number} brand_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteBrand(brand_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/brands/${brand_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: productData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: productData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete a Product by passing a product_id
   *
   * @param {Number} product_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteProduct(product_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/products/${product_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: feeData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: feeData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete a Fee by passing a fee_id
   *
   * @param {Number} fee_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteFee(fee_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/fees/${fee_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: projectData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: projectData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete a Project by passing a project_id
   *
   * @param {Number} project_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteProject(project_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/projects/${project_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: estimateData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
  updateProjectEstimate(project_id, estimate_id, estimateData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/projects/${project_id}/project_estimate/${estimate_id}`;

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: estimateData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Delete a Project Estimate by passing a project_id and a estimate_id
   *
   * @param {Number} project_id
   * @param {Number} estimate_id
   * @returns {Promise}
   * @memberof CorIntegration
   */
  deleteProjectEstimate(project_id, estimate_id) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/projects/${project_id}/project_estimate/${estimate_id}`;
              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'DELETE',
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Create an Hour by passing a data
   *
   * @param {Object} [hourData={}]
   * @returns {Promise} 
   * @memberof CorIntegration
   */
  createHour(hourData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/hours`;

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'POST',
                data: hourData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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
   * Update a Hour by passing a hour_id and Hour Data
   *
   * @param {Number} hour_id
   * @param {Object} [hourData={}]
   * @returns {Promise}
   * @memberof CorIntegration
   */
  updateHour(hour_id, hourData = {}) {
    return new Promise(async (resolve, reject) => {
      if (this.auth_code) {
        this._getToken()
          .then(async (res) => {
            try {
              const endpoint = `/hours/${hour_id}`;

              const response = await this._sendRequest({
                endpoint: endpoint,
                type: 'PUT',
                data: hourData,
                headers: {
                  Authorization: `Bearer ${JSON.parse(res.body).access_token}`
                }
              })
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