import React, { useState } from 'react';
import useReadingsStore from '../store/useReadingsStore';
import useSettingsStore from '../store/useSettingsStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDisplayDate, formatDisplayTime, groupReadingsByDate } from '../utils/dateHelpers';
import { Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const readings = useReadingsStore(state => state.readings);
  const deleteReading = useReadingsStore(state => state.deleteReading);
  const { unit } = useSettingsStore();

  const [filterType, setFilterType] = useState('all');

  const filteredReadings = readings.filter(r => filterType === 'all' || r.type === filterType);
  const groupedReadings = groupReadingsByDate(filteredReadings);
  const dates = Object.keys(groupedReadings).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History log</h1>
        
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Readings</option>
          <option value="fasting">Fasting</option>
          <option value="postMeal">Post-Meal</option>
          <option value="random">Random</option>
        </select>
      </div>

      {dates.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No readings found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map(dateStr => (
            <div key={dateStr} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider sticky top-16 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm py-2 z-10">
                {formatDisplayDate(dateStr)}
              </h3>
              <div className="space-y-2">
                {groupedReadings[dateStr].map(reading => (
                  <Card key={reading.id} className="p-4 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center w-16 shrink-0">
                        <span className="text-xs text-slate-400 font-medium block">
                          {formatDisplayTime(reading.timestamp)}
                        </span>
                      </div>
                      <div className={`w-1 h-12 rounded-full ${
                        reading.status === 'normal' ? 'bg-green-500' : 
                        reading.status === 'high' ? 'bg-red-500' : 
                        reading.status === 'prediab' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                          {reading.value} <span className="text-xs text-slate-500 font-normal">{unit}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {reading.type === 'fasting' ? 'Fasting' : reading.type === 'postMeal' ? 'Post-Meal' : 'Random'}
                          {reading.notes && ` • ${reading.notes}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={reading.status} />
                      <button 
                        onClick={() => deleteReading(reading.id)}
                        className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete reading"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
