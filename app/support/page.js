"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SupportTicketsContent() {
  const searchParams = useSearchParams();
  const installationFilter = searchParams.get('installation');
  
  const [tickets, setTickets] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstallation, setSelectedInstallation] = useState(installationFilter || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchInstallations();
  }, [selectedInstallation, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedInstallation) params.append('installation', selectedInstallation);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      
      const response = await fetch(`/api/support/tickets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstallations = async () => {
    try {
      const response = await fetch('/api/installations');
      if (response.ok) {
        const data = await response.json();
        setInstallations(data.installations || []);
      }
    } catch (error) {
      console.error('Error fetching installations:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedInstallationName = installations.find(inst => inst.id === selectedInstallation)?.company_name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3">
            <div className="flex flex-col w-full">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500 mb-2 sm:mb-3 cursor-pointer">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Support Tickets
                {selectedInstallationName && (
                  <span className="block sm:inline text-base sm:text-lg font-normal text-gray-600 sm:ml-2 mt-1 sm:mt-0">
                    for {selectedInstallationName}
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
            {/* Installation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation
              </label>
              <select
                value={selectedInstallation}
                onChange={(e) => setSelectedInstallation(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              >
                <option value="">All Installations</option>
                {installations.map(installation => (
                  <option key={installation.id} value={installation.id}>
                    {installation.company_name} ({installation.domain})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Support Tickets ({tickets.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tickets...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-4 p-4">
              {tickets.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {selectedInstallation ? 
                    `No support tickets found for ${selectedInstallationName}` :
                    'No support tickets found'
                  }
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">#{ticket.ticket_number}</div>
                        <div className="text-sm text-gray-900 font-medium mt-1">{ticket.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{ticket.description}</div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div>
                        <span className="font-medium">{ticket.customer_name || 'N/A'}</span>
                        {ticket.installation?.company_name && (
                          <span className="ml-2">• {ticket.installation.company_name}</span>
                        )}
                      </div>
                      <div>{new Date(ticket.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="pt-2">
                      <Link 
                        href={`/support/tickets/${ticket.id}`}
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center w-full"
                      >
                        View Ticket
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket #
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Installation
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm">
                        {selectedInstallation ? 
                          `No support tickets found for ${selectedInstallationName}` :
                          'No support tickets found'
                        }
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            #{ticket.ticket_number}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm text-gray-900 font-medium truncate">
                            {ticket.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-xs sm:max-w-sm md:max-w-md">
                            {ticket.description}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.customer_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {ticket.customer_email}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.installation?.company_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ticket.installation?.domain}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            href={`/support/tickets/${ticket.id}`}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SupportTickets() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support tickets...</p>
        </div>
      </div>
    }>
      <SupportTicketsContent />
    </Suspense>
  );
}