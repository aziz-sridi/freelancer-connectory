
export type UserRole = 'freelancer' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  coverPicture?: string;
  bio?: string;
  skills?: string[];
  createdAt: string;
}

export interface FreelancerProfile extends User {
  role: 'freelancer';
  skills: string[];
  bio: string;
  projects: Project[];
}

export interface ProviderProfile extends User {
  role: 'provider';
  company?: string;
  website?: string;
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  freelancerId: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  providerId: string;
  providerName: string;
  createdAt: string;
  status: 'open' | 'closed';
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'job' | 'application' | 'message';
  relatedId?: string;
}
