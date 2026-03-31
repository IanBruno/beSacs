const reportQueries = {
    getFirstReport : 'select C.fecha Cobrado, case when C.TIPO_COBRO=1 then \'Cobro Boleto\'' +
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
        'and Fecha >= \'20200201000000\' and Fecha <= \'20260227235959\''
};

export default reportQueries;
