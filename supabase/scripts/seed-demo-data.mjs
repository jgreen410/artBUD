import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. The service role key is required for the server-only demo seed script.',
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const artists = [
  {
    email: 'marisol@artbud.demo',
    password: 'ArtBudDemo123!',
    username: 'marisolatelier',
    display_name: 'Marisol Vale',
    bio: 'Professional oil painter building cinematic still lifes and moody landscapes from a Brooklyn studio.',
    is_professional: true,
    avatar_url: 'https://picsum.photos/seed/artbud-avatar-marisol/400/400',
    cover_image_url: 'https://picsum.photos/seed/artbud-cover-marisol/1400/600',
    social_links: {
      instagram: 'https://instagram.com/marisolatelier',
      website: 'https://marisolatelier.example.com',
    },
    communities: ['painting', 'drawing', 'mixed-media-collage'],
  },
  {
    email: 'theo@artbud.demo',
    password: 'ArtBudDemo123!',
    username: 'theostudies',
    display_name: 'Theo Mercer',
    bio: 'Hobbyist sketchbook obsessive focused on charcoal portraits, ink textures, and late-night cafe studies.',
    is_professional: false,
    avatar_url: 'https://picsum.photos/seed/artbud-avatar-theo/400/400',
    cover_image_url: 'https://picsum.photos/seed/artbud-cover-theo/1400/600',
    social_links: {
      instagram: 'https://instagram.com/theostudies',
    },
    communities: ['drawing', 'painting', 'photography'],
  },
  {
    email: 'juniper@artbud.demo',
    password: 'ArtBudDemo123!',
    username: 'juniperpixels',
    display_name: 'Juniper Hart',
    bio: 'Freelance illustrator moving between painterly concept art, vector posters, and 3D scene studies.',
    is_professional: true,
    avatar_url: 'https://picsum.photos/seed/artbud-avatar-juniper/400/400',
    cover_image_url: 'https://picsum.photos/seed/artbud-cover-juniper/1400/600',
    social_links: {
      website: 'https://juniperhart.example.com',
      tiktok: 'https://tiktok.com/@juniperpixels',
    },
    communities: ['digital-art', 'drawing', 'mixed-media-collage'],
  },
  {
    email: 'nia@artbud.demo',
    password: 'ArtBudDemo123!',
    username: 'niaclayworks',
    display_name: 'Nia Sol',
    bio: 'Ceramic hobbyist making tactile vessels, glaze tests, and small clay figures inspired by botanical forms.',
    is_professional: false,
    avatar_url: 'https://picsum.photos/seed/artbud-avatar-nia/400/400',
    cover_image_url: 'https://picsum.photos/seed/artbud-cover-nia/1400/600',
    social_links: {
      instagram: 'https://instagram.com/niaclayworks',
    },
    communities: ['sculpture-ceramics', 'mixed-media-collage', 'painting'],
  },
  {
    email: 'ezra@artbud.demo',
    password: 'ArtBudDemo123!',
    username: 'ezrabloomworks',
    display_name: 'Ezra Bloom',
    bio: 'Working photographer balancing editorial portraiture, quiet street scenes, and experimental color grading.',
    is_professional: true,
    avatar_url: 'https://picsum.photos/seed/artbud-avatar-ezra/400/400',
    cover_image_url: 'https://picsum.photos/seed/artbud-cover-ezra/1400/600',
    social_links: {
      website: 'https://ezrabloom.example.com',
      twitter: 'https://x.com/ezrabloomworks',
    },
    communities: ['photography', 'digital-art', 'drawing'],
  },
];

const posts = [
  ['marisolatelier', 'painting', 'Quiet Table at Blue Hour', 'A still life built from a single lamp, a chipped teacup, and a stack of secondhand art books.', ['Oil', 'Canvas'], ['Still Life', 'Photorealism']],
  ['marisolatelier', 'painting', 'Storm Light Over Prospect Park', 'Testing cooler shadows against a warm sunset palette after a week of rain.', ['Oil'], ['Landscape', 'Expressionist']],
  ['marisolatelier', 'mixed-media-collage', 'Paper Fragments Study No. 2', 'Layered gouache swatches and torn magazine fragments to plan a larger wall piece.', ['Gouache', 'Mixed'], ['Abstract', 'Minimalist']],
  ['theostudies', 'drawing', 'Corner Booth Portrait', 'Quick charcoal pass from my sketchbook session last night.', ['Charcoal'], ['Portrait', 'Figure']],
  ['theostudies', 'drawing', 'Window Seat Hands', 'Ink line practice focused on gesture and overlapping forms.', ['Ink'], ['Figure', 'Minimalist']],
  ['theostudies', 'painting', 'Cafeteria Lemon in Gouache', 'Trying to paint small everyday objects without overworking the edges.', ['Gouache'], ['Still Life', 'Botanical']],
  ['theostudies', 'photography', 'Subway Reflection Test', 'Shot on a phone and pushed the contrast just enough to keep the glare interesting.', ['Digital'], ['Urban', 'Minimalist']],
  ['juniperpixels', 'digital-art', 'Forest Shrine Keyframe', 'Painterly concept frame for a personal fantasy world-building project.', ['Digital', '3D'], ['Concept Art', 'Landscape']],
  ['juniperpixels', 'digital-art', 'Poster Series: Lunar Transit', 'Vector shapes with grain overlays for a mock event poster set.', ['Vector', 'Digital'], ['Abstract', 'Minimalist']],
  ['juniperpixels', 'drawing', 'Creature Silhouette Page', 'Speed silhouettes before taking one of them into a polished illustration.', ['Marker', 'Pencil'], ['Concept Art', 'Surreal']],
  ['juniperpixels', 'mixed-media-collage', 'Scan-and-Paint Experiment', 'Printed textures, scanned marks, and digital paintover in one comp.', ['Mixed', 'Digital'], ['Abstract', 'Expressionist']],
  ['niaclayworks', 'sculpture-ceramics', 'Speckled Mug Glaze Test', 'Version three of the glaze combo that finally stayed warm in reduction.', ['Clay'], ['Still Life', 'Minimalist']],
  ['niaclayworks', 'sculpture-ceramics', 'Small Figure With Fern Crown', 'A hand-built character study inspired by botanical illustrations.', ['Clay'], ['Figure', 'Botanical']],
  ['niaclayworks', 'mixed-media-collage', 'Pressed Petals + Clay Tiles', 'Testing whether the wall tiles still feel soft once the clay enters the composition.', ['Mixed', 'Clay'], ['Botanical', 'Abstract']],
  ['niaclayworks', 'painting', 'Oxide Wash Color Notes', 'Loose brush notes to figure out what glazes I want to test next week.', ['Watercolor'], ['Abstract', 'Expressionist']],
  ['ezrabloomworks', 'photography', 'Rooftop Portrait in Ochre', 'Natural light portrait with just enough terracotta in the grade to echo the sunset.', ['Digital'], ['Portrait', 'Photorealism']],
  ['ezrabloomworks', 'photography', 'Crosswalk at 6:12 PM', 'Street frame where the crowd finally aligned into something graphic.', ['Digital'], ['Urban', 'Minimalist']],
  ['ezrabloomworks', 'photography', 'Bird Study Through Rain', 'A compressed wildlife shot taken through a wet windshield and cleaned up later.', ['Digital'], ['Wildlife', 'Photorealism']],
  ['ezrabloomworks', 'digital-art', 'Grade Study for a Photo Essay', 'Color grading stills before I lock the sequence for a small zine.', ['Digital'], ['Expressionist', 'Urban']],
  ['marisolatelier', 'drawing', 'Graphite Composition Map', 'A value map before I commit to a larger canvas.', ['Pencil'], ['Landscape', 'Minimalist']],
];

const commentTemplates = [
  { author: 'juniperpixels', text: 'The palette restraint here is excellent. The warm shadows are doing a lot of work.' },
  { author: 'theostudies', text: 'This makes me want to go back to my sketchbook immediately.' },
  { author: 'ezrabloomworks', text: 'The composition feels quiet in the best possible way.' },
  { author: 'marisolatelier', text: 'Love the surface texture on this one.' },
  { author: 'niaclayworks', text: 'The shapes feel really intentional without losing energy.' },
];

function imageSeed(slug, index) {
  return `https://picsum.photos/seed/${slug}-${index}/1200/1600`;
}

async function ensureUser(artist) {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw listError;
  }

  const existing = existingUsers.users.find((user) => user.email === artist.email);

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: artist.email,
    password: artist.password,
    email_confirm: true,
    user_metadata: {
      username: artist.username,
      display_name: artist.display_name,
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function main() {
  const communitySlugSet = new Set();

  for (const artist of artists) {
    for (const slug of artist.communities) {
      communitySlugSet.add(slug);
    }
  }

  for (const [, slug] of posts) {
    communitySlugSet.add(slug);
  }

  const { data: communities, error: communitiesError } = await supabase
    .from('communities')
    .select('id, slug')
    .in('slug', [...communitySlugSet]);

  if (communitiesError) {
    throw communitiesError;
  }

  if (communities.length !== communitySlugSet.size) {
    throw new Error(
      'Missing one or more seeded communities. Apply the SQL migration before running the demo seed script.',
    );
  }

  const communityBySlug = new Map(communities.map((community) => [community.slug, community.id]));
  const userByUsername = new Map();

  for (const artist of artists) {
    const user = await ensureUser(artist);
    userByUsername.set(artist.username, user);

    const { error: profileError } = await supabase.from('users_profile').upsert(
      {
        id: user.id,
        username: artist.username,
        display_name: artist.display_name,
        avatar_url: artist.avatar_url,
        cover_image_url: artist.cover_image_url,
        bio: artist.bio,
        social_links: artist.social_links,
        is_professional: artist.is_professional,
      },
      {
        onConflict: 'id',
      },
    );

    if (profileError) {
      throw profileError;
    }

    const memberships = artist.communities.map((slug) => ({
      community_id: communityBySlug.get(slug),
      user_id: user.id,
    }));

    const { error: membershipError } = await supabase.from('community_members').upsert(memberships, {
      onConflict: 'community_id,user_id',
    });

    if (membershipError) {
      throw membershipError;
    }
  }

  const { data: existingPosts, error: existingPostsError } = await supabase
    .from('posts')
    .select('id, title, author_id');

  if (existingPostsError) {
    throw existingPostsError;
  }

  const existingPostKeySet = new Set(existingPosts.map((post) => `${post.author_id}:${post.title}`));
  const insertedPosts = [];

  for (let index = 0; index < posts.length; index += 1) {
    const [username, communitySlug, title, description, mediumTags, subjectTags] = posts[index];
    const user = userByUsername.get(username);
    const key = `${user.id}:${title}`;

    if (existingPostKeySet.has(key)) {
      continue;
    }

    const { data: inserted, error: insertPostError } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title,
        description,
        images: [imageSeed(communitySlug, index + 1)],
        medium_tags: mediumTags,
        subject_tags: subjectTags,
        community_id: communityBySlug.get(communitySlug),
      })
      .select('id, author_id, title')
      .single();

    if (insertPostError) {
      throw insertPostError;
    }

    insertedPosts.push(inserted);
  }

  const { data: allPosts, error: allPostsError } = await supabase
    .from('posts')
    .select('id, title, author_id')
    .order('created_at', { ascending: true });

  if (allPostsError) {
    throw allPostsError;
  }

  const follows = [
    ['theostudies', 'marisolatelier'],
    ['juniperpixels', 'marisolatelier'],
    ['niaclayworks', 'marisolatelier'],
    ['ezrabloomworks', 'marisolatelier'],
    ['marisolatelier', 'juniperpixels'],
    ['marisolatelier', 'ezrabloomworks'],
    ['theostudies', 'juniperpixels'],
    ['ezrabloomworks', 'theostudies'],
  ].map(([follower, following]) => ({
    follower_id: userByUsername.get(follower).id,
    following_id: userByUsername.get(following).id,
  }));

  const { error: followsError } = await supabase.from('follows').upsert(follows, {
    onConflict: 'follower_id,following_id',
  });

  if (followsError) {
    throw followsError;
  }

  const likes = allPosts.slice(0, 12).flatMap((post, index) => {
    const likerUsernames = [
      artists[index % artists.length].username,
      artists[(index + 1) % artists.length].username,
    ];

    return likerUsernames
      .filter((username) => userByUsername.get(username).id !== post.author_id)
      .map((username) => ({
        user_id: userByUsername.get(username).id,
        post_id: post.id,
      }));
  });

  const { error: likesError } = await supabase.from('likes').upsert(likes, {
    onConflict: 'user_id,post_id',
  });

  if (likesError) {
    throw likesError;
  }

  const existingCommentsKeySet = new Set();
  const { data: existingComments, error: existingCommentsError } = await supabase
    .from('comments')
    .select('post_id, author_id, text');

  if (existingCommentsError) {
    throw existingCommentsError;
  }

  for (const comment of existingComments) {
    existingCommentsKeySet.add(`${comment.post_id}:${comment.author_id}:${comment.text}`);
  }

  const comments = allPosts.slice(0, 8).map((post, index) => {
    const template = commentTemplates[index % commentTemplates.length];
    return {
      post_id: post.id,
      author_id: userByUsername.get(template.author).id,
      text: template.text,
    };
  });

  const newComments = comments.filter(
    (comment) => !existingCommentsKeySet.has(`${comment.post_id}:${comment.author_id}:${comment.text}`),
  );

  if (newComments.length > 0) {
    const { error: commentsError } = await supabase.from('comments').insert(newComments);

    if (commentsError) {
      throw commentsError;
    }
  }

  console.log(
    `Demo seed complete: ${artists.length} artists, ${posts.length} post templates, ${insertedPosts.length} new posts created.`,
  );
  console.log('Sample login password for all demo users: ArtBudDemo123!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
