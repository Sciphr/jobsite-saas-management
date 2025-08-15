"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBackupHistory } from "../../hooks/useInstallations";

function DeploymentConfig({ installation, onUpdate }) {
  const [configData, setConfigData] = useState({
    subdomain: '',
    port_number: '',
    custom_domain: '',
    environment_vars: {}
  });
  const [loading, setLoading] = useState(false);
  const [usedPorts, setUsedPorts] = useState([]);
  const [usedDomains, setUsedDomains] = useState([]);
  const [conflicts, setConflicts] = useState({});

  useEffect(() => {
    fetchConflictData();
    generateDefaults();
  }, [installation]);

  const fetchConflictData = async () => {
    try {
      const response = await fetch('/api/deployments/conflicts');
      if (response.ok) {
        const data = await response.json();
        setUsedPorts(data.usedPorts || []);
        setUsedDomains(data.usedDomains || []);
      }
    } catch (error) {
      console.error('Error fetching conflict data:', error);
    }
  };

  const generateDefaults = () => {
    const subdomain = installation.company_name?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || '';
    
    setConfigData(prev => ({
      ...prev,
      subdomain,
      port_number: ''
    }));
  };

  const checkConflicts = (field, value) => {
    const newConflicts = { ...conflicts };
    
    if (field === 'subdomain' && usedDomains.includes(value)) {
      newConflicts.subdomain = 'This subdomain is already in use';
    } else if (field === 'subdomain') {
      delete newConflicts.subdomain;
    }
    
    if (field === 'port_number' && usedPorts.includes(parseInt(value))) {
      newConflicts.port_number = 'This port is already in use';
    } else if (field === 'port_number') {
      delete newConflicts.port_number;
    }
    
    setConflicts(newConflicts);
  };

  const handleInputChange = (field, value) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
    checkConflicts(field, value);
  };

  const suggestPort = () => {
    const basePort = 3001;
    let suggestedPort = basePort;
    while (usedPorts.includes(suggestedPort)) {
      suggestedPort++;
    }
    handleInputChange('port_number', suggestedPort.toString());
  };

  const handleSaveConfig = async () => {
    if (Object.keys(conflicts).length > 0) {
      alert('Please resolve conflicts before saving');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/installations/${installation.id}/deployment-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });

      if (response.ok) {
        alert('Deployment configuration saved successfully');
        onUpdate(); // Refresh the parent component
      } else {
        const errorData = await response.json();
        alert(`Failed to save configuration: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (Object.keys(conflicts).length > 0) {
      alert('Please resolve conflicts before deploying');
      return;
    }

    if (!configData.subdomain || !configData.port_number) {
      alert('Please configure subdomain and port before deploying');
      return;
    }

    if (confirm(`Deploy ${installation.company_name} with the current configuration?`)) {
      setLoading(true);
      try {
        const response = await fetch('/api/deployments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deploy-customer',
            installation_id: installation.id,
            company_name: installation.company_name,
            admin_email: installation.admin_email,
            subdomain: configData.subdomain,
            port_number: parseInt(configData.port_number),
            billing_plan: installation.billing_plan
          })
        });

        const data = await response.json();
        
        if (data.success) {
          alert(`Deployment started! Estimated time: ${data.estimatedTime}`);
          onUpdate(); // Refresh to show deployment status
        } else {
          alert(`Deployment failed: ${data.error}`);
        }
      } catch (error) {
        console.error('Error starting deployment:', error);
        alert('Error starting deployment');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Configure Deployment Settings</h4>
        <p className="text-sm text-blue-700">
          Configure the domain, port, and environment variables for this customer's deployment. 
          Once configured, you can deploy the customer application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subdomain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subdomain *
          </label>
          <div className="flex">
            <input
              type="text"
              required
              value={configData.subdomain}
              onChange={(e) => handleInputChange('subdomain', e.target.value)}
              placeholder="customer-name"
              className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                conflicts.subdomain ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <span className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
              .yourdomain.com
            </span>
          </div>
          {conflicts.subdomain && (
            <p className="text-sm text-red-600 mt-1">{conflicts.subdomain}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Will be: https://{configData.subdomain || 'subdomain'}.yourdomain.com
          </p>
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port Number *
          </label>
          <div className="flex">
            <input
              type="number"
              required
              min="3000"
              max="9999"
              value={configData.port_number}
              onChange={(e) => handleInputChange('port_number', e.target.value)}
              placeholder="3001"
              className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                conflicts.port_number ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={suggestPort}
              className="px-3 py-2 bg-indigo-50 border border-l-0 border-gray-300 rounded-r-md text-indigo-600 hover:bg-indigo-100 text-sm"
            >
              Suggest
            </button>
          </div>
          {conflicts.port_number && (
            <p className="text-sm text-red-600 mt-1">{conflicts.port_number}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Application will run on port {configData.port_number || 'XXXX'}
          </p>
        </div>
      </div>

      {/* Custom Domain (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Domain (Optional)
        </label>
        <input
          type="text"
          value={configData.custom_domain}
          onChange={(e) => handleInputChange('custom_domain', e.target.value)}
          placeholder="e.g., app.customer.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          If provided, this will be used instead of the subdomain
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSaveConfig}
          disabled={loading || Object.keys(conflicts).length > 0}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
        <button
          onClick={handleDeploy}
          disabled={loading || Object.keys(conflicts).length > 0 || !configData.subdomain || !configData.port_number}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deploying...
            </div>
          ) : 'Deploy Customer'}
        </button>
      </div>
    </div>
  );
}

export default function InstallationDetail({ params }) {
  const [installation, setInstallation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installationId, setInstallationId] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showSupportSection, setShowSupportSection] = useState(false);
  const [showBackupHistory, setShowBackupHistory] = useState(false);
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);
  const [isRunningBackup, setIsRunningBackup] = useState(false);
  const router = useRouter();

  // React Query for backup history
  const { 
    data: backupHistory = [], 
    isLoading: isLoadingBackupHistory 
  } = useBackupHistory(installationId, showBackupHistory);

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
    setIsRunningHealthCheck(true);
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
    } finally {
      setIsRunningHealthCheck(false);
    }
  };

  const runSingleBackup = async () => {
    if (!installation?.database_url) {
      alert('No database URL configured for this installation. Add one in the edit page first.');
      return;
    }
    
    if (confirm(`Create a database backup for ${installation.company_name}?`)) {
      setIsRunningBackup(true);
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
      } finally {
        setIsRunningBackup(false);
      }
    }
  };


  const downloadBackup = (filePath) => {
    window.open(`/api/backups/download?path=${encodeURIComponent(filePath)}`, '_blank');
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

        {/* Deployment Configuration */}
        {installation?.deployment_status === 'pending' && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Deployment Configuration</h2>
            </div>
            <div className="p-6">
              <DeploymentConfig installation={installation} onUpdate={fetchInstallation} />
            </div>
          </div>
        )}

        {/* Deployment Status */}
        {installation?.deployment_status && installation.deployment_status !== 'pending' && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Deployment Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      installation.deployment_status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : installation.deployment_status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {installation.deployment_status}
                    </span>
                  </dd>
                </div>
                {installation.deployment_url && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Deployment URL</dt>
                    <dd className="text-sm text-gray-900">
                      <a 
                        href={installation.deployment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        {installation.deployment_url}
                      </a>
                    </dd>
                  </div>
                )}
                {installation.port_number && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Port</dt>
                    <dd className="text-sm text-gray-900">{installation.port_number}</dd>
                  </div>
                )}
                {installation.subdomain && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subdomain</dt>
                    <dd className="text-sm text-gray-900">{installation.subdomain}</dd>
                  </div>
                )}
              </div>
              {installation.deployment_status === 'completed' && (
                <div className="mt-4">
                  <Link
                    href={`/deployments?installation=${installation.id}`}
                    className="text-indigo-600 hover:text-indigo-500 text-sm"
                  >
                    View Deployment History →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Management Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Management Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => runSingleHealthCheck()}
                disabled={isRunningHealthCheck}
                className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  {isRunningHealthCheck ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
                  ) : (
                    <svg className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-green-900">
                      {isRunningHealthCheck ? 'Running Health Check...' : 'Run Health Check'}
                    </h3>
                    <p className="text-sm text-green-700">Check this installation</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => runSingleBackup()}
                disabled={isRunningBackup}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  {isRunningBackup ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  ) : (
                    <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      {isRunningBackup ? 'Creating Backup...' : 'Create Backup'}
                    </h3>
                    <p className="text-sm text-blue-700">Backup database now</p>
                  </div>
                </div>
              </button>

              <Link 
                href={`/support?installation=${installationId}`}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors block"
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
              </Link>

              <button 
                onClick={() => setShowBackupHistory(!showBackupHistory)}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Backup History</h3>
                    <p className="text-sm text-blue-700">View and download backups</p>
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

        {/* Backup History */}
        {showBackupHistory && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Backup History</h2>
            </div>
            {isLoadingBackupHistory ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading backup history...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {backupHistory.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No backups found for this installation
                        </td>
                      </tr>
                    ) : (
                      backupHistory.map((backup) => (
                        <tr key={backup.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(backup.started_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              backup.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : backup.status === 'running'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {backup.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {backup.file_size ? `${(parseInt(backup.file_size) / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {backup.backup_type}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {backup.status === 'completed' && backup.file_path && (
                                <button
                                  onClick={() => downloadBackup(backup.file_path)}
                                  className="text-indigo-600 hover:text-indigo-500 whitespace-nowrap"
                                >
                                  Download
                                </button>
                              )}
                              {backup.error_message && (
                                <button
                                  onClick={() => alert(backup.error_message)}
                                  className="text-red-600 hover:text-red-500 text-xs whitespace-nowrap"
                                  title={backup.error_message}
                                >
                                  View Error
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
            )}
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