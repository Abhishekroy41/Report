import React from 'react';
import { useForm } from 'react-hook-form';
import useSettingsStore from '../../store/useSettingsStore';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function SettingsModal({ isOpen, onClose }) {
  const { unit, setUnit, patientName, setPatientName } = useSettingsStore();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      patientName,
      unit,
    }
  });

  const onSubmit = (data) => {
    setPatientName(data.patientName);
    setUnit(data.unit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient Name</label>
          <input 
            type="text"
            {...register('patientName', { required: true })}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Measurement Unit</label>
          <select 
            {...register('unit')}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="mg/dL">mg/dL (US/India)</option>
            <option value="mmol/L">mmol/L (UK/Canada)</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">Note: Changing units does not automatically convert past readings in the database.</p>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
