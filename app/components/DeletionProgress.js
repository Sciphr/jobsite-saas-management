"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function DeletionProgress({ installationId, isOpen, onClose, onComplete }) {
  const [socket, setSocket] = useState(null);
  const [progress, setProgress] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const steps = [
    'Stopping PM2 process',
    'Removing deployment directory',
    'Removing nginx configuration', 
    'Revoking SSL certificate',
    'Dropping customer database',
    'Removing MinIO bucket',
    'Releasing port assignment',
    'Cleaning up management database'
  ];

  useEffect(() => {
    if (isOpen && installationId) {
      // Initialize WebSocket connection
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? `${window.location.protocol}//${window.location.host}`
        : 'http://localhost:3101';
      console.log('Attempting to connect to WebSocket for deletion:', socketUrl);
      const newSocket = io(socketUrl, {
        path: '/socket.io/'
      });
      
      newSocket.on('connect', () => {
        console.log('WebSocket connected successfully for deletion');
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error for deletion:', error);
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected for deletion:', reason);
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

      // Listen for deletion progress updates
      newSocket.on('deletion-progress', (data) => {
        if (data.installationId === installationId) {
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

          // Check if deletion is complete
          if (data.step === steps.length - 1 && data.status === 'completed') {
            setIsComplete(true);
            if (onComplete) {
              setTimeout(onComplete, 2000); // Call completion handler after 2 seconds
            }
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
  }, [isOpen, installationId]);

  if (!isOpen) return null;

  const getStepIcon = (step) => {
    switch (step.status) {
      case 'completed':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full">
            <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full">
            <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full">
            <svg className="w-4 h-4 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'skipped':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
        );
    }
  };

  const completedSteps = progress.filter(step => step.status === 'completed' || step.status === 'skipped').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isComplete ? 'Deletion Complete!' : hasFailed ? 'Deletion Issues' : 'Deleting Installation...'}
            </h3>
            {(isComplete || hasFailed) && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>{completedSteps} of {steps.length} steps completed</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {progress.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                {getStepIcon(step)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      step.status === 'completed' || step.status === 'skipped' ? 'text-green-600 dark:text-green-400' :
                      step.status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' :
                      step.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.name}
                    </h4>
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
                        <p className={`text-sm ${
                          step.status === 'skipped' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {step.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {(isComplete || hasFailed) && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              {hasFailed && !isComplete && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Some steps failed. Fix the issues and try deletion again to retry failed steps.
                </p>
              )}
              <div className="flex justify-end space-x-2">
                {hasFailed && !isComplete && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Retry Deletion
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}