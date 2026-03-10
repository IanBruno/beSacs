const configMSSQL = {
    server: '192.168.1.100',
    database: 'genesis',
    authentication: {
        options: {
            userName: 'bruno',
            password: 'bruno'
        }
    },
    options: {
        trustServerCertificate: true
    }
};

export default configMSSQL;