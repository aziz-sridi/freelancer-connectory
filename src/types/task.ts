
export interface Task {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  comments?: Comment[];
  status?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date | string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  comments: Comment[];
  completed: boolean;
}
