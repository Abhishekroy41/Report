import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import useReadingsStore from '../store/useReadingsStore';
import useSettingsStore from '../store/useSettingsStore';
import Card from '../components/ui/Card';
import { format, parseISO, subDays } from 'date-fns';

export default function TrendsPage() {
  const readings = useReadingsStore(state => state.readings);
  const { unit } = useSettingsStore();
  const [days, setDays] = useState(7);

  const chartData = useMemo(() => {
    const cutoffDate = subDays(new Date(), days);
    
    // Sort ascending for chart (left to right)
    const recentReadings = readings
      .filter(r => new Date(r.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return recentReadings.map(r => ({
      ...r,
      displayDate: format(parseISO(r.timestamp), 'MMM d, HH:mm'),
    }));
  }, [readings, days]);

  const targetHigh = unit === 'mg/dL' ? 140 : 7.8;
  const targetLow = unit === 'mg/dL' ? 70 : 3.9;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trends</h1>
        
        <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                days === d 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      <Card className="flex-1 p-4 min-h-[400px] flex flex-col">
        {chartData.length >= 2 ? (
          <div className="flex-1 w-full h-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickMargin={10}
                  minTickGap={30}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <ReferenceLine y={targetHigh} stroke="#f87171" strokeDasharray="3 3" label={{ position: 'top', value: 'High', fill: '#f87171', fontSize: 10 }} />
                <ReferenceLine y={targetLow} stroke="#60a5fa" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Low', fill: '#60a5fa', fontSize: 10 }} />
                
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name={`Glucose (${unit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Need at least 2 readings in this time period to show a trend line.
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <Card className="p-3">
          <p className="text-xs text-slate-500 mb-1">Time in Target</p>
          <p className="text-xl font-bold text-green-500">
            {chartData.length 
              ? Math.round((chartData.filter(r => r.status === 'normal').length / chartData.length) * 100) 
              : 0}%
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-slate-500 mb-1">Highest</p>
          <p className="text-xl font-bold text-red-500">
            {chartData.length ? Math.max(...chartData.map(r => r.value)) : '-'}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-slate-500 mb-1">Lowest</p>
          <p className="text-xl font-bold text-blue-500">
            {chartData.length ? Math.min(...chartData.map(r => r.value)) : '-'}
          </p>
        </Card>
      </div>
    </div>
  );
}
