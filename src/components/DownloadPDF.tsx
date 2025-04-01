
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download } from 'lucide-react';
import { 
  jsPDF 
} from 'jspdf';
import 'jspdf-autotable';

// Need to extend jsPDF to use autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SalesData {
  label: string;
  value: number;
}

interface DownloadPDFProps {
  forecastData: SalesData[];
  initialSales: number;
  growthRate: number;
  timeframe: number;
  totalForecast: number;
  formatCurrency: (value: number) => string;
}

export const DownloadPDF: React.FC<DownloadPDFProps> = ({ 
  forecastData,
  initialSales,
  growthRate,
  timeframe,
  totalForecast,
  formatCurrency
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add report title
      doc.setFontSize(22);
      doc.setTextColor(36, 94, 79); // #245e4f
      doc.text('Sales Forecast Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add company branding
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51); // #333333
      doc.text('SaleSage Forecasting Solutions', pageWidth / 2, 30, { align: 'center' });
      
      // Add date
      const today = new Date();
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${today.toLocaleDateString('en-IN')}`, pageWidth / 2, 38, { align: 'center' });
      
      // Add horizontal line
      doc.setDrawColor(122, 201, 167); // #7ac9a7
      doc.setLineWidth(0.5);
      doc.line(20, 42, pageWidth - 20, 42);
      
      // Add forecast parameters
      doc.setFontSize(14);
      doc.setTextColor(36, 94, 79); // #245e4f
      doc.text('Forecast Parameters', 20, 55);
      
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51); // #333333
      doc.text(`Initial Monthly Sales: ${formatCurrency(initialSales)}`, 25, 65);
      doc.text(`Monthly Growth Rate: ${growthRate}%`, 25, 72);
      doc.text(`Forecast Period: ${timeframe} months`, 25, 79);
      
      // Add forecast summary
      doc.setFontSize(14);
      doc.setTextColor(36, 94, 79); // #245e4f
      doc.text('Forecast Summary', 20, 95);
      
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51); // #333333
      doc.text(`Total Projected Sales (${timeframe} months): ${formatCurrency(totalForecast)}`, 25, 105);
      doc.text(`Average Monthly Sales: ${formatCurrency(totalForecast / timeframe)}`, 25, 112);
      
      // Create table data
      const tableColumn = ["Period", "Forecasted Sales (₹)", "Monthly Growth"];
      const tableRows = forecastData.map(item => [
        item.label,
        Math.round(item.value).toLocaleString('en-IN'),
        `${growthRate}%`
      ]);
      
      // Add forecast table
      doc.setFontSize(14);
      doc.setTextColor(36, 94, 79); // #245e4f
      doc.text('Monthly Forecast Breakdown', 20, 125);
      
      // Add the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 130,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { 
          fillColor: [36, 94, 79],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 130 }
      });
      
      // Add footer
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('DISCLAIMER:', 20, finalY);
      doc.setFontSize(8);
      doc.text(
        'This forecast is based on the provided inputs and should be used as an estimation tool only. ' +
        'Actual results may vary based on market conditions, competition, and other factors.',
        20, finalY + 5, { maxWidth: pageWidth - 40 }
      );
      
      // Add contact information
      doc.setFontSize(9);
      doc.setTextColor(36, 94, 79); // #245e4f
      doc.text(
        'For more information, visit www.salesage-calculator.in',
        pageWidth / 2, finalY + 15, { align: 'center' }
      );
      
      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`, 
          pageWidth - 20, 
          doc.internal.pageSize.getHeight() - 10, 
          { align: 'right' }
        );
      }
      
      // Save the PDF
      const filename = `Sales_Forecast_${today.toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast({
        title: "PDF Generated Successfully",
        description: `Your forecast has been downloaded as ${filename}`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button 
      onClick={generatePDF} 
      variant="outline"
      className="flex items-center bg-sage-accent text-sage-text border-sage-accent hover:bg-sage-accent/90"
      disabled={isGenerating}
    >
      <Download className="h-4 w-4 mr-2" />
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </Button>
  );
};
