"use client";

import { useState } from "react";
import { Search, MoreHorizontal, UserPlus } from "lucide-react";

// Mock Users
const MOCK_USERS = [
  { id: 1, name: "Kim Min-ji", role: "Student", email: "minji@example.com" },
  { id: 2, name: "Lee Jun-ho", role: "Student", email: "junho@example.com" },
  { id: 3, name: "Sarah Kim", role: "Teacher", email: "sarah@classcare.com" },
  { id: 4, name: "David Park", role: "Teacher", email: "david@classcare.com" },
];

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Search & Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="bg-primary text-primary-foreground px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <UserPlus size={16} />
          Add
        </button>
      </div>

      {/* User List */}
      <div className="space-y-2">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white p-3 rounded-lg border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                {user.name[0]}
              </div>
              <div>
                <h3 className="font-medium text-sm">{user.name}</h3>
                <p className="text-xs text-gray-500">{user.role} • {user.email}</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
