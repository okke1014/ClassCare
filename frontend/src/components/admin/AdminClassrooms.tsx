"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Plus, MapPin, Wrench, X, Hash, Building } from "lucide-react";
import { MOCK_ROOMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const FLOORS = ['1F', '2F', '3F', '4F', '5F'];

export function AdminClassrooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    floor: '1F',
    status: 'active' as 'active' | 'maintenance',
  });

  const filteredClassrooms = MOCK_ROOMS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.floor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const maintenanceCount = MOCK_ROOMS.filter(r => r.status === 'maintenance').length;

  return (
    <div className="h-full flex flex-col">
      {/* Search & Add - Fixed Header */}
      <div className="p-4 bg-white border-b shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search rooms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shrink-0 hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filterStatus === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({MOCK_ROOMS.length})
          </button>
          <button 
            onClick={() => setFilterStatus('active')}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filterStatus === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Active ({MOCK_ROOMS.length - maintenanceCount})
          </button>
          <button 
            onClick={() => setFilterStatus('maintenance')}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filterStatus === 'maintenance' 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            Maintenance ({maintenanceCount})
          </button>
        </div>
      </div>

      {/* Classroom List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {filteredClassrooms.map(room => {
            const isActive = room.status === 'active';
            
            return (
              <div 
                key={room.id} 
                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                  !isActive ? 'bg-orange-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Status Icon */}
                  {isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-green-500" />
                  ) : (
                    <Wrench size={14} className="text-orange-500 shrink-0" />
                  )}
                  
                  <div>
                    <h3 className="font-medium text-sm">{room.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={10} />
                      <span>{room.floor}</span>
                      <span className="mx-1">•</span>
                      <span className={isActive ? 'text-green-600' : 'text-orange-600'}>
                        {isActive ? 'Active' : 'Maintenance'}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* Add Classroom Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Building size={20} className="text-primary" />
                Add New Room
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Room Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. 301 H"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    Floor
                  </span>
                </label>
                <div className="flex gap-2">
                  {FLOORS.map(floor => (
                    <button
                      key={floor}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, floor }))}
                      className={cn(
                        "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all border-2",
                        formData.floor === floor
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border-2",
                      formData.status === 'active'
                        ? "bg-green-100 text-green-700 border-current"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: 'maintenance' }))}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border-2",
                      formData.status === 'maintenance'
                        ? "bg-orange-100 text-orange-700 border-current"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <Wrench size={14} />
                    Maintenance
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('New room:', formData);
                  alert(`Room "${formData.name}" has been added.`);
                  setIsAddModalOpen(false);
                  setFormData({ name: '', floor: '1F', status: 'active' });
                }}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
