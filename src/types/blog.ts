export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  categoryId: string;
  tags: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
}

export interface BlogTag {
  id: string;
  name: string;
}
