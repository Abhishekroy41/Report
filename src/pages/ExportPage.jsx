import React from 'react';
import useReadingsStore from '../store/useReadingsStore';
import useSettingsStore from '../store/useSettingsStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download, Printer } from 'lucide-react';
import { format } from 'date-fns';

export default function ExportPage() {
  const readings = useReadingsStore(state => state.readings);
  const { patientName, unit } = useSettingsStore();

  const handleExportCSV = () => {
    if (readings.length === 0) return alert("No data to export");
    
    // Headers
    const headers = ['Date', 'Time', `Value (${unit})`, 'Type', 'Status', 'Notes'];
    
    // Rows
    const rows = readings.map(r => {
      const dateObj = new Date(r.timestamp);
      return [
        format(dateObj, 'yyyy-MM-dd'),
        format(dateObj, 'HH:mm'),
        r.value,
        r.type,
        r.status,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${patientName}_Glucose_Log_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Export & Report</h1>
      <p className="text-slate-600 dark:text-slate-400">Download your data to share with your healthcare provider.</p>

      <div className="grid gap-4 sm:grid-cols-2 mt-8">
        <Card className="p-6 flex flex-col items-center text-center hover:border-blue-300 transition-colors">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <Download className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Spreadsheet (CSV)</h3>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Download a raw data file that can be opened in Excel, Google Sheets, or Apple Numbers.
          </p>
          <Button onClick={handleExportCSV} className="w-full" disabled={readings.length === 0}>
            Download CSV
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:border-blue-300 transition-colors">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <Printer className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Print Report</h3>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Generate a clean, printer-friendly summary of your latest readings and trends.
          </p>
          <Button onClick={handlePrint} variant="outline" className="w-full">
            Print Page
          </Button>
        </Card>
      </div>

      {/* Print-only View Component */}
      <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8">
        <h1 className="text-3xl font-bold mb-2">Glucose Report: {patientName}</h1>
        <p className="text-gray-500 mb-8">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-2">Date & Time</th>
              <th className="py-2">Value ({unit})</th>
              <th className="py-2">Type</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {readings.slice(0, 30).map(r => (
              <tr key={r.id} className="border-b border-gray-200">
                <td className="py-2">{format(new Date(r.timestamp), 'MMM d, yyyy h:mm a')}</td>
                <td className="py-2 font-bold">{r.value}</td>
                <td className="py-2 capitalize">{r.type.replace(/([A-Z])/g, ' $1').trim()}</td>
                <td className="py-2 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-gray-500 text-center">Showing up to 30 most recent readings</p>
      </div>
    </div>
  );
}
