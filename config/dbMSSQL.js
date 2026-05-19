const configMSSQL = {
    server: '192.168.1.145',
    database: 'genesis',
    authentication: {
        options: {
            userName: 'GenConsulta',
            password: 'gone123'
        }
    },
    options: {
        trustServerCertificate: true
    }
};

export default configMSSQL;