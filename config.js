export default {
    development: {
        axios: {
            baseURL: 'http://inaia-api-auth/api/v1'
            // baseURL: 'https://auth-staging.inaia.cloud/api/v1'
        },
        env: {
            devMode: true,
            universalLogin: 'http://localhost:3000',
            dashboardPath: '/dashboard',
            quandlApiOn: true,
            s3BucketUri: 'https://s3.eu-central-1.amazonaws.com/staging-storage.inaia.cloud/',
            // s3BucketUri: 'https://staging-storage.inaia.cloud.s3.amazonaws.com/',

            productApiUrl: 'http://inaia-api-auth/api/v1',
            // productApiUrl: 'http://inaia-api-products/api/v1',
            golddinarApiUrl: 'http://inaia-api-golddinar/api/v1',
            paymentsApiUrl: 'http://inaia-api-payment/api/v1',
            bankingApiUrl: 'http://inaia-api-banking/api/v1',

            entryPoints: {
                crm: 'http://localhost:3001',
                admin: 'http://localhost:3002',
                golddinar: 'http://localhost:3003',
                accounting: 'http://localhost:3005'
            }
        },
        server: {
            // for check in mbl device
            port: 3001, // default: 3000
            host: '0.0.0.0', // default: localhost
        }
    },


    local: {
        axios: {
            // baseURL: 'http://inaia-api-auth/api/v1'
            // baseURL: 'https://auth-staging.inaia.cloud/api/v1'
            baseURL: 'https://core-staging.inaia.cloud/api/v1'
        },
        env: {
            devMode: true,
            universalLogin: 'http://localhost:3000',
            dashboardPath: '/dashboard',
            quandlApiOn: true,
            s3BucketUri: 'https://s3.eu-central-1.amazonaws.com/staging-storage.inaia.cloud/',
            // s3BucketUri: 'https://staging-storage.inaia.cloud.s3.amazonaws.com/',

            productApiUrl: 'https://core-staging.inaia.cloud/api/v1',
            // productApiUrl: 'https://products-staging.inaia.cloud/api/v1',
            golddinarApiUrl: 'https://golddinar-api-staging.inaia.cloud/api/v1',
            paymentsApiUrl: 'https://payments-api-staging.inaia.cloud/api/v1',
            bankingApiUrl: 'https://banking-staging.inaia.cloud/api/v1',
            entryPoints: {
                crm: 'http://localhost:3001',
                admin: 'http://localhost:3002',
                golddinar: 'http://localhost:3003',
                accounting: 'http://localhost:3005'
            }
        },
        server: {
            // for check in mbl device
            port: 3001, // default: 3000
            host: '0.0.0.0', // default: localhost
        }
    },


    staging: {
        axios: {
            //baseURL: 'https://core-staging.inaia.cloud/api/v1'
            baseURL: 'http://localhost/api/v1'
        },
        env: {
            universalLogin: 'https://login-staging.inaia.cloud',
            dashboardPath: '/dashboard',
            quandlApiOn: true,
            s3BucketUri: 'https://s3.eu-central-1.amazonaws.com/staging-storage.inaia.cloud/',
            // s3BucketUri: 'https://staging-storage.inaia.cloud.s3.amazonaws.com/',

            //productApiUrl: 'https://core-staging.inaia.cloud/api/v1',
            //golddinarApiUrl: 'https://golddinar-api-staging.inaia.cloud/api/v1',
            golddinarApiUrl: 'http://localhost:8080/api/v1',
            //paymentsApiUrl: 'https://payments-api-staging.inaia.cloud/api/v1',
            //bankingApiUrl: 'https://banking-staging.inaia.cloud/api/v1',
            entryPoints: {
                crm: 'https://crm-staging.inaia.cloud',
                admin: 'https://admin-staging.inaia.cloud',
                golddinar: 'https://golddinar-admin-staging.inaia.cloud',
                accounting: 'https://accounting-staging.inaia.cloud'
            }
        },
        server: {
            // for check in mbl device
            port: 3001, // default: 3000
            host: '0.0.0.0', // default: localhost
        }
    },


    production: {
        axios: {
            // baseURL: 'https://auth.api.inaia.cloud/api/v1'
            baseURL: 'https://core.api.inaia.cloud/api/v1'
        },
        env: {
            universalLogin: 'https://login.inaia.cloud',
            dashboardPath: '/dashboard',
            quandlApiOn: true,
            s3BucketUri: 'https://s3.eu-central-1.amazonaws.com/storage.inaia.cloud/',
            // s3BucketUri: 'https://storage.inaia.cloud.s3.amazonaws.com/',

            // productApiUrl: 'https://auth.api.inaia.cloud/api/v1',
            productApiUrl: 'https://core.api.inaia.cloud/api/v1',
            golddinarApiUrl: 'https://golddinar.api.inaia.cloud/api/v1',

            entryPoints: {
                crm: 'https://crm.inaia.cloud',
                admin: 'https://admin.inaia.cloud',
                golddinar: 'https://golddinar-admin.inaia.cloud',
                accounting: 'https://accounting.inaia.cloud'
            }
        },
        server: {
            // for check in mbl device
            port: 3001, // default: 3000
            host: '0.0.0.0', // default: localhost
        }
    }
}
