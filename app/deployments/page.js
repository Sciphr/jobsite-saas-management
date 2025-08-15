"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function DeploymentContent() {
  const searchParams = useSearchParams();
  const preselectedInstallation = searchParams.get('installation');
  
  const [installations, setInstallations] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  const [formData, setFormData] = useState({
    installation_id: preselectedInstallation || ''
  });

  useEffect(() => {
    fetchInstallations();
    fetchDeployments();
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
      setLoading(false);
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/deployments');
      if (response.ok) {
        const data = await response.json();
        setDeployments(data.deployments || []);
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
    }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    
    const selectedInstallation = installations.find(inst => inst.id === formData.installation_id);
    if (!selectedInstallation) {
      alert('Please select an installation');
      return;
    }

    if (selectedInstallation.deployment_status === 'completed') {
      alert('This installation is already deployed');
      return;
    }

    if (!selectedInstallation.subdomain || !selectedInstallation.port_number) {
      alert('Please configure deployment settings for this customer first');
      return;
    }

    setDeploymentLoading(true);
    try {
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy-customer',
          installation_id: formData.installation_id,
          company_name: selectedInstallation.company_name,
          admin_email: selectedInstallation.admin_email,
          subdomain: selectedInstallation.subdomain,
          port_number: selectedInstallation.port_number,
          billing_plan: selectedInstallation.billing_plan
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Deployment started! Estimated time: ${data.estimatedTime}. Check the deployments list below for progress.`);
        
        // Reset form
        setFormData({
          installation_id: ''
        });
        
        // Refresh data
        fetchInstallations();
        fetchDeployments();
      } else {
        alert(`Deployment failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error starting deployment:', error);
      alert('Error starting deployment');
    } finally {
      setDeploymentLoading(false);
    }
  };

  const checkDeploymentStatus = async (installationId) => {
    try {
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check-deployment-status',
          installation_id: installationId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Status: ${data.status}\\nURL: ${data.url || 'Not yet available'}\\nPort: ${data.port || 'Not assigned'}`);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };


  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'starting':
      case 'cloning':
      case 'installing':
      case 'building':
      case 'configuring':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedInstallation = installations.find(inst => inst.id === formData.installation_id);

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
              <h1 className="text-3xl font-bold text-gray-900">Deployment Automation</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deploy New Customer */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Deploy New Customer</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleDeploy} className="space-y-6">
              {/* Installation Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Installation *
                </label>
                <select
                  required
                  value={formData.installation_id}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, installation_id: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an installation...</option>
                  {installations
                    .filter(inst => inst.deployment_status !== 'completed')
                    .map(installation => (
                    <option key={installation.id} value={installation.id}>
                      {installation.company_name} ({installation.admin_email})
                    </option>
                  ))}
                </select>
                {selectedInstallation && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current Status: <span className="font-medium">{selectedInstallation.deployment_status || 'pending'}</span>
                  </p>
                )}
              </div>

              {/* Configuration Status */}
              {selectedInstallation && (
                <div className="md:col-span-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Deployment Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Subdomain:</span>
                        <div className="font-medium">{selectedInstallation.subdomain || 'Not configured'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Port:</span>
                        <div className="font-medium">{selectedInstallation.port_number || 'Not configured'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Domain:</span>
                        <div className="font-medium">{selectedInstallation.domain || 'Not configured'}</div>
                      </div>
                    </div>
                    {(!selectedInstallation.subdomain || !selectedInstallation.port_number) && (
                      <div className="mt-3 text-sm text-orange-600">
                        ⚠️ Customer needs deployment configuration before deploying. 
                        <Link 
                          href={`/installations/${selectedInstallation.id}`}
                          className="text-indigo-600 hover:text-indigo-500 ml-1"
                        >
                          Configure now →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Deployment Info */}
              {selectedInstallation && selectedInstallation.subdomain && selectedInstallation.port_number && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Deployment Details</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Company:</strong> {selectedInstallation.company_name}</p>
                    <p><strong>Admin Email:</strong> {selectedInstallation.admin_email}</p>
                    <p><strong>Will deploy to:</strong> {selectedInstallation.domain}</p>
                    <p><strong>Port:</strong> {selectedInstallation.port_number}</p>
                    <p><strong>Database:</strong> Will create new PostgreSQL database</p>
                    <p><strong>Process:</strong> Will start PM2 process automatically</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={deploymentLoading || !selectedInstallation || !selectedInstallation.subdomain || !selectedInstallation.port_number}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deploymentLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting Deployment...
                    </div>
                  ) : 'Start Deployment'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Deployment History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Deployment History</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading deployments...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deployments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No deployments found
                      </td>
                    </tr>
                  ) : (
                    deployments.map((deployment) => (
                      <tr key={deployment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {deployment.installation?.company_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {deployment.installation?.admin_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(deployment.status)}`}>
                            {deployment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {deployment.deployment_url ? (
                            <a 
                              href={deployment.deployment_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-500 text-sm"
                            >
                              {deployment.deployment_url}
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">Not available</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(deployment.started_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => checkDeploymentStatus(deployment.installation_id)}
                            className="text-indigo-600 hover:text-indigo-500 mr-4"
                          >
                            Check Status
                          </button>
                          {deployment.installation && (
                            <Link 
                              href={`/installations/${deployment.installation.id}`}
                              className="text-gray-600 hover:text-gray-500"
                            >
                              View Installation
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Deployments() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deployments...</p>
        </div>
      </div>
    }>
      <DeploymentContent />
    </Suspense>
  );
}