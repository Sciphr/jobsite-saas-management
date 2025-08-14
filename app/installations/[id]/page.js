"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InstallationDetail({ params }) {
  const [installation, setInstallation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installationId, setInstallationId] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showSupportSection, setShowSupportSection] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setInstallationId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (installationId) {
      fetchInstallation();
    }
  }, [installationId]);

  const fetchInstallation = async () => {
    try {
      const response = await fetch(`/api/installations/${installationId}`);
      if (response.ok) {
        const data = await response.json();
        setInstallation(data.installation);
      } else {
        setError('Installation not found');
      }
    } catch (error) {
      console.error('Error fetching installation:', error);
      setError('Failed to load installation details');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeToken = async (tokenId) => {
    if (!confirm('Are you sure you want to revoke this recovery token?')) {
      return;
    }

    try {
      const response = await fetch(`/api/recovery/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokenId, 
          revokedBy: 'admin', 
          reason: 'Manually revoked from management panel' 
        })
      });

      if (response.ok) {
        // Refresh installation data
        fetchInstallation();
      } else {
        alert('Failed to revoke token');
      }
    } catch (error) {
      console.error('Error revoking token:', error);
      alert('Failed to revoke token');
    }
  };

  const handleViewToken = (token) => {
    setSelectedToken(token);
    setShowTokenModal(true);
  };

  const handleCopyRecoveryUrl = async (token) => {
    const protocol = installation.domain.includes('localhost') ? 'http' : 'https';
    const recoveryUrl = `${protocol}://${installation.domain}/api/recovery/access?token=${token.token}`;
    
    try {
      await navigator.clipboard.writeText(recoveryUrl);
      alert('Recovery URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: show the URL in a prompt
      prompt('Copy this recovery URL:', recoveryUrl);
    }
  };

  const runSingleHealthCheck = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'run-check',
          installation_id: installationId 
        })
      });
      
      if (response.ok) {
        alert('Health check completed. Refreshing data...');
        fetchInstallation(); // Refresh to see updated health status
      } else {
        alert('Failed to run health check');
      }
    } catch (error) {
      console.error('Error running health check:', error);
      alert('Error running health check');
    }
  };

  const runSingleBackup = async () => {
    if (!installation?.database_url) {
      alert('No database URL configured for this installation. Add one in the edit page first.');
      return;
    }
    
    if (confirm(`Create a database backup for ${installation.company_name}?`)) {
      try {
        const response = await fetch('/api/backups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'create-backup',
            installation_id: installationId 
          })
        });
        
        if (response.ok) {
          alert('Backup started successfully.');
          fetchInstallation(); // Refresh to see updated backup status
        } else {
          const data = await response.json();
          alert(`Failed to start backup: ${data.error}`);
        }
      } catch (error) {
        console.error('Error running backup:', error);
        alert('Error running backup');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
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
              <Link href="/" className="text-indigo-600 hover:text-indigo-500 mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {installation?.company_name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href={`/installations/${installation?.id}/edit`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Edit Installation
              </Link>
              <Link 
                href={`/recovery/create?installation=${installation?.id}`}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Create Recovery Token
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Installation Info */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Installation Details</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                <dd className="text-sm text-gray-900">{installation?.company_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Domain</dt>
                <dd className="text-sm text-gray-900">
                  <a 
                    href={`https://${installation?.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {installation?.domain}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Admin Email</dt>
                <dd className="text-sm text-gray-900">{installation?.admin_email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    installation?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : installation?.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {installation?.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {installation?.created_at ? new Date(installation.created_at).toLocaleString() : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Accessed</dt>
                <dd className="text-sm text-gray-900">
                  {installation?.last_accessed_at ? new Date(installation.last_accessed_at).toLocaleString() : 'Never'}
                </dd>
              </div>
              {installation?.billing_plan && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Billing Plan</dt>
                  <dd className="text-sm text-gray-900">{installation.billing_plan}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Health Status</dt>
                <dd className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    installation?.health_status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : installation?.health_status === 'degraded'
                      ? 'bg-yellow-100 text-yellow-800'
                      : installation?.health_status === 'unhealthy' || installation?.health_status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {installation?.health_status || 'unknown'}
                  </span>
                  {installation?.last_health_check && (
                    <span className="ml-2 text-xs text-gray-500">
                      (checked {new Date(installation.last_health_check).toLocaleString()})
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Backup Status</dt>
                <dd className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    installation?.backup_status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : installation?.backup_status === 'running'
                      ? 'bg-blue-100 text-blue-800'
                      : installation?.backup_status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {installation?.backup_status || 'pending'}
                  </span>
                  {installation?.last_backup_at && (
                    <span className="ml-2 text-xs text-gray-500">
                      (last backup {new Date(installation.last_backup_at).toLocaleString()})
                    </span>
                  )}
                </dd>
              </div>
              {installation?.notes && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="text-sm text-gray-900">{installation.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Management Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Management Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => runSingleHealthCheck()}
                className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-green-900">Run Health Check</h3>
                    <p className="text-sm text-green-700">Check this installation</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => runSingleBackup()}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Create Backup</h3>
                    <p className="text-sm text-blue-700">Backup database now</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setShowSupportSection(!showSupportSection)}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-purple-900">Support Tickets</h3>
                    <p className="text-sm text-purple-700">View customer issues</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Health Check Details */}
        {installation?.health_details && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Health Check Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {installation.health_details.checks?.http && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">HTTP Check</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`text-sm font-medium ${
                          installation.health_details.checks.http.status === 'healthy' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {installation.health_details.checks.http.status}
                        </span>
                      </div>
                      {installation.health_details.checks.http.response_time && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Response Time:</span>
                          <span className="text-sm text-gray-900">{installation.health_details.checks.http.response_time}ms</span>
                        </div>
                      )}
                      {installation.health_details.checks.http.error_message && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Error:</span>
                          <p className="text-sm text-red-600 mt-1">{installation.health_details.checks.http.error_message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {installation.health_details.checks?.database && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Database Check</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`text-sm font-medium ${
                          installation.health_details.checks.database.status === 'healthy' 
                            ? 'text-green-600' 
                            : installation.health_details.checks.database.status === 'skipped'
                            ? 'text-gray-600'
                            : 'text-red-600'
                        }`}>
                          {installation.health_details.checks.database.status}
                        </span>
                      </div>
                      {installation.health_details.checks.database.response_time && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Connection Time:</span>
                          <span className="text-sm text-gray-900">{installation.health_details.checks.database.response_time}ms</span>
                        </div>
                      )}
                      {installation.health_details.checks.database.error_message && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Error:</span>
                          <p className="text-sm text-red-600 mt-1">{installation.health_details.checks.database.error_message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recovery Tokens */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recovery Tokens</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {installation?.recovery_tokens?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No recovery tokens found for this installation
                    </td>
                  </tr>
                ) : (
                  installation?.recovery_tokens?.map((token) => (
                    <tr key={token.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{token.purpose}</div>
                          {token.is_active && new Date() < new Date(token.expires_at) && (
                            <button
                              onClick={() => handleViewToken(token)}
                              className="text-xs text-indigo-600 hover:text-indigo-500 mt-1"
                            >
                              View Recovery URL
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {token.created_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(token.expires_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          token.is_active && new Date() < new Date(token.expires_at)
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {token.is_active && new Date() < new Date(token.expires_at) ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {token.use_count} / {token.max_uses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {token.is_active && new Date() < new Date(token.expires_at) && (
                            <button
                              onClick={() => handleCopyRecoveryUrl(token)}
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              Copy URL
                            </button>
                          )}
                          {token.is_active && (
                            <button 
                              onClick={() => handleRevokeToken(token.id)}
                              className="text-red-600 hover:text-red-500"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Access Logs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Access Logs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {installation?.recovery_access_logs?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No access logs found for this installation
                    </td>
                  </tr>
                ) : (
                  installation?.recovery_access_logs?.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.user_email || 'System'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip_address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Token Details Modal */}
      {showTokenModal && selectedToken && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recovery Token Details</h3>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Recovery URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recovery URL</label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={`${installation.domain.includes('localhost') ? 'http' : 'https'}://${installation.domain}/api/recovery/access?token=${selectedToken.token}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => handleCopyRecoveryUrl(selectedToken)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Token Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <div className="text-sm text-gray-900">{selectedToken.purpose}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                  <div className="text-sm text-gray-900">{selectedToken.created_by}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                  <div className="text-sm text-gray-900">{new Date(selectedToken.expires_at).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage</label>
                  <div className="text-sm text-gray-900">{selectedToken.use_count} / {selectedToken.max_uses} uses</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                  <div className="text-sm text-gray-900">
                    {Array.isArray(selectedToken.permissions) 
                      ? selectedToken.permissions.join(', ')
                      : 'Admin Access'
                    }
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedToken.is_active && new Date() < new Date(selectedToken.expires_at)
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedToken.is_active && new Date() < new Date(selectedToken.expires_at) ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions for Customer</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Send the recovery URL above to the customer</li>
                  <li>They should click the URL to access emergency login</li>
                  <li>They will be automatically logged in as a temporary administrator</li>
                  <li>Access expires on {new Date(selectedToken.expires_at).toLocaleString()}</li>
                  <li>This link can only be used {selectedToken.max_uses - selectedToken.use_count} more time(s)</li>
                </ol>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedToken.is_active && (
                  <button
                    onClick={() => {
                      handleRevokeToken(selectedToken.id);
                      setShowTokenModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Revoke Token
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}