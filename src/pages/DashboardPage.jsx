import React from 'react';
import { Activity, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import useReadingsStore from '../store/useReadingsStore';
import useSettingsStore from '../store/useSettingsStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateHelpers';

export default function DashboardPage() {
  const readings = useReadingsStore(state => state.readings);
  const { unit, patientName } = useSettingsStore();

  const latestReading = readings[0];
  
  // Calculate today's average
  const today = new Date().toISOString().split('T')[0];
  const todaysReadings = readings.filter(r => r.timestamp.startsWith(today));
  const todayAvg = todaysReadings.length 
    ? Math.round(todaysReadings.reduce((sum, r) => sum + r.value, 0) / todaysReadings.length) 
    : 0;

  // Streak calculation (days in a row with at least 1 reading)
  let streak = 0;
  let currentDate = new Date();
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (readings.some(r => r.timestamp.startsWith(dateStr))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {patientName} 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your glucose summary.</p>
      </header>

      {/* Hero: Latest Reading */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white p-6 shadow-blue-500/20 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-blue-100 font-medium">
            <Activity className="w-5 h-5" />
            <span>Latest Reading</span>
          </div>
          {latestReading && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              {latestReading.type === 'fasting' ? 'Fasting' : latestReading.type === 'postMeal' ? 'Post-Meal' : 'Random'}
            </div>
          )}
        </div>
        
        {latestReading ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{latestReading.value}</span>
              <span className="text-blue-200 text-lg">{unit}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-blue-100">
              <Badge status={latestReading.status} className="bg-white/10 text-white border-white/20" />
              <span>{formatDisplayDate(latestReading.timestamp)} at {formatDisplayTime(latestReading.timestamp)}</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-blue-100">
            <p>No readings yet. Tap the + button to add one.</p>
          </div>
        )}
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col justify-center items-center text-center">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Today's Avg</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {todayAvg > 0 ? `${todayAvg} ${unit}` : '-'}
          </p>
        </Card>

        <Card className="p-4 flex flex-col justify-center items-center text-center">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tracking Streak</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {streak} {streak === 1 ? 'day' : 'days'}
          </p>
        </Card>
      </div>
      
      {/* Recent Activity Mini-List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {readings.slice(1, 4).map(reading => (
            <Card key={reading.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${
                  reading.status === 'normal' ? 'bg-green-500' : 
                  reading.status === 'high' ? 'bg-red-500' : 
                  reading.status === 'prediab' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                    {reading.value} <span className="text-xs font-normal text-slate-500">{unit}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDisplayDate(reading.timestamp)} • {formatDisplayTime(reading.timestamp)}
                  </p>
                </div>
              </div>
              <Badge status={reading.status} />
            </Card>
          ))}
          {readings.length <= 1 && (
             <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500">
               No recent history to display
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
