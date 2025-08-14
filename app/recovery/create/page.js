"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CreateRecoveryToken() {
  const searchParams = useSearchParams();
  const preselectedInstallation = searchParams.get('installation');
  
  const [installations, setInstallations] = useState([]);
  const [installationsLoading, setInstallationsLoading] = useState(true);
  const [formData, setFormData] = useState({
    installationId: preselectedInstallation || '',
    purpose: '',
    expirationHours: '24',
    maxUses: '1',
    permissions: ['admin_access']
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = async () => {
    try {
      const response = await fetch('/api/installations');
      if (response.ok) {
        const data = await response.json();
        setInstallations(data.installations || []);
      }
    } catch (error) {
      console.error('Error fetching installations:', error);
    } finally {
      setInstallationsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/recovery/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to create recovery token');
      }
    } catch (error) {
      setError('Failed to create recovery token');
      console.error('Error creating recovery token:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Recovery Token Created</h1>
              <Link href="/" className="text-indigo-600 hover:text-indigo-500">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recovery Token Created Successfully</h2>
              <p className="text-gray-600 mt-2">Provide this information to the customer for emergency access</p>
            </div>

            <div className="space-y-6">
              {/* Recovery URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recovery URL</label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={result.recoveryUrl}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(result.recoveryUrl)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Token Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token ID</label>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={result.token.id}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(result.token.id)}
                      className="px-3 py-2 bg-gray-600 text-white rounded-r-md hover:bg-gray-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expires At</label>
                  <input
                    type="text"
                    readOnly
                    value={new Date(result.expiresAt).toLocaleString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions for Customer</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click on the recovery URL above to access the emergency login</li>
                  <li>You will be automatically logged in as a temporary administrator</li>
                  <li>Access expires in {formData.expirationHours} hours</li>
                  <li>Use this time to reset your admin password or fix account issues</li>
                  <li>This link can only be used {formData.maxUses} time(s)</li>
                </ol>
              </div>

              {/* Security Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 12.5c-.77.833-.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                    <div className="text-sm text-yellow-700 mt-1">
                      <p>This recovery access is being logged for security purposes. Only share this URL with authorized personnel.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Link
                  href={`/installations/${result.token.installation_id}`}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  View Installation
                </Link>
                <button
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      installationId: '',
                      purpose: '',
                      expirationHours: '24',
                      maxUses: '1',
                      permissions: ['admin_access']
                    });
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Another Token
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Create Recovery Token</h1>
            <Link href="/" className="text-indigo-600 hover:text-indigo-500">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Installation Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Installation *
              </label>
              <select
                required
                value={formData.installationId}
                onChange={(e) => setFormData(prev => ({ ...prev, installationId: e.target.value }))}
                disabled={installationsLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="">{installationsLoading ? 'Loading installations...' : 'Select an installation...'}</option>
                {installations.map(installation => (
                  <option key={installation.id} value={installation.id}>
                    {installation.company_name} ({installation.domain})
                  </option>
                ))}
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose/Reason *
              </label>
              <input
                type="text"
                required
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="e.g., Admin password reset, Account recovery"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Expiration Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Hours *
              </label>
              <select
                value={formData.expirationHours}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationHours: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1 hour</option>
                <option value="4">4 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours (recommended)</option>
                <option value="48">48 hours</option>
                <option value="168">1 week</option>
              </select>
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Uses
              </label>
              <select
                value={formData.maxUses}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1 use (recommended)</option>
                <option value="2">2 uses</option>
                <option value="3">3 uses</option>
                <option value="5">5 uses</option>
              </select>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes('admin_access')}
                    onChange={(e) => handlePermissionChange('admin_access', e.target.checked)}
                    className="mr-3 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Emergency Admin Access</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Grants full system access to recover locked accounts, reset passwords, and restore admin access. 
                      Use only when customers are completely locked out.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 This provides complete system bypass for emergency recovery situations
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : 'Create Recovery Token'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}