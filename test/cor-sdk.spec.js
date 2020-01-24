'use strict'

/*
 * adonis-cor-sdk
 *
 * (c) Daniel Guzman <daniel@projectcor.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { Config } = require('@adonisjs/sink')
const CorIntegration = require('../src/CorIntegration')
const chalk = require('chalk')

const auth_code = 'hd2LZ2YHHT2zE8Fh9qebSJfrzU7525Gz85xhkN4eMt6cD8kadzukUvbtg4hT4kMT';
const trusted_origin = 'https://advcor-interconexion-test.azurewebsites.net'

test.group('CorIntegration TESTING', () => {
    test('Should check the server availability', async (assert) => {
        let result = null;
        const cor = await new CorIntegration(Config)
        
        console.log('')
        console.log('\x1b[36m%s\x1b[0m', '***********************************')
        console.log('\x1b[36m%s\x1b[0m', '                                  ')
        console.log('\x1b[36m%s\x1b[0m', `  ENV:   ${cor.env}               `)
        console.log('\x1b[36m%s\x1b[0m', `  URL:   ${cor.currentURL}        `)
        console.log('\x1b[36m%s\x1b[0m', '                                  ')
        console.log('\x1b[36m%s\x1b[0m', '************************************')
        
        await cor.checkService()
        .then((res) => {
            result = res;
        })
        .catch((err) => {
            result = err;
            console.log('\x1b[31m%s\x1b[0m',`Error:  ${err.response.body}`)
        })
        assert.equal(result.statusCode,200)
    })

    test('Should throw an error creating an user without an Authorization code', async (assert) => {
        const userData = {
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // ERP User ID,
            first_name: "TEST", // Required,
            last_name: "TESTER", // Required,
            email: 'test3@mail.com', // Required // Unique,
            phone: '+549 1111111111',
            company_id: '900', // ERP Company ID
            cuil: '111111111111', // User tax id,
            salary: 56,
            timezone: 'UTC', // default ‘UTC’,
            role_id: 4, // 1: C-level, 2: Director, 3: Project Manager, 4: Collaborator, 5: Freelancer 
        }

        let result = null;
        const cor = await new CorIntegration(Config)
        
        await cor.createUser(userData)
            .then((res) => {
                result = res
            })
            .catch((err) => {
                result = err
            })
            assert.ok(result instanceof Error)
        
    })

    test('Should receive a new access_token', async (assert) => {
        let result = null;
        const cor = await new CorIntegration(Config)

        cor.auth_code = auth_code
        cor.origin = trusted_origin;
        await cor._getToken()
            .then((res) => {
                result = res
            })
            .catch((err) => {
                result = err
                if (err.response != undefined){
                    console.log(chalk.red(`${err.response.body}`))
                }else{
                    console.log(chalk.red(`\t${err}`))
                }
            })
        assert.equal(result.statusCode,200)
        
    })

    test('Should send a request to any valid endpoint', async (assert) => {
        let result = null;
        const cor = await new CorIntegration(Config)

        await cor._sendRequest({
            endpoint: "/",
            type: "GET"
        }).then(res => {
            result = res
        }).catch(err => {
            console.log('\x1b[31m%s\x1b[0m', err)
            result = err
        })

        assert.equal(result.statusCode,200)

    })

    test.skip('Should return an error when a request is sent without an origin', async (assert) => {
        let result = null;
        const cor = await new CorIntegration(Config)
        cor.auth_code = auth_code

        await cor._getToken()
        .then(res => {
            result = res
        })
        .catch(err => {
            result = err
        })

        assert.ok(result instanceof Error)

    })

    test.skip('Should create an user', async (assert) => {
        const userData = {
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // ERP User ID,
            first_name: "TEST", // Required,
            last_name: "TESTER", // Required,
            email: `${Math.random().toString(36).substring(2, 15)}@mail.com`, // Required // Unique,
            phone: '+549 1111111111',
            company_id: '900', // ERP Company ID
            cuil: '111111111111', // User tax id,
            salary: 56,
            timezone: 'UTC', // default ‘UTC’,
            role_id: 4, // 1: C-level, 2: Director, 3: Project Manager, 4: Collaborator, 5: Freelancer 
        }

        let result = null;
        const cor = await new CorIntegration(Config)

        cor.auth_code = auth_code
        
        await cor.createUser(userData)
            .then((res) => {
                result = res
            })
            .catch((err) => {
                result = err
                console.log('\x1b[31m%s\x1b[0m', err.response.body)
            })
            assert.equal(result.statusCode,200)
        
    })

    test.skip('Should update an user', async (assert) => {
        const userData = {
            id: '65', // ERP User ID,
            first_name: "TEST", // Required,
            last_name: "TESTER UPDATED", // Required,
            email: 'test@mail.com', // Required // Unique,
            password: '123456',
            password_confirm: '123456',
            phone: '+549 1111111111',
            company_id: '900', // ERP Company ID
            cuil: '111111111111', // User tax id,
            salary: 56,
            timezone: 'UTC', // default ‘UTC’,
            role_id: 3, // 1: C-level, 2: Director, 3: Project Manager, 4: Collaborator, 5: Freelancer 
        }

        let result = null;
        const cor = await new CorIntegration(Config)

        cor.auth_code = auth_code
        cor.origin = trusted_origin;
        
        await cor.updateUser(2271, userData)
            .then((res) => {
                result = res
            })
            .catch((err) => {
                result = err
                console.log('\x1b[31m%s\x1b[0m', err.response.body)
            })

        assert.equal(result.statusCode,200)
        
    })

    test.skip('Should create a client', async (assert) => {
        const clientData = {
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // ERP User ID,
            name: 'Client for testing purpose', // nombre del cliente // Required // Unique
            address: 'USA', // dirección del cliente
            description: 'A testing client', // descripción del cliente
            country: 'USA', // país del cliente
            city: 'Sillicon Valey', // ciudad del cliente
            state: 'CA' // estado del cliente
        }

        let result = null;
        const cor = await new CorIntegration(Config)

        cor.auth_code = auth_code
        
        await cor.createClient(clientData)
            .then((res) => {
                result = res
            })
            .catch((err) => {
                result = err
                console.log('\x1b[31m%s\x1b[0m', err.response.body)
            })
            assert.equal(result.statusCode,200)
        
    })
    test.skip('Should create a Project', async (assert) => {
        const projectData = { "id": "005362", "client_id": "DAN", "brand_id": null, "product_id": "00", "fee_id": 0, "name": "ADV_SCRIPT_1", "start": "2019-08-23T00:00:00", "end": "0001-01-01T00:00:00", "currency": null, "brief": null, "frequency": 0, "estimated_time": 0, "id_externo": "005362" }

        let result = null;
        const cor = await new CorIntegration(Config)

        cor.auth_code = auth_code
        
        await cor.createProject(projectData)
            .then((res) => {
                result = res
            })
            .catch((err) => {
                result = err
                console.log('\x1b[31m%s\x1b[0m', err.response.body)
            })
            assert.equal(result.statusCode,200)
        
    })
})