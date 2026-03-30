export interface SocialLinks {
  instagram?: string;
  website?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  bio: string | null;
  social_links: SocialLinks;
  is_professional: boolean;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_emoji: string;
  cover_image_url: string | null;
  member_count: number;
  is_launched: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  images: string[];
  medium_tags: string[];
  subject_tags: string[];
  community_id: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  text: string;
  created_at: string;
}

export interface PostAuthorPreview {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_professional: boolean;
}

export interface PostCommunityPreview {
  id: string;
  name: string;
  slug: string;
  icon_emoji: string;
}

export interface FeedPost extends Post {
  author: PostAuthorPreview | null;
  community: PostCommunityPreview | null;
  image_aspect_ratio: number;
  preview_image_url: string | null;
}

export interface PostDetail extends FeedPost {}

export interface CommentWithAuthor extends Comment {
  author: PostAuthorPreview | null;
}
