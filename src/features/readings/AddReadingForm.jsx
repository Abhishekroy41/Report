import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm as useReactHookForm } from 'react-hook-form';
import useReadingsStore from '../../store/useReadingsStore';
import useSettingsStore from '../../store/useSettingsStore';
import { getGlucoseStatus } from '../../utils/glucoseHelpers';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AddReadingModal({ isOpen, onClose }) {
  const addReading = useReadingsStore((state) => state.addReading);
  const { unit } = useSettingsStore();
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useReactHookForm({
    defaultValues: {
      value: '',
      type: 'random',
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      notes: ''
    }
  });

  const watchValue = watch('value');
  const watchType = watch('type');
  const currentStatus = watchValue ? getGlucoseStatus(Number(watchValue), watchType) : 'unknown';

  const onSubmit = (data) => {
    addReading({
      ...data,
      value: Number(data.value),
      status: currentStatus,
      unit, // Store the unit it was recorded in
      createdAt: new Date().toISOString()
    });
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Glucose Value ({unit})</label>
          <div className="relative">
            <input 
              type="number"
              step="0.1"
              {...register('value', { required: 'Required', min: 10, max: 1000 })}
              className="w-full text-3xl font-bold p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              placeholder="120"
            />
            {watchValue && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge status={currentStatus} />
              </div>
            )}
          </div>
          {errors.value && <p className="text-red-500 text-xs">{errors.value.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reading Type</label>
        <select 
          {...register('type')}
          className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
        >
          <option value="fasting">Fasting (Before Meal)</option>
          <option value="postMeal">Post-Meal (2h after eating)</option>
          <option value="random">Random / Anytime</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date & Time</label>
        <input 
          type="datetime-local"
          {...register('timestamp', { required: true })}
          className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes (Optional)</label>
        <textarea 
          {...register('notes')}
          rows="2"
          placeholder="e.g. Felt dizzy, ate a big meal..."
          className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
        />
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1">Save Reading</Button>
      </div>
    </form>
  );
}
