begin;

create extension if not exists pgcrypto;

create table if not exists public.users_profile (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  avatar_url text,
  cover_image_url text,
  bio text,
  social_links jsonb not null default '{}'::jsonb,
  is_professional boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint users_profile_username_format check (username = lower(username) and username ~ '^[a-z0-9_]+$'),
  constraint users_profile_bio_length check (bio is null or char_length(bio) <= 280),
  constraint users_profile_social_links_object check (jsonb_typeof(social_links) = 'object')
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  icon_emoji text not null,
  cover_image_url text,
  member_count integer not null default 0,
  is_launched boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  constraint communities_member_count_non_negative check (member_count >= 0)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users_profile (id) on delete cascade,
  title text not null,
  description text,
  images text[] not null default '{}',
  medium_tags text[] not null default '{}',
  subject_tags text[] not null default '{}',
  community_id uuid not null references public.communities (id) on delete cascade,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  constraint posts_images_count check (cardinality(images) between 1 and 10),
  constraint posts_likes_count_non_negative check (likes_count >= 0),
  constraint posts_comments_count_non_negative check (comments_count >= 0)
);

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references public.users_profile (id) on delete cascade,
  joined_at timestamptz not null default timezone('utc', now()),
  constraint community_members_unique unique (community_id, user_id)
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.users_profile (id) on delete cascade,
  following_id uuid not null references public.users_profile (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  constraint follows_unique unique (follower_id, following_id),
  constraint follows_no_self_follow check (follower_id <> following_id)
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  constraint likes_unique unique (user_id, post_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.users_profile (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint comments_text_not_blank check (char_length(trim(text)) > 0)
);

create index if not exists idx_posts_community_id on public.posts (community_id);
create index if not exists idx_posts_author_id on public.posts (author_id);
create index if not exists idx_posts_created_at on public.posts (created_at desc);
create index if not exists idx_community_members_user_id on public.community_members (user_id);
create index if not exists idx_follows_follower_id on public.follows (follower_id);
create index if not exists idx_follows_following_id on public.follows (following_id);

create index if not exists idx_comments_post_id on public.comments (post_id);
create index if not exists idx_comments_author_id on public.comments (author_id);
create index if not exists idx_likes_post_id on public.likes (post_id);
create index if not exists idx_community_members_community_id on public.community_members (community_id);

create or replace function public.is_community_member(target_community_id uuid, target_user_id uuid)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.community_members as community_member
    where community_member.community_id = target_community_id
      and community_member.user_id = target_user_id
  );
$$;

create or replace function public.sync_post_likes_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_post_id uuid;
begin
  target_post_id := coalesce(new.post_id, old.post_id);

  update public.posts
  set likes_count = (
    select count(*)
    from public.likes
    where likes.post_id = target_post_id
  )
  where posts.id = target_post_id;

  return null;
end;
$$;

create or replace function public.sync_post_comments_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_post_id uuid;
begin
  target_post_id := coalesce(new.post_id, old.post_id);

  update public.posts
  set comments_count = (
    select count(*)
    from public.comments
    where comments.post_id = target_post_id
  )
  where posts.id = target_post_id;

  return null;
end;
$$;

create or replace function public.sync_community_member_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_community_id uuid;
begin
  target_community_id := coalesce(new.community_id, old.community_id);

  update public.communities
  set member_count = (
    select count(*)
    from public.community_members
    where community_members.community_id = target_community_id
  )
  where communities.id = target_community_id;

  return null;
end;
$$;

drop trigger if exists trg_sync_post_likes_count on public.likes;
create trigger trg_sync_post_likes_count
after insert or delete on public.likes
for each row
execute function public.sync_post_likes_count();

drop trigger if exists trg_sync_post_comments_count on public.comments;
create trigger trg_sync_post_comments_count
after insert or delete on public.comments
for each row
execute function public.sync_post_comments_count();

drop trigger if exists trg_sync_community_member_count on public.community_members;
create trigger trg_sync_community_member_count
after insert or delete on public.community_members
for each row
execute function public.sync_community_member_count();

alter table public.users_profile enable row level security;
alter table public.posts enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.follows enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

drop policy if exists "users_profile_read_all" on public.users_profile;
create policy "users_profile_read_all"
on public.users_profile
for select
to anon, authenticated
using (true);

drop policy if exists "users_profile_insert_own" on public.users_profile;
create policy "users_profile_insert_own"
on public.users_profile
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "users_profile_update_own" on public.users_profile;
create policy "users_profile_update_own"
on public.users_profile
for update
to authenticated
using (auth.uid() is not null and auth.uid() = id)
with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "communities_read_all" on public.communities;
create policy "communities_read_all"
on public.communities
for select
to anon, authenticated
using (true);

drop policy if exists "posts_read_all" on public.posts;
create policy "posts_read_all"
on public.posts
for select
to anon, authenticated
using (true);

drop policy if exists "posts_insert_own_in_joined_community" on public.posts;
create policy "posts_insert_own_in_joined_community"
on public.posts
for insert
to authenticated
with check (
  auth.uid() is not null
  and auth.uid() = author_id
  and public.is_community_member(community_id, auth.uid())
);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts
for update
to authenticated
using (auth.uid() is not null and auth.uid() = author_id)
with check (
  auth.uid() is not null
  and auth.uid() = author_id
  and public.is_community_member(community_id, auth.uid())
);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = author_id);

drop policy if exists "community_members_read_all" on public.community_members;
create policy "community_members_read_all"
on public.community_members
for select
to anon, authenticated
using (true);

drop policy if exists "community_members_insert_own" on public.community_members;
create policy "community_members_insert_own"
on public.community_members
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "community_members_delete_own" on public.community_members;
create policy "community_members_delete_own"
on public.community_members
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "follows_read_all" on public.follows;
create policy "follows_read_all"
on public.follows
for select
to anon, authenticated
using (true);

drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own"
on public.follows
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = follower_id);

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own"
on public.follows
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = follower_id);

drop policy if exists "likes_read_all" on public.likes;
create policy "likes_read_all"
on public.likes
for select
to anon, authenticated
using (true);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own"
on public.likes
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own"
on public.likes
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "comments_read_all" on public.comments;
create policy "comments_read_all"
on public.comments
for select
to anon, authenticated
using (true);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own"
on public.comments
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = author_id);

drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own"
on public.comments
for update
to authenticated
using (auth.uid() is not null and auth.uid() = author_id)
with check (auth.uid() is not null and auth.uid() = author_id);

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own"
on public.comments
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = author_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/*']),
  ('covers', 'covers', true, 10485760, array['image/*']),
  ('post-images', 'post-images', true, 15728640, array['image/*'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "storage_public_read_art_bud" on storage.objects;
create policy "storage_public_read_art_bud"
on storage.objects
for select
to public
using (bucket_id in ('avatars', 'covers', 'post-images'));

drop policy if exists "storage_authenticated_insert_art_bud" on storage.objects;
create policy "storage_authenticated_insert_art_bud"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('avatars', 'covers', 'post-images')
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "storage_authenticated_update_own_art_bud" on storage.objects;
create policy "storage_authenticated_update_own_art_bud"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('avatars', 'covers', 'post-images')
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id in ('avatars', 'covers', 'post-images')
  and owner_id = (select auth.uid()::text)
);

drop policy if exists "storage_authenticated_delete_own_art_bud" on storage.objects;
create policy "storage_authenticated_delete_own_art_bud"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('avatars', 'covers', 'post-images')
  and owner_id = (select auth.uid()::text)
);

insert into public.communities (id, name, slug, description, icon_emoji, cover_image_url, is_launched)
values
  ('10000000-0000-4000-8000-000000000001', 'Painting', 'painting', 'Oil, acrylic, watercolor, and gouache artists sharing finished work and process-forward experiments.', '🎨', 'https://picsum.photos/seed/artbud-painting/1200/800', true),
  ('10000000-0000-4000-8000-000000000002', 'Drawing', 'drawing', 'Pencil, charcoal, ink, and pastel work from sketchbook studies to polished illustration.', '✏️', 'https://picsum.photos/seed/artbud-drawing/1200/800', true),
  ('10000000-0000-4000-8000-000000000003', 'Digital Art', 'digital-art', 'Illustration, 3D, concept art, and AI-assisted workflows shaped for digital makers.', '🖥️', 'https://picsum.photos/seed/artbud-digital/1200/800', true),
  ('10000000-0000-4000-8000-000000000004', 'Photography', 'photography', 'Portraits, landscapes, documentary work, and experimental photography under one roof.', '📷', 'https://picsum.photos/seed/artbud-photo/1200/800', true),
  ('10000000-0000-4000-8000-000000000005', 'Sculpture & Ceramics', 'sculpture-ceramics', 'Clay, stone, bronze, and functional ceramics from hobby makers to established studios.', '🏺', 'https://picsum.photos/seed/artbud-ceramics/1200/800', true),
  ('10000000-0000-4000-8000-000000000006', 'Mixed Media & Collage', 'mixed-media-collage', 'Layered physical and digital compositions, collage experiments, and hybrid practices.', '✂️', 'https://picsum.photos/seed/artbud-mixed/1200/800', true),
  ('10000000-0000-4000-8000-000000000007', 'Printmaking & Letterpress', 'printmaking-letterpress', 'Coming soon: relief prints, etching, monotypes, and tactile press work.', '🖨️', 'https://picsum.photos/seed/artbud-print/1200/800', false),
  ('10000000-0000-4000-8000-000000000008', 'Textile & Fiber Art', 'textile-fiber-art', 'Coming soon: weaving, embroidery, soft sculpture, and material-driven fiber practices.', '🧵', 'https://picsum.photos/seed/artbud-fiber/1200/800', false),
  ('10000000-0000-4000-8000-000000000009', 'Street Art & Murals', 'street-art-murals', 'Coming soon: mural studies, graffiti lettering, and large-scale public work.', '🎭', 'https://picsum.photos/seed/artbud-street/1200/800', false),
  ('10000000-0000-4000-8000-000000000010', 'Calligraphy & Lettering', 'calligraphy-lettering', 'Coming soon: pointed pen, brush lettering, and typographic craft.', '🖋️', 'https://picsum.photos/seed/artbud-calligraphy/1200/800', false),
  ('10000000-0000-4000-8000-000000000011', 'Film & Video Art', 'film-video-art', 'Coming soon: motion studies, short-form art films, and cinematic visual experiments.', '🎬', 'https://picsum.photos/seed/artbud-film/1200/800', false),
  ('10000000-0000-4000-8000-000000000012', 'Jewelry & Metalwork', 'jewelry-metalwork', 'Coming soon: fabrication, casting, and wearable metal design.', '💍', 'https://picsum.photos/seed/artbud-jewelry/1200/800', false)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  icon_emoji = excluded.icon_emoji,
  cover_image_url = excluded.cover_image_url,
  is_launched = excluded.is_launched;

commit;
