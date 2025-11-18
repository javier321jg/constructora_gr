import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi, contactApi, imagesApi } from '../services/api';

// ============= HERO QUERIES =============
export const useHeroContent = () => {
  return useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const response = await contentApi.getHero();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

export const useUpdateHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => contentApi.updateHero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
    },
  });
};

// ============= ABOUT QUERIES =============
export const useAboutContent = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await contentApi.getAbout();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await contentApi.getStatistics();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

// ============= SERVICES QUERIES =============
export const useServices = (showAll = false) => {
  return useQuery({
    queryKey: ['services', showAll],
    queryFn: async () => {
      const response = await contentApi.getServices(showAll);
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useService = (id: number) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await contentApi.getService(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => contentApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      contentApi.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contentApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

// ============= PROJECTS QUERIES =============
export const useProjects = (filters?: any) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const response = await contentApi.getProjects(filters);
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await contentApi.getProject(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => contentApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      contentApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contentApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// ============= CONTACT QUERIES =============
export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      const response = await contactApi.getInfo();
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
    retry: 2,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => contactApi.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useContactMessages = (unreadOnly = false) => {
  return useQuery({
    queryKey: ['messages', unreadOnly],
    queryFn: async () => {
      const response = await contactApi.getMessages(unreadOnly);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

// ============= SITE CONFIG QUERIES =============
export const useSiteConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const response = await contentApi.getConfig();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};

// ============= IMAGE UPLOAD QUERIES =============
export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      imagesApi.upload(file, folder),
  });
};

export const useUploadImages = () => {
  return useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder?: string }) =>
      imagesApi.uploadMultiple(files, folder),
  });
};

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (url: string) => imagesApi.delete(url),
  });
};
