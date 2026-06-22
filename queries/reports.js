const reportQueries = [
    {
        name: 'getIncomeByTickets',
        query: `SELECT
                'DOP' AS Concepto,
                SUBSTRING(c.fecha,1,8) AS Fecha,
                SUM(C.Importe + ISNULL(Tiempo_DTO,0)) AS Ingreso,
                DATENAME(DW, CONVERT(datetime, SUBSTRING(c.fecha,1,8), 103)) AS Dia
            FROM COBRO AS C
            WHERE c.TIPO_COBRO IN (1,2,3,4,5,6)
            AND Fecha >= @fromDate
            AND Fecha <= @toDate
            GROUP BY
                SUBSTRING(c.fecha,1,8),
                DATENAME(DW, CONVERT(datetime, SUBSTRING(c.fecha,1,8), 103))
            ORDER BY SUBSTRING(c.fecha,1,8)`
    },
    {
        name: 'getIncomeByPensions',
        query: `
            SELECT
                tp.NOMBRE AS TipoPension,
                t.COD_TARJ AS Tarjeta,
                t.TITULAR,
                t.MATRICULA1,
                t.MATRICULA_ACT AS Dato1,
                t.MATRICULA_LM AS Dato2,
                p.Monto AS Pago,
                p.RefBancaria,
                p.FechaPago,
                DATENAME(
                    DW,
                    CONVERT(datetime, SUBSTRING(p.FechaPago,1,8), 103)
                ) AS Dia
            FROM PagoPensionTransferencias AS p
            INNER JOIN TARJ_ABONO AS t
                ON p.COD_TARJETA = t.COD_TARJ
            INNER JOIN TIPO_ABONO AS tp
                ON t.COD_ABONO = tp.COD_TIPO_ABN
            WHERE
                p.FechaPago >= @fromDate
                AND p.FechaPago <= @toDate
        `
    },
    {
        name: 'getIncomeByVouchers',
        query: `
            SELECT
                v.Nombre AS Vale,
                u.comprador,
                u.costo,
                SUM(u.numero) AS Vendidos,
                (u.costo * SUM(u.numero)) AS Total,
                u.observaciones
            FROM VentaVales AS u
            INNER JOIN Vale AS v
                ON v.IdTipoVale = u.IdTipoVale
            WHERE
                u.Fecha >= @fromDate
                AND u.Fecha <= @toDate
            GROUP BY
                v.Nombre,
                u.comprador,
                u.costo,
                u.observaciones,
                u.IdVentaVales
        `
    },
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

const generalQuery = [
    {
        name : 'generalReport',
        query : `select 'BOLETOS' Concepto, substring(c.fecha,1,6) Mes,
            sum(C.Importe + ISNULL(Tiempo_DTO, 0)) Ingreso
            from COBRO as C
            where c.TIPO_COBRO in (1,2,3,4,5,6)
            and substring(c.fecha,1,6) = '@year@month' /* Condicion de Fecha/Mes */
            group by substring(c.fecha,1,6)

            /* GENERAL Vales */
            Union

            select 'VALES' Concepto, substring(Fecha,1,6) Mes,
            sum(costo * Numero) Ingreso
            from VentaVales
            where substring(Fecha,1,6) = '@year@month' /* Condicion de Fecha/Mes */
            group by substring(Fecha,1,6)

            /* GENERAL PENSIONES */
            Union

            select 'PENSIONES' Concepto, substring(p.FechaPago,1,6) Mes,
            sum(p.Monto) Ingreso
            from PagoPensionTransferencias p
            where substring(p.FechaPago,1,6) = '@year@month' /* Condicion de Fecha/Mes */
            group by substring(p.FechaPago,1,6)
            `
    }
]

export default reportQueries;
