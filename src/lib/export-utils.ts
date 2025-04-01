
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SalesData {
  label: string;
  value: number;
}

export const generatePDF = (
  forecastData: SalesData[], 
  initialSales: number, 
  growthRate: number, 
  timeframe: number, 
  totalForecast: number, 
  formatCurrency: (value: number) => string
): jsPDF => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(36, 94, 79); // #245e4f in RGB
  doc.text('Sales Forecast Report', 105, 20, { align: 'center' });
  
  // Add company info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Generated with Sales Forecast Calculator', 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
  
  // Add summary
  doc.setFontSize(12);
  doc.setTextColor(36, 94, 79);
  doc.text('Forecast Summary', 20, 50);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Add parameters
  doc.text(`Initial Monthly Sales: ${formatCurrency(initialSales)}`, 20, 60);
  doc.text(`Monthly Growth Rate: ${growthRate}%`, 20, 67);
  doc.text(`Forecast Period: ${timeframe} months`, 20, 74);
  doc.text(`Total Projected Sales: ${formatCurrency(totalForecast)}`, 20, 81);
  
  // Add table
  const tableData = forecastData.map(item => [
    item.label,
    formatCurrency(item.value),
    `${growthRate >= 0 ? '+' : ''}${growthRate}%`
  ]);
  
  autoTable(doc, {
    head: [['Period', 'Projected Sales', 'Growth Rate']],
    body: tableData,
    startY: 90,
    theme: 'striped',
    headStyles: { 
      fillColor: [36, 94, 79],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 248, 244]
    }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text('© Sales Forecast Calculator. All rights reserved.', 105, doc.internal.pageSize.height - 5, { align: 'center' });
  }
  
  return doc;
};
