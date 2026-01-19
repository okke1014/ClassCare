"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Plus, MapPin, Wrench } from "lucide-react";
import { MOCK_ROOMS } from "@/lib/mockData";

export function AdminClassrooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance'>('all');

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
          <button className="bg-primary text-primary-foreground px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shrink-0">
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
    </div>
  );
}
