
import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PATIENTS } from '../constants';
import { Patient, VitalStatus } from '../types';
import Chatbot from '../components/Chatbot';
import Button from '../components/ui/Button';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<VitalStatus | 'all'>('all');

  const cohort = useMemo(() => PATIENTS.filter(p => p.doctorId === user?.id), [user?.id]);

  const filteredCohort = useMemo(() => {
    return cohort
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .filter(p => statusFilter === 'all' || p.status === statusFilter);
  }, [cohort, filter, statusFilter]);
  
  const handleExport = () => {
      alert("A CSV report of the current patient cohort has been generated.");
  };

  const getStatusColor = (status: VitalStatus) => ({
      [VitalStatus.Normal]: 'text-status-green',
      [VitalStatus.Warning]: 'text-status-amber',
      [VitalStatus.Critical]: 'text-status-red font-bold',
  }[status]);

  return (
    <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-white">Patient Cohort Matrix</h2>
             <Button onClick={handleExport}>Export Report</Button>
        </div>
      
        <div className="mb-6 p-4 bg-brand-dark-accent rounded-lg flex flex-col md:flex-row gap-4 items-center">
            <input
                type="text"
                placeholder="Filter by patient name..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full md:w-1/3 bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as VitalStatus | 'all')}
                className="w-full md:w-1/3 bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
                <option value="all">All Statuses</option>
                <option value={VitalStatus.Normal}>Normal</option>
                <option value={VitalStatus.Warning}>Warning</option>
                <option value={VitalStatus.Critical}>Critical</option>
            </select>
        </div>

        <div className="bg-brand-dark-accent rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-brand-dark">
                    <tr>
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Age</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Location</th>
                        <th className="p-4 font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCohort.length > 0 ? filteredCohort.map((patient, index) => (
                        <tr key={patient.id} className={`border-t border-gray-700 ${index % 2 === 1 ? 'bg-black/20' : ''}`}>
                        <td className="p-4">{patient.name}</td>
                        <td className="p-4">{patient.age}</td>
                        <td className={`p-4 font-semibold ${getStatusColor(patient.status)}`}>{patient.status}</td>
                        <td className="p-4 text-gray-400">{patient.location}</td>
                        <td className="p-4">
                            <Button variant="secondary" size="sm" onClick={() => alert(`Viewing details for ${patient.name}`)}>
                                View Details
                            </Button>
                        </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center p-8 text-gray-400">
                                No patients match the current filters.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
      <Chatbot />
    </div>
  );
};

export default DoctorDashboard;
