import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Modal from '../ui/Modal';
import AddReadingModal from '../../features/readings/AddReadingForm';

export default function AppShell() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-16 md:pb-0 transition-colors relative">
      <Navbar />
      <main className="flex-1 p-4 overflow-y-auto w-full max-w-4xl mx-auto pb-24 md:pb-4">
        <Outlet />
      </main>
      
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Add new reading"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Glucose Reading">
        <AddReadingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <BottomNav />
    </div>
  );
}
