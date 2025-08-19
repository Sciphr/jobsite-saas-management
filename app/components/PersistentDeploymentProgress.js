"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function PersistentDeploymentProgress({ installationId, deploymentStatus }) {
  const [socket, setSocket] = useState(null);
  const [progress, setProgress] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // Deployment steps - should match the server-side steps
  const steps = [
    'Starting deployment',
    'Cloning repository', 
    'Creating database',
    'Creating MinIO bucket',
    'Creating Supabase bucket',
    'Creating environment file',
    'Installing dependencies',
    'Building application',
    'Running database migrations',
    'Creating admin user',
    'Creating PM2 configuration',
    'Starting PM2 process',
    'Configuring nginx',
    'Setting up SSL certificate'
  ];

  // Only show this component if deployment is in progress or recently completed/failed
  const shouldShow = deploymentStatus && ['starting', 'in_progress', 'completed', 'failed'].includes(deploymentStatus);

  useEffect(() => {
    if (shouldShow && installationId) {
      // Initialize WebSocket connection
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? `${window.location.protocol}//${window.location.host}`
        : 'http://localhost:3100';
      
      console.log('Connecting to WebSocket for deployment tracking:', socketUrl);
      const newSocket = io(socketUrl, {
        path: '/socket.io/'
      });
      
      newSocket.on('connect', () => {
        console.log('WebSocket connected successfully for deployment tracking');
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error for deployment tracking:', error);
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected for deployment tracking:', reason);
      });
      
      setSocket(newSocket);

      // Initialize progress array
      const initialProgress = steps.map((step, index) => ({
        step: index,
        name: step,
        status: 'pending',
        message: '',
        timestamp: null
      }));
      setProgress(initialProgress);

      // Set initial state based on deployment status
      if (deploymentStatus === 'completed') {
        setIsComplete(true);
        // Mark all steps as completed for completed deployments
        const completedProgress = initialProgress.map(step => ({
          ...step,
          status: 'completed',
          timestamp: new Date().toISOString()
        }));
        setProgress(completedProgress);
        setCurrentStep(steps.length - 1);
      } else if (deploymentStatus === 'failed') {
        setHasFailed(true);
      }

      // Listen for deployment progress updates
      newSocket.on('deployment-progress', (data) => {
        if (data.installationId === installationId) {
          console.log('Deployment progress update:', data);
          
          // Add to logs
          setLogs(prevLogs => [...prevLogs, {
            timestamp: data.timestamp,
            step: data.step,
            status: data.status,
            message: data.message
          }]);

          setProgress(prev => {
            const newProgress = [...prev];
            if (newProgress[data.step]) {
              newProgress[data.step] = {
                ...newProgress[data.step],
                status: data.status,
                message: data.message,
                timestamp: data.timestamp
              };
            }
            return newProgress;
          });

          setCurrentStep(data.step);

          // Check if deployment is complete
          if (data.step === steps.length - 1 && data.status === 'completed') {
            setIsComplete(true);
            // Refresh the page to show admin credentials and updated deployment status
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }

          // Check if any step failed
          if (data.status === 'failed') {
            setHasFailed(true);
          }
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [shouldShow, installationId, deploymentStatus]);

  if (!shouldShow) {
    return null;
  }

  const getStepIcon = (step) => {
    switch (step.status) {
      case 'completed':
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full">
            <svg className="w-3 h-3 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full">
            <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full">
            <svg className="w-3 h-3 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600"></div>
        );
    }
  };

  const completedSteps = progress.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 sm:mb-8">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
            {isComplete ? 'Deployment Complete!' : hasFailed ? 'Deployment Issues' : 'Deployment Progress'}
          </h2>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
          >
            {showLogs ? 'Hide Logs' : 'Show Server Logs'}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>{completedSteps} of {steps.length} steps completed</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                hasFailed ? 'bg-red-600' : isComplete ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4">
        {/* Steps */}
        <div className="space-y-3 mb-4">
          {progress.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              {getStepIcon(step)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${
                    step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    step.status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' :
                    step.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </h3>
                  {step.timestamp && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                {step.message && (
                  <div className="mt-1">
                    {step.status === 'failed' ? (
                      <details className="group">
                        <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300">
                          {step.message.length > 100 ? step.message.substring(0, 100) + '... (click to expand)' : step.message}
                        </summary>
                        <pre className="text-xs text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border overflow-x-auto whitespace-pre-wrap">
                          {step.message}
                        </pre>
                      </details>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Server Logs */}
        {showLogs && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Server Logs</h3>
            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="font-mono text-xs space-y-1">
                {logs.length > 0 ? logs.map((log, index) => (
                  <div key={index} className="text-gray-300 dark:text-gray-400">
                    <span className="text-gray-500 dark:text-gray-500">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className={`ml-2 ${
                      log.status === 'completed' ? 'text-green-400' :
                      log.status === 'in_progress' ? 'text-blue-400' :
                      log.status === 'failed' ? 'text-red-400' :
                      'text-gray-300'
                    }`}>
                      Step {log.step + 1}: {log.message}
                    </span>
                  </div>
                )) : (
                  <div className="text-gray-500 dark:text-gray-400">No logs available yet...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Footer */}
        {(isComplete || hasFailed) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center">
              {hasFailed && !isComplete && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Deployment encountered issues. Check the logs above for details.
                </p>
              )}
              {isComplete && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Deployment completed successfully! Your application should now be available.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}