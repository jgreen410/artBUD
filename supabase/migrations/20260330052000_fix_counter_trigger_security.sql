create or replace function public.sync_post_likes_count()
returns trigger
language plpgsql
security definer
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
security definer
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
security definer
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
