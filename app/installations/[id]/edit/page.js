"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInstallationDetail, useUpdateInstallation } from "../../../hooks/useInstallations";

export default function EditInstallation({ params }) {
  const router = useRouter();
  const [installationId, setInstallationId] = useState(null);
  const [success, setSuccess] = useState('');
  
  // React Query hooks
  const { 
    data: installation, 
    isLoading: loading, 
    error: fetchError 
  } = useInstallationDetail(installationId);
  
  const updateMutation = useUpdateInstallation();
  
  const [formData, setFormData] = useState({
    companyName: '',
    domain: '',
    adminEmail: '',
    databaseUrl: '',
    billingEmail: '',
    billingPlan: 'Pro',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setInstallationId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Update form when installation data loads
  useEffect(() => {
    if (installation) {
      setFormData({
        companyName: installation.company_name || '',
        domain: installation.domain || '',
        adminEmail: installation.admin_email || '',
        databaseUrl: installation.database_url || '',
        billingEmail: installation.billing_email || '',
        billingPlan: installation.billing_plan || 'Pro',
        notes: installation.notes || '',
        status: installation.status || 'active'
      });
    }
  }, [installation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    try {
      await updateMutation.mutateAsync({ 
        id: installationId, 
        data: formData 
      });
      
      setSuccess('Installation updated successfully!');
      
      // Redirect back to installation detail after 1.5 seconds
      setTimeout(() => {
        router.push(`/installations/${installationId}`);
      }, 1500);
    } catch (error) {
      // Error is handled by React Query and displayed below
      console.error('Error updating installation:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading installation data...</p>
        </div>
      </div>
    );
  }

  if (fetchError && !installation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            {fetchError?.message || 'Failed to load installation'}
          </div>
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href={`/installations/${installationId}`} className="text-indigo-600 hover:text-indigo-500 mr-4">
                ← Back to Installation
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Installation: {installation?.company_name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {updateMutation.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-800">
                  {updateMutation.error?.message || 'Failed to update installation'}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="text-sm text-green-800">{success}</div>
              </div>
            )}

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain *
              </label>
              <input
                type="text"
                required
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The domain where this customer's installation is hosted
              </p>
            </div>

            {/* Admin Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={formData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Database URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database URL
              </label>
              <input
                type="text"
                value={formData.databaseUrl}
                onChange={(e) => handleInputChange('databaseUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>

            {/* Billing Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Email
              </label>
              <input
                type="email"
                value={formData.billingEmail}
                onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Billing Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Plan
              </label>
              <select
                value={formData.billingPlan}
                onChange={(e) => handleInputChange('billingPlan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Enterprise+">Enterprise+</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Read-only fields info */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Automatic Fields</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {installation?.created_at ? new Date(installation.created_at).toLocaleString() : 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Last Accessed:</span> {installation?.last_accessed_at ? new Date(installation.last_accessed_at).toLocaleString() : 'Never'}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These fields are automatically managed and cannot be edited
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href={`/installations/${installationId}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}