"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInstallations } from "./hooks/useInstallations";
import DarkModeToggle from "./components/DarkModeToggle";

export default function SaaSManagementDashboard() {
  const [isRunningHealthChecks, setIsRunningHealthChecks] = useState(false);
  const [isRunningBackups, setIsRunningBackups] = useState(false);
  const [isCleaningUpBackups, setIsCleaningUpBackups] = useState(false);
  const [updatingTiers, setUpdatingTiers] = useState(new Set());

  // React Query for dashboard data
  const {
    data: dashboardData,
    isLoading: loading,
    error,
    refetch: fetchDashboardData,
  } = useInstallations();

  const installations = dashboardData?.installations || [];
  const stats = dashboardData?.stats || {
    totalInstallations: 0,
    activeInstallations: 0,
    activeRecoveryTokens: 0,
    recentRecoveryAccess: 0,
  };

  const runHealthChecks = async () => {
    setIsRunningHealthChecks(true);
    try {
      const response = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run-all" }),
      });

      if (response.ok) {
        alert(
          "Health checks started for all installations. Refresh to see updated results."
        );
        fetchDashboardData(); // Refresh the dashboard
      } else {
        alert("Failed to start health checks");
      }
    } catch (error) {
      console.error("Error running health checks:", error);
      alert("Error running health checks");
    } finally {
      setIsRunningHealthChecks(false);
    }
  };

  const runBackups = async () => {
    if (
      confirm(
        "This will start database backups for all installations. Continue?"
      )
    ) {
      setIsRunningBackups(true);
      try {
        const response = await fetch("/api/backups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "run-all-backups" }),
        });

        if (response.ok) {
          alert(
            "Backup job started for all installations. Check logs for progress."
          );
        } else {
          alert("Failed to start backups");
        }
      } catch (error) {
        console.error("Error running backups:", error);
        alert("Error running backups");
      } finally {
        setIsRunningBackups(false);
      }
    }
  };

  const cleanupOldBackups = async () => {
    if (
      confirm(
        "This will delete all backup files older than 30 days. This cannot be undone. Continue?"
      )
    ) {
      setIsCleaningUpBackups(true);
      try {
        const response = await fetch("/api/backups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cleanup",
            days_to_keep: 30,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(
            `Cleanup completed! Deleted ${data.deletedCount} old backup files.`
          );
          fetchDashboardData(); // Refresh dashboard stats
        } else {
          const errorData = await response.json();
          alert(`Failed to cleanup backups: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error cleaning up backups:", error);
        alert("Error cleaning up backups");
      } finally {
        setIsCleaningUpBackups(false);
      }
    }
  };

  const updateSubscriptionTier = async (installationId, newTier) => {
    if (!confirm(`Change subscription tier to ${newTier}? This will immediately affect the installation's available features.`)) {
      return;
    }

    setUpdatingTiers(prev => new Set([...prev, installationId]));

    try {
      const response = await fetch("/api/installations/tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installation_id: installationId,
          new_tier: newTier,
        }),
      });

      if (response.ok) {
        alert(`Successfully updated subscription tier to ${newTier}!`);
        fetchDashboardData(); // Refresh the dashboard
      } else {
        const errorData = await response.json();
        alert(`Failed to update tier: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating subscription tier:", error);
      alert("Error updating subscription tier");
    } finally {
      setUpdatingTiers(prev => {
        const newSet = new Set(prev);
        newSet.delete(installationId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            Failed to load dashboard
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center">
              <Image
                src="/icon.png"
                alt="Asari Logo"
                width={32}
                height={32}
                className="mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                <span className="hidden sm:inline">
                  Asari Management Dashboard
                </span>
                <span className="sm:hidden">Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <DarkModeToggle />
              <Link
                href="/installations/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer flex-1 sm:flex-initial text-center"
              >
                Add Customer
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      Total Installations
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-gray-900">
                      {stats.totalInstallations}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Installations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeInstallations}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2m0 0V1h-2v2m2 0h2v2h-2V3z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Recovery Tokens
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeRecoveryTokens}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 12.5c-.77.833-.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Recent Recovery Access
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.recentRecoveryAccess}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Health Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Healthy Installations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.health?.healthyInstallations || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Recent Backups
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.backups?.recentSuccessfulBackups || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Open Tickets
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.support?.openTickets || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      System Health
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.health?.unhealthyInstallations > 0 ? (
                        <span className="text-red-600">Issues</span>
                      ) : (
                        <span className="text-green-600">Good</span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => runHealthChecks()}
                disabled={isRunningHealthChecks}
                className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-left hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center">
                  {isRunningHealthChecks ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
                  ) : (
                    <svg
                      className="h-6 w-6 text-green-600 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-green-900">
                      {isRunningHealthChecks
                        ? "Running Health Checks..."
                        : "Run Health Checks"}
                    </h3>
                    <p className="text-sm text-green-700">
                      Check all installations
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => runBackups()}
                disabled={isRunningBackups}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-left hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center">
                  {isRunningBackups ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  ) : (
                    <svg
                      className="h-6 w-6 text-blue-600 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      {isRunningBackups ? "Running Backups..." : "Run Backups"}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Backup all databases
                    </p>
                  </div>
                </div>
              </button>

              <Link
                href="/support"
                className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-left hover:bg-purple-100 transition-colors block cursor-pointer touch-manipulation"
              >
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-purple-600 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-purple-900">
                      Support Center
                    </h3>
                    <p className="text-sm text-purple-700">
                      Manage customer tickets
                    </p>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => cleanupOldBackups()}
                disabled={isCleaningUpBackups}
                className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-left hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center">
                  {isCleaningUpBackups ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-3"></div>
                  ) : (
                    <svg
                      className="h-6 w-6 text-orange-600 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-orange-900">
                      {isCleaningUpBackups
                        ? "Cleaning Up..."
                        : "Cleanup Backups"}
                    </h3>
                    <p className="text-sm text-orange-700">
                      Delete backups older than 30 days
                    </p>
                  </div>
                </div>
              </button>

              <Link
                href="/deployments"
                className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 text-left hover:bg-indigo-100 transition-colors block cursor-pointer touch-manipulation"
              >
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-indigo-600 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-indigo-900">
                      Deploy Customer
                    </h3>
                    <p className="text-sm text-indigo-700">
                      Automate new customer setup
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Installations Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Customer Installations
            </h2>
          </div>
          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-4 p-4">
            {installations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No installations found.{" "}
                <Link
                  href="/installations/create"
                  className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Add your first installation
                </Link>
              </div>
            ) : (
              installations.map((installation) => (
                <div
                  key={installation.id}
                  className="bg-gray-50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {installation.company_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {installation.company_name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {installation.admin_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        <a
                          href={`https://${installation.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                          {installation.domain}
                        </a>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          installation.status === "active"
                            ? "bg-green-100 text-green-800"
                            : installation.status === "suspended"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {installation.status}
                      </span>
                      <div className="flex items-center">
                        <select
                          value={installation.subscription_tier || 'basic'}
                          onChange={(e) => updateSubscriptionTier(installation.id, e.target.value)}
                          disabled={updatingTiers.has(installation.id)}
                          className="text-xs font-semibold rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="basic">Basic</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                        {updatingTiers.has(installation.id) && (
                          <div className="ml-1 animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/installations/${installation.id}`}
                      className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-center transition-colors flex-1"
                    >
                      View
                    </Link>
                    <Link
                      href={`/recovery/create?installation=${installation.id}`}
                      className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 cursor-pointer px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-center transition-colors flex-1"
                    >
                      Recovery
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
                    Company
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Accessed
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {installations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm"
                    >
                      No installations found.{" "}
                      <Link
                        href="/installations/create"
                        className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                      >
                        Add your first installation
                      </Link>
                    </td>
                  </tr>
                ) : (
                  installations.map((installation) => (
                    <tr
                      key={installation.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-xs sm:text-sm font-medium text-indigo-600">
                                {installation.company_name
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {installation.company_name}
                            </div>
                            <div className="text-xs text-gray-500 truncate sm:block">
                              {installation.admin_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={`https://${installation.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                          {installation.domain}
                        </a>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                            installation.status === "active"
                              ? "bg-green-100 text-green-800"
                              : installation.status === "suspended"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {installation.status}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <select
                            value={installation.subscription_tier || 'basic'}
                            onChange={(e) => updateSubscriptionTier(installation.id, e.target.value)}
                            disabled={updatingTiers.has(installation.id)}
                            className="text-xs font-semibold rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="basic">Basic</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                          {updatingTiers.has(installation.id) && (
                            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                          )}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {installation.last_accessed_at
                          ? new Date(
                              installation.last_accessed_at
                            ).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                          <Link
                            href={`/installations/${installation.id}`}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-center transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={`/recovery/create?installation=${installation.id}`}
                            className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 cursor-pointer px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-center transition-colors"
                          >
                            Recovery
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
