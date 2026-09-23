import { FileSpreadsheet, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { formatCurrency } from '../../utils/formatters';

const sampleData = [
  { metric: 'Total spend', value: '$2.4M' },
  { metric: 'On-time delivery', value: '94.2%' },
  { metric: 'High risk suppliers', value: '2' },
  { metric: 'Inventory alerts', value: '5' },
];

export default function ExportActions() {
  const exportPdf = async () => {
    const element = document.getElementById('dashboard-report');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pageHeight - 30));
    pdf.save('procurement-dashboard-report.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData.map((row) => ({
      Metric: row.metric,
      Value: row.value,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard Summary');
    XLSX.writeFile(workbook, 'procurement-dashboard-report.xlsx');
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        aria-label="Export dashboard as PDF"
        onClick={exportPdf}
        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_32px_rgba(74,144,226,0.2)] transition hover:bg-sky-600"
      >
        <FileText size={16} />
        Export PDF
      </button>

      <button
        aria-label="Export dashboard as Excel"
        onClick={exportExcel}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_32px_rgba(43,187,173,0.2)] transition hover:bg-emerald-600"
      >
        <FileSpreadsheet size={16} />
        Export Excel
      </button>

      <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
        Spend: {formatCurrency(2400000)}
      </div>
    </div>
  );
}
