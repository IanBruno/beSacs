const reportQueries = [
    {
        name: '',
        query : 'select C.fecha Cobrado, case when C.TIPO_COBRO=1 then \'Cobro Boleto\'' +
        'when C.TIPO_COBRO=2 then \'Repago Boleto\' ' +
        'when C.TIPO_COBRO=3 then \'Boleto Perdido\' '+
        'when C.TIPO_COBRO=4 then \'Cobro Tarjeta\' '+
        'when C.TIPO_COBRO=5 then \'Fishers\' '+
        'when C.TIPO_COBRO=6 then \'Otros Cobros\' '+
        'else \'No reconocido\' end AS Descripcion, '+
        'T.Nombre Tarifa, C.Equipo_emisor Emisor\, C.Num_Ticket Boleto\, C.COD_TARJ\, C.Importe + ISNULL(Tiempo_DTO\, 0) Total\, C.Importe\, c.IMPUESTOS Impuestos\, c.BASEIMPONIBLE Base\, C.NOTA '+
        'from COBRO as C\, tarifas as T '+
        'where T.IDTarifa = c.ID_TARIFA '+
        'and c.TIPO_COBRO in (1\,2\,3\,4\,5\,6) '+ 
        'and Fecha >= \'@fromDate\' and Fecha <= \'@toDate\''
    },
    {
        name: 'getIncomeByTickets',
        query: 'select \'DOP\' Concepto, substring(c.fecha,1,8) Fecha,'+
        'sum(C.Importe + ISNULL(Tiempo_DTO, 0)) Ingreso,' +
        'DATENAME(DW,CONVERT(datetime, substring(c.fecha,1,8), 103)) Dia' +
        'from COBRO as C '+
        'where c.TIPO_COBRO in (1,2,3,4,5,6)' +
        'and Fecha >= \'@fromDate\' and Fecha <= \'@toDate\' /* Condicion de rango de fechas */'+
        'group by substring(c.fecha,1,8)'+
        'order by substring(c.fecha,1,8)'
    },
    {
        name: 'getGeneratedTickets',
        query : ''
    },{
        name: 'getPensions',
        query: '',
    },
    {
        name: 'getVouchers',
        query: ''
    },
    {
        name: 'getIncomeByPensions',
        query: '' 
    }
];

export default reportQueries;
