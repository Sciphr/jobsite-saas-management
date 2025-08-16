"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkModeToggle from "../../components/DarkModeToggle";

export default function CreateInstallation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    billingEmail: '',
    useSameEmail: true,
    billingPlan: 'Pro',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/installations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the new installation's detail page
        router.push(`/installations/${data.installation.id}`);
      } else {
        setError(data.error || 'Failed to create installation');
      }
    } catch (error) {
      console.error('Error creating installation:', error);
      setError('Failed to create installation');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center w-full">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500 mb-2 sm:mb-0 sm:mr-4 cursor-pointer">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex-1">Add New Customer</h1>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
                <div className="text-sm text-red-800">{error}</div>
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
                placeholder="e.g., Acme Corporation"
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              />
            </div>

            {/* Admin Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name *
              </label>
              <input
                type="text"
                required
                value={formData.adminName}
                onChange={(e) => handleInputChange('adminName', e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              />
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
                onChange={(e) => {
                  handleInputChange('adminEmail', e.target.value);
                  if (formData.useSameEmail) {
                    handleInputChange('billingEmail', e.target.value);
                  }
                }}
                placeholder="e.g., admin@acme.com"
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primary admin contact for this customer
              </p>
            </div>

            {/* Billing Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Email
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.useSameEmail}
                    onChange={(e) => {
                      handleInputChange('useSameEmail', e.target.checked);
                      if (e.target.checked) {
                        handleInputChange('billingEmail', formData.adminEmail);
                      }
                    }}
                    className="mr-2 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Use same as admin email</span>
                </div>
                {!formData.useSameEmail && (
                  <input
                    type="email"
                    value={formData.billingEmail}
                    onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                    placeholder="e.g., billing@acme.com"
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
                  />
                )}
                {formData.useSameEmail && (
                  <div className="text-sm text-gray-500 italic">{formData.adminEmail || 'Will use admin email'}</div>
                )}
              </div>
            </div>

            {/* Billing Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Plan *
              </label>
              <select
                value={formData.billingPlan}
                onChange={(e) => handleInputChange('billingPlan', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              >
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Enterprise+">Enterprise+</option>
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
                placeholder="Any additional notes about this installation..."
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/"
                className="px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer text-center sm:text-left"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}