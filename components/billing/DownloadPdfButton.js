import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { useGetUserInvoiceHistoryQuery } from '@/app/lib/features/payment/paymentApi';
import { Button } from '@nextui-org/react';

const DownloadPDF = () => {
  const {
    data: InvoiceHistory,
  } = useGetUserInvoiceHistoryQuery(
    {
        page_number: 1,
        per_size: 500,
    }
  );
  
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.text('Invoice Data', 14, 10);

        doc.autoTable({
            startY: 20,
            head: [['Payment Source', 'Invoice ID', 'Invoice Date', 'Invoice Amount']],
            body: InvoiceHistory && InvoiceHistory?.data?.length > 0 && InvoiceHistory?.data?.map(item => [
                item.payment_source,
                item.invoice_id,
                moment(item.invoice_date).format('YYYY-MM-DD'),
                `$${item.invoice_amount}`,
            ]),
            // columnStyles: {
            //     0: { cellWidth: 30 }, // Payment Source
            //     2: { cellWidth: 35 }, // Invoice ID
            //     3: { cellWidth: 45 }, // Invoice Date
            //     4: { cellWidth: 30 }, // Invoice Amount
            // }
        });

        doc.save('invoice_data.pdf');
    };

    return <Button onClick={downloadPdf} className="w-[98px] h-[24px] min-w-unit-0 text-white bg-transparent text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black">
    Download
  </Button> ;

};

export default DownloadPDF;
