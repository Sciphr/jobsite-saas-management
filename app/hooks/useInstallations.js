import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys for consistent caching
export const installationKeys = {
  all: ['installations'],
  lists: () => [...installationKeys.all, 'list'],
  list: (filters) => [...installationKeys.lists(), filters],
  details: () => [...installationKeys.all, 'detail'],
  detail: (id) => [...installationKeys.details(), id],
  basic: (id) => [...installationKeys.all, 'basic', id],
  backupHistory: (id) => [...installationKeys.all, 'backup-history', id],
};

// Hook to fetch basic installation data (for editing)
export function useInstallationBasic(id) {
  return useQuery({
    queryKey: installationKeys.basic(id),
    queryFn: async () => {
      if (!id) throw new Error('Installation ID is required');
      
      const response = await fetch(`/api/installations/${id}/basic`);
      if (!response.ok) {
        throw new Error('Failed to fetch installation');
      }
      
      const data = await response.json();
      return data.installation;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to fetch full installation data (with related data)
export function useInstallationDetail(id) {
  return useQuery({
    queryKey: installationKeys.detail(id),
    queryFn: async () => {
      if (!id) throw new Error('Installation ID is required');
      
      const response = await fetch(`/api/installations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch installation');
      }
      
      const data = await response.json();
      return data.installation;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for detailed data)
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch all installations (dashboard)
export function useInstallations() {
  return useQuery({
    queryKey: installationKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch installations');
      }
      
      const data = await response.json();
      return {
        installations: data.installations,
        stats: data.stats
      };
    },
    staleTime: 30 * 1000, // 30 seconds for dashboard
    cacheTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to update an installation
export function useUpdateInstallation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/installations/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update installation');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the cached data
      queryClient.setQueryData(
        installationKeys.basic(variables.id), 
        data.installation
      );
      queryClient.setQueryData(
        installationKeys.detail(variables.id), 
        data.installation
      );
      
      // Invalidate lists to refresh dashboard
      queryClient.invalidateQueries({ queryKey: installationKeys.lists() });
    },
  });
}

// Hook for health checks
export function useRunHealthCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (installationId) => {
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'run-check',
          installation_id: installationId 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to run health check');
      }
      
      return response.json();
    },
    onSuccess: (data, installationId) => {
      // Invalidate installation data to refresh health status
      queryClient.invalidateQueries({ 
        queryKey: installationKeys.detail(installationId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: installationKeys.basic(installationId) 
      });
    },
  });
}

// Hook to fetch backup history for an installation
export function useBackupHistory(installationId, enabled = true) {
  return useQuery({
    queryKey: installationKeys.backupHistory(installationId),
    queryFn: async () => {
      if (!installationId) throw new Error('Installation ID is required');
      
      const response = await fetch(`/api/backups?action=history&installation=${installationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch backup history');
      }
      
      return response.json();
    },
    enabled: !!installationId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for backups
export function useCreateBackup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (installationId) => {
      const response = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create-backup',
          installation_id: installationId 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create backup');
      }
      
      return response.json();
    },
    onSuccess: (data, installationId) => {
      // Invalidate installation data to refresh backup status
      queryClient.invalidateQueries({ 
        queryKey: installationKeys.detail(installationId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: installationKeys.basic(installationId) 
      });
      // Also invalidate backup history to show the new backup
      queryClient.invalidateQueries({ 
        queryKey: installationKeys.backupHistory(installationId) 
      });
    },
  });
}