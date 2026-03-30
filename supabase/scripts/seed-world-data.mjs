import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

import {
  adviceFragments,
  communityAffinities,
  critiqueFragments,
  encouragementFragments,
  goofyFirstParts,
  goofySecondParts,
  launchedCommunitySlugs,
  memeFragments,
  processQuestions,
  realFirstNames,
  realLastNames,
  worldSeedCatalog,
} from './world-seed-catalog.mjs';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. The world seed is server-only.',
  );
}

const DEFAULT_BATCH = 'world-v1';
const DEFAULT_PASSWORD = process.env.ARTBUD_WORLD_PASSWORD || 'ArtBudWorld123!';
const TOTAL_USERS = 100;
const GOOFY_USER_COUNT = 75;
const POSTS_PER_COMMUNITY = 50;
const STYLE_POOL_TARGET = 4;
const API_HEADERS = {
  'User-Agent': 'ArtBudSeedWorld/1.0 (+https://github.com/jgreen410/artBUD)',
  Accept: 'application/json',
};

const PRIMARY_COMMUNITY_DISTRIBUTION = [
  ...Array(20).fill('painting'),
  ...Array(18).fill('drawing'),
  ...Array(19).fill('digital-art'),
  ...Array(15).fill('photography'),
  ...Array(11).fill('sculpture-ceramics'),
  ...Array(17).fill('mixed-media-collage'),
];

const COMMUNITY_LABELS = {
  painting: 'painting',
  drawing: 'drawing',
  'digital-art': 'digital art',
  photography: 'photography',
  'sculpture-ceramics': 'sculpture and ceramics',
  'mixed-media-collage': 'mixed media',
};

const COMMUNITY_ARTIFACTS = {
  painting: 'canvas',
  drawing: 'sketchbook',
  'digital-art': 'tablet',
  photography: 'camera roll',
  'sculpture-ceramics': 'kiln shelf',
  'mixed-media-collage': 'cut-paper pile',
};

const PROFILE_BIO_TEMPLATES = {
  painting: [
    'Studio {role} building {subject} pieces, color studies, and one stubborn series at a time.',
    '{roleLabel} leaning on slower paint sessions, warm shadows, and a sketchbook full of notes.',
  ],
  drawing: [
    '{roleLabel} chasing strong silhouettes, late-night studies, and cleaner line decisions.',
    'Usually buried in a {artifact}, working through {subject} ideas and value problems.',
  ],
  'digital-art': [
    '{roleLabel} mixing keyframes, poster studies, and slightly suspicious creature designs.',
    'Working between a {artifact}, rough block-ins, and too many layer comps.',
  ],
  photography: [
    '{roleLabel} collecting portraits, weather, and accidental geometry in the city.',
    'Mostly living in the {artifact}, trimming selects, and chasing quieter edits.',
  ],
  'sculpture-ceramics': [
    '{roleLabel} making tactile forms, glaze tests, and small figures with too much personality.',
    'Usually rotating between clay messes, kiln notes, and {subject} studies.',
  ],
  'mixed-media-collage': [
    '{roleLabel} assembling paper scraps, fiber bits, and digital cleanup into layered pieces.',
    'Working out of a {artifact} and pretending the studio floor is not part of the process.',
  ],
};

const TITLE_TAILS = [
  'After Rain',
  'For the Sketchbook',
  'Nocturne',
  'Studio Notes',
  'Warm-Up',
  'Field Version',
  'Quiet Version',
  'Second Pass',
  'Shelf Edition',
  'Weekend Session',
  'Late Light',
  'Grey Day',
];

const DESCRIPTION_ADDONS = [
  'Trying not to overfinish the best part.',
  'Mostly interested in the shape rhythm and one loud accent.',
  'The first version was too clean, so I let the rough edges survive.',
  'Still deciding if this stays a standalone piece or becomes part of a series.',
  'Kept the edit light so the texture could keep doing its thing.',
  'I wanted it to stay honest instead of polished flat.',
];

const COMMENT_SUPPORT_LINES = [
  'The main silhouette reads immediately.',
  'The value structure is doing a lot of work here.',
  'The texture choices feel intentional.',
  'There is a lot of personality in the shape language.',
  'The focal point lands without shouting.',
  'The quieter areas are helping the whole piece breathe.',
];

const COMMENT_PG_SNARK = [
  'Respectfully, the little goblin in my brain is delighted.',
  'This is wildly specific and I mean that as praise.',
  'You absolutely got away with something here.',
  'This feels one step away from chaos and that is why it works.',
  'It looks like a joke idea that accidentally became good.',
  'There is strong "I was only going to sketch for ten minutes" energy here.',
];

const SVG_PALETTES = [
  ['#C8852A', '#F5EDE0', '#7A8B6F'],
  ['#C4573A', '#F2EDE6', '#B8A48E'],
  ['#7A8B6F', '#F5EDE0', '#C08B7E'],
  ['#C08B7E', '#F2EDE6', '#C8852A'],
  ['#B8A48E', '#F5EDE0', '#C4573A'],
];

const commonHtmlEntities = {
  '&quot;': '"',
  '&#039;': "'",
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
};

const args = parseArgs(process.argv.slice(2));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const publicClient = anonKey
  ? createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

function parseArgs(argv) {
  const parsed = {
    batch: DEFAULT_BATCH,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dry-run') {
      parsed.dryRun = true;
      continue;
    }

    if (arg === '--batch') {
      parsed.batch = argv[index + 1] || DEFAULT_BATCH;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function hashNumber(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRng(seedValue) {
  let seed = hashNumber(seedValue) || 1;

  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}

function shuffle(rng, items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function uniqueBy(items, keySelector) {
  const seen = new Set();
  const uniqueItems = [];

  for (const item of items) {
    const key = keySelector(item);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueItems.push(item);
  }

  return uniqueItems;
}

function weightedSampleWithoutReplacement(items, count, weightSelector, rng) {
  const pool = [...items];
  const selected = [];

  while (selected.length < count && pool.length > 0) {
    let totalWeight = 0;
    const weights = pool.map((item) => {
      const weight = Math.max(0.0001, weightSelector(item));
      totalWeight += weight;
      return weight;
    });

    let threshold = rng() * totalWeight;
    let chosenIndex = 0;

    for (let index = 0; index < pool.length; index += 1) {
      threshold -= weights[index];

      if (threshold <= 0) {
        chosenIndex = index;
        break;
      }
    }

    selected.push(pool.splice(chosenIndex, 1)[0]);
  }

  return selected;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function titleCase(value) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function romanize(value) {
  const numerals = [
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];

  let remaining = value;
  let output = '';

  for (const [symbol, amount] of numerals) {
    while (remaining >= amount) {
      output += symbol;
      remaining -= amount;
    }
  }

  return output;
}

function cleanText(value) {
  return value
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€™/g, "'")
    .replace(/â€"/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHtml(value = '') {
  let text = value;

  for (const [entity, replacement] of Object.entries(commonHtmlEntities)) {
    text = text.replaceAll(entity, replacement);
  }

  return cleanText(text.replace(/<[^>]+>/g, ' '));
}

function chunk(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function hashedJitter(seedValue) {
  return (hashNumber(seedValue) % 1000) / 1000;
}

function looksLikeUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getFileExtensionFromUrl(url, fallback = 'jpg') {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();

    if (extension && /^[a-z0-9]+$/.test(extension)) {
      return extension === 'jpeg' ? 'jpg' : extension;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function extensionFromContentType(contentType, url) {
  const normalized = (contentType || '').split(';')[0].trim().toLowerCase();

  if (normalized === 'image/png') {
    return 'png';
  }

  if (normalized === 'image/webp') {
    return 'webp';
  }

  if (normalized === 'image/svg+xml') {
    return 'svg';
  }

  return getFileExtensionFromUrl(url, 'jpg');
}

async function withRetries(label, task, attempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      if (attempt === attempts) {
        break;
      }

      console.warn(`[seed:world] retrying ${label} after failure ${attempt}/${attempts - 1}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }

  throw lastError;
}

async function uploadToStorageWithRetries(bucket, path, payload, contentType, attempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { error } = await supabase.storage.from(bucket).upload(path, payload, {
      contentType,
      upsert: true,
    });

    if (!error) {
      return;
    }

    lastError = error;

    if (attempt === attempts) {
      break;
    }

    console.warn(`[seed:world] retrying ${bucket}/${path} after upload error ${attempt}/${attempts - 1}: ${error.message}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }

  throw lastError;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status}: ${url}`);
  }

  return response.json();
}

async function listAllUsers() {
  const allUsers = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    allUsers.push(...data.users);

    if (data.users.length < 200) {
      break;
    }

    page += 1;
  }

  return allUsers;
}

function buildIdentity(index, goofy, usedUsernames, rng) {
  if (goofy) {
    const first = pick(rng, goofyFirstParts);
    const second = pick(rng, goofySecondParts);
    const displayName = `${titleCase(first)} ${titleCase(second)}`;
    let username = slugify(`${first}_${second}`);

    if (usedUsernames.has(username)) {
      username = `${username}_${String(index + 1).padStart(2, '0')}`;
    }

    usedUsernames.add(username);

    return {
      displayName,
      username,
      goofy: true,
    };
  }

  const firstName = pick(rng, realFirstNames);
  const lastName = pick(rng, realLastNames);
  const displayName = `${firstName} ${lastName}`;
  let username = slugify(`${firstName}_${lastName}`);

  if (usedUsernames.has(username)) {
    username = `${username}_${String(index + 1).padStart(2, '0')}`;
  }

  usedUsernames.add(username);

  return {
    displayName,
    username,
    goofy: false,
  };
}

function buildMemberships(primaryCommunity, rng) {
  const roll = rng();
  const targetCount = roll < 0.18 ? 1 : roll < 0.56 ? 2 : roll < 0.86 ? 3 : 4;
  const memberships = [primaryCommunity];
  const affinity = communityAffinities[primaryCommunity] || [];
  const available = launchedCommunitySlugs.filter((slug) => slug !== primaryCommunity);

  while (memberships.length < targetCount && available.length > 0) {
    const selected = weightedSampleWithoutReplacement(
      available.filter((slug) => !memberships.includes(slug)),
      1,
      (slug) => {
        let weight = 1 + hashedJitter(`${primaryCommunity}:${slug}`);

        if (affinity.includes(slug)) {
          weight += 5;
        }

        if (slug === 'mixed-media-collage' || primaryCommunity === 'mixed-media-collage') {
          weight += 0.6;
        }

        return weight;
      },
      rng,
    )[0];

    memberships.push(selected);
  }

  return memberships;
}

function buildSocialLinks(username, goofy, isProfessional, primaryCommunity, rng) {
  const links = {};
  const handles = [
    ['instagram', `https://instagram.com/${username}`],
    ['website', `https://${username}.example.com`],
    ['tiktok', `https://tiktok.com/@${username}`],
    ['twitter', `https://x.com/${username}`],
  ];
  const targetCount = isProfessional ? (rng() < 0.65 ? 2 : 1) : (rng() < 0.28 ? 1 : 0);
  const selectedLinks = weightedSampleWithoutReplacement(
    handles,
    targetCount,
    ([key]) => {
      if (key === 'website' && isProfessional) {
        return 3;
      }

      if (key === 'tiktok' && (goofy || primaryCommunity === 'digital-art')) {
        return 2.5;
      }

      return 1.5;
    },
    rng,
  );

  for (const [key, value] of selectedLinks) {
    links[key] = value;
  }

  return links;
}

function buildBio(spec, rng) {
  const communityLabel = COMMUNITY_LABELS[spec.primaryCommunity];
  const styles = worldSeedCatalog[spec.primaryCommunity].styles;
  const style = pick(rng, styles);
  const subject = pick(rng, style.subjects).toLowerCase();
  const role = spec.isProfessional ? 'professional' : 'hobbyist';
  const roleLabel = spec.isProfessional ? `working ${communityLabel} artist` : `${communityLabel} hobbyist`;
  const artifact = COMMUNITY_ARTIFACTS[spec.primaryCommunity];
  const template = pick(rng, PROFILE_BIO_TEMPLATES[spec.primaryCommunity]);

  return cleanText(
    template
      .replaceAll('{role}', role)
      .replaceAll('{roleLabel}', roleLabel)
      .replaceAll('{subject}', subject)
      .replaceAll('{artifact}', artifact),
  );
}

function paletteForSeed(seedValue) {
  return SVG_PALETTES[hashNumber(seedValue) % SVG_PALETTES.length];
}

function buildAvatarSvg(spec) {
  const [primary, secondary, accent] = paletteForSeed(spec.username);
  const initials = spec.displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary}" />
      <stop offset="100%" stop-color="${secondary}" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="180" fill="url(#g)" />
  <circle cx="118" cy="134" r="72" fill="${accent}" opacity="0.35" />
  <circle cx="390" cy="360" r="94" fill="${accent}" opacity="0.22" />
  <text x="256" y="292" text-anchor="middle" fill="#2A1F14" font-size="178" font-family="Georgia, serif" font-weight="700">${initials}</text>
</svg>`;
}

function buildCoverSvg(spec) {
  const [primary, secondary, accent] = paletteForSeed(`${spec.username}:cover`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="720" viewBox="0 0 1600 720">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${secondary}" />
      <stop offset="100%" stop-color="${primary}" />
    </linearGradient>
  </defs>
  <rect width="1600" height="720" fill="url(#g)" />
  <circle cx="240" cy="210" r="180" fill="${accent}" opacity="0.22" />
  <circle cx="1220" cy="520" r="220" fill="${accent}" opacity="0.18" />
  <rect x="420" y="140" width="540" height="340" rx="92" fill="#F5EDE0" opacity="0.24" transform="rotate(-8 690 310)" />
  <rect x="930" y="160" width="240" height="240" rx="68" fill="#F2EDE6" opacity="0.28" transform="rotate(12 1050 280)" />
  <text x="100" y="630" fill="#2A1F14" opacity="0.86" font-size="66" font-family="Georgia, serif">${titleCase(COMMUNITY_LABELS[spec.primaryCommunity])}</text>
</svg>`;
}

async function uploadTextAsset(bucket, path, text) {
  const payload = Buffer.from(text, 'utf8');
  await uploadToStorageWithRetries(bucket, path, payload, 'image/svg+xml');

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function publicBucketUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function fetchMetCandidates(query) {
  const search = await fetchJson(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(query)}`,
  );
  const objectIds = Array.isArray(search.objectIDs) ? search.objectIDs.slice(0, 24) : [];

  const details = await Promise.all(
    objectIds.map((objectId) =>
      fetchJson(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`).catch(() => null),
    ),
  );

  return details
    .filter((item) => item?.isPublicDomain && (item.primaryImageSmall || item.primaryImage))
    .map((item) => ({
      sourceKey: `met-${item.objectID}`,
      provider: 'met',
      title: cleanText(item.title || `Met ${item.objectID}`),
      artist: cleanText(item.artistDisplayName || ''),
      sourceUrl: item.primaryImageSmall || item.primaryImage,
      pageUrl: item.objectURL || `https://www.metmuseum.org/art/collection/search/${item.objectID}`,
      license: 'Public Domain',
    }));
}

async function fetchAicCandidates(query) {
  const payload = await fetchJson(
    `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&query[term][is_public_domain]=true&fields=id,title,image_id,artist_display&limit=24`,
  );

  return (payload.data || [])
    .filter((item) => item.image_id)
    .map((item) => ({
      sourceKey: `aic-${item.id}`,
      provider: 'aic',
      title: cleanText(item.title || `AIC ${item.id}`),
      artist: cleanText(item.artist_display || ''),
      sourceUrl: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
      pageUrl: `https://www.artic.edu/artworks/${item.id}`,
      license: 'Public Domain',
    }));
}

function commonsLicenseIsOpen(rawLicense) {
  const normalized = normalizeHtml(rawLicense).toLowerCase();

  return (
    normalized.includes('public domain') ||
    normalized.includes('cc by') ||
    normalized.includes('creative commons attribution')
  );
}

async function fetchCommonsCandidates(query) {
  const payload = await fetchJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=24&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200`,
  );

  const pages = Object.values(payload.query?.pages || {});

  return pages
    .map((page) => {
      const imageInfo = page.imageinfo?.[0];
      const metadata = imageInfo?.extmetadata || {};
      const license =
        metadata.LicenseShortName?.value ||
        metadata.License?.value ||
        metadata.UsageTerms?.value ||
        '';

      if (!imageInfo?.url || !commonsLicenseIsOpen(license)) {
        return null;
      }

      return {
        sourceKey: `commons-${page.pageid}`,
        provider: 'commons',
        title: cleanText(String(page.title || '').replace(/^File:/, '')),
        artist: normalizeHtml(metadata.Artist?.value || ''),
        sourceUrl: imageInfo.thumburl || imageInfo.url,
        pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || '')}`,
        license: normalizeHtml(license),
      };
    })
    .filter(Boolean);
}

const providerFetchers = {
  met: fetchMetCandidates,
  aic: fetchAicCandidates,
  commons: fetchCommonsCandidates,
};

async function candidateSourceIsReachable(candidate, reachabilityCache) {
  const cacheKey = candidate.sourceUrl;

  if (reachabilityCache.has(cacheKey)) {
    return reachabilityCache.get(cacheKey);
  }

  const reachable = await withRetries(`probe ${candidate.sourceKey}`, async () => {
    const response = await fetch(candidate.sourceUrl, {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return false;
    }

    await response.body?.cancel();
    return true;
  });

  reachabilityCache.set(cacheKey, reachable);
  return reachable;
}

async function buildAssetPools() {
  const queryCache = new Map();
  const candidateByKey = new Map();
  const stylePools = new Map();
  const communityPools = new Map();
  const reachabilityCache = new Map();

  for (const communitySlug of launchedCommunitySlugs) {
    const communityConfig = worldSeedCatalog[communitySlug];
    const fallbackBuckets = uniqueBy(
      communityConfig.styles.flatMap((style) => style.searchBuckets),
      (bucket) => `${bucket.provider}:${bucket.query}`,
    );
    const communityPool = [];

    for (const style of communityConfig.styles) {
      const stylePool = [];
      const bucketQueue = uniqueBy(
        [...style.searchBuckets, ...fallbackBuckets],
        (bucket) => `${bucket.provider}:${bucket.query}`,
      ).filter((bucket) => bucket.provider !== 'met');

      for (const bucket of bucketQueue) {
        const cacheKey = `${bucket.provider}:${bucket.query}`;
        let candidates = queryCache.get(cacheKey);

        if (!candidates) {
          try {
            candidates = await providerFetchers[bucket.provider](bucket.query);
            candidates = uniqueBy(candidates, (candidate) => candidate.sourceKey).sort((left, right) =>
              left.sourceKey.localeCompare(right.sourceKey),
            );
          } catch (error) {
            console.warn(`[seed:world] asset query failed for ${cacheKey}: ${error.message}`);
            candidates = [];
          }

          queryCache.set(cacheKey, candidates);
        }

        for (const candidate of candidates) {
          const isReachable = await candidateSourceIsReachable(candidate, reachabilityCache);

          if (!isReachable) {
            continue;
          }

          if (stylePool.some((entry) => entry.sourceKey === candidate.sourceKey)) {
            continue;
          }

          stylePool.push(candidate);

          if (!communityPool.some((entry) => entry.sourceKey === candidate.sourceKey)) {
            communityPool.push(candidate);
          }

          candidateByKey.set(candidate.sourceKey, candidate);
        }

        if (stylePool.length >= STYLE_POOL_TARGET) {
          break;
        }
      }

      if (stylePool.length === 0) {
        throw new Error(`Unable to resolve any open-license artwork for ${communitySlug}/${style.key}.`);
      }

      stylePools.set(
        `${communitySlug}:${style.key}`,
        stylePool.slice(0, Math.min(STYLE_POOL_TARGET, stylePool.length)).map((candidate) => candidate.sourceKey),
      );
    }

    communityPools.set(
      communitySlug,
      communityPool.slice(0, Math.min(8, communityPool.length)).map((candidate) => candidate.sourceKey),
    );
  }

  return {
    stylePools,
    communityPools,
    candidateByKey,
  };
}

function buildWorldUsers(batch) {
  const usedUsernames = new Set();
  const typeSchedule = shuffle(
    createRng(`${batch}:type-schedule`),
    [...Array(GOOFY_USER_COUNT).fill(true), ...Array(TOTAL_USERS - GOOFY_USER_COUNT).fill(false)],
  );
  const primarySchedule = shuffle(createRng(`${batch}:primary-schedule`), PRIMARY_COMMUNITY_DISTRIBUTION);
  const users = [];

  for (let index = 0; index < TOTAL_USERS; index += 1) {
    const rng = createRng(`${batch}:user:${index}`);
    const identity = buildIdentity(index, typeSchedule[index], usedUsernames, rng);
    const primaryCommunity = primarySchedule[index];
    const communities = buildMemberships(primaryCommunity, rng);
    const isProfessional = rng() < 0.2;
    const activityScore = Number(
      (
        0.8 +
        rng() * 2.6 +
        (communities.length - 1) * 0.22 +
        (isProfessional ? 0.45 : 0) +
        (rng() < 0.1 ? 1.2 : 0)
      ).toFixed(2),
    );
    const email = `${slugify(batch)}.${String(index + 1).padStart(3, '0')}.${identity.username}@artbud.demo`;
    const spec = {
      batch,
      index,
      email,
      password: DEFAULT_PASSWORD,
      username: identity.username,
      displayName: identity.displayName,
      goofy: identity.goofy,
      primaryCommunity,
      communities,
      isProfessional,
      activityScore,
    };

    spec.bio = buildBio(spec, rng);
    spec.socialLinks = buildSocialLinks(spec.username, spec.goofy, spec.isProfessional, spec.primaryCommunity, rng);
    users.push(spec);
  }

  return users;
}

function makeUniqueTitle(authorId, baseTitle, titlesByAuthor) {
  const seenTitles = titlesByAuthor.get(authorId) || new Map();
  const currentCount = seenTitles.get(baseTitle) || 0;
  const nextCount = currentCount + 1;

  seenTitles.set(baseTitle, nextCount);
  titlesByAuthor.set(authorId, seenTitles);

  if (currentCount === 0) {
    return baseTitle;
  }

  return `${baseTitle} ${romanize(nextCount)}`;
}

function chooseAssetKeys(stylePool, communityPool, count, rng) {
  const pool = uniqueBy([...(stylePool || []), ...(communityPool || [])], (value) => value);
  const shuffled = shuffle(rng, pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function buildDescription(style, mediumTags, subjectTags, rng) {
  const template = cleanText(pick(rng, style.descriptionTemplates));
  const withTags = template
    .replaceAll('{medium}', mediumTags[0])
    .replaceAll('{subject}', subjectTags[0].toLowerCase());

  if (rng() < 0.55) {
    return `${withTags} ${pick(rng, DESCRIPTION_ADDONS)}`;
  }

  return withTags;
}

function buildPostSpecs(batch, userSpecs, communitiesBySlug, assetPools) {
  const posts = [];
  const titlesByAuthor = new Map();
  const membersByCommunity = new Map(
    launchedCommunitySlugs.map((communitySlug) => [
      communitySlug,
      userSpecs.filter((user) => user.communities.includes(communitySlug)),
    ]),
  );

  for (const communitySlug of launchedCommunitySlugs) {
    const communityConfig = worldSeedCatalog[communitySlug];
    const styles = communityConfig.styles;
    const styleSchedule = shuffle(
      createRng(`${batch}:style-schedule:${communitySlug}`),
      Array.from({ length: POSTS_PER_COMMUNITY }, (_, index) => styles[index % styles.length]),
    );

    for (let index = 0; index < POSTS_PER_COMMUNITY; index += 1) {
      const rng = createRng(`${batch}:post:${communitySlug}:${index}`);
      const style = styleSchedule[index];
      const communityMembers = membersByCommunity.get(communitySlug);
      const [author] = weightedSampleWithoutReplacement(
        communityMembers,
        1,
        (user) => user.activityScore * (user.primaryCommunity === communitySlug ? 2.4 : 1.1),
        rng,
      );
      const mediumCount = style.mediums.length > 2 && rng() < 0.32 ? 2 : 1;
      const subjectCount = style.subjects.length > 2 && rng() < 0.42 ? 2 : 1;
      const mediumTags = weightedSampleWithoutReplacement(
        style.mediums,
        Math.min(mediumCount, style.mediums.length),
        (medium) => 1 + hashedJitter(`${style.key}:${medium}`),
        rng,
      );
      const subjectTags = weightedSampleWithoutReplacement(
        style.subjects,
        Math.min(subjectCount, style.subjects.length),
        (subject) => 1 + hashedJitter(`${style.key}:${subject}`),
        rng,
      );
      const galleryCount = rng() < 0.68 ? 1 : rng() < 0.88 ? 2 : rng() < 0.97 ? 3 : 4;
      const assetKeys = chooseAssetKeys(
        assetPools.stylePools.get(`${communitySlug}:${style.key}`),
        assetPools.communityPools.get(communitySlug),
        galleryCount,
        rng,
      );
      const titleBase = `${pick(rng, communityConfig.titleLead)} ${pick(rng, style.titleSubjects)}${
        rng() < 0.48 ? `: ${pick(rng, TITLE_TAILS)}` : ''
      }`;
      const title = makeUniqueTitle(author.id, titleBase, titlesByAuthor);
      const description = buildDescription(style, mediumTags, subjectTags, rng);
      const engagementRoll = rng();
      const likeCountTarget =
        engagementRoll < 0.12 ? randInt(rng, 2, 7) : engagementRoll < 0.84 ? randInt(rng, 8, 22) : randInt(rng, 23, 40);
      const commentCountTarget =
        engagementRoll < 0.12 ? randInt(rng, 0, 2) : engagementRoll < 0.84 ? randInt(rng, 3, 8) : randInt(rng, 10, 18);

      posts.push({
        authorId: author.id,
        authorUsername: author.username,
        authorDisplayName: author.displayName,
        communityId: communitiesBySlug.get(communitySlug).id,
        communitySlug,
        title,
        description,
        images: assetKeys,
        medium_tags: mediumTags,
        subject_tags: subjectTags,
        likeCountTarget,
        commentCountTarget,
        styleKey: style.key,
        styleLabel: style.label,
      });
    }
  }

  return posts;
}

function sharedCommunityCount(left, right) {
  const rightMemberships = new Set(right.communities);
  return left.communities.filter((community) => rightMemberships.has(community)).length;
}

function followWeight(follower, following) {
  return (
    0.5 +
    sharedCommunityCount(follower, following) * 3.2 +
    (follower.primaryCommunity === following.primaryCommunity ? 2.4 : 0) +
    following.activityScore * 0.8 +
    (following.isProfessional ? 0.6 : 0) +
    hashedJitter(`${follower.username}:${following.username}`)
  );
}

function buildFollowSpecs(batch, userSpecs) {
  const follows = [];

  for (const follower of userSpecs) {
    const rng = createRng(`${batch}:follow:${follower.username}`);
    const candidates = userSpecs.filter((candidate) => candidate.id !== follower.id);
    const targetCount = Math.min(
      candidates.length,
      Math.max(2, Math.min(14, Math.round(follower.activityScore * 2.2 + rng() * 3))),
    );
    const selected = weightedSampleWithoutReplacement(
      candidates,
      targetCount,
      (candidate) => followWeight(follower, candidate),
      rng,
    );

    for (const following of selected) {
      follows.push({
        follower_id: follower.id,
        following_id: following.id,
      });
    }
  }

  return uniqueBy(follows, (follow) => `${follow.follower_id}:${follow.following_id}`);
}

function likeWeight(user, post, author) {
  return (
    0.5 +
    (user.communities.includes(post.communitySlug) ? 4.8 : 0.5) +
    sharedCommunityCount(user, author) * 1.9 +
    (user.primaryCommunity === post.communitySlug ? 2.6 : 0) +
    user.activityScore * 0.45 +
    hashedJitter(`${user.username}:${post.title}`)
  );
}

function buildLikeSpecs(batch, postRows, userSpecs) {
  const userById = new Map(userSpecs.map((user) => [user.id, user]));
  const likes = [];

  for (const post of postRows) {
    const rng = createRng(`${batch}:likes:${post.authorId}:${post.title}`);
    const author = userById.get(post.authorId);
    const candidates = userSpecs.filter((user) => user.id !== post.authorId);
    const selected = weightedSampleWithoutReplacement(
      candidates,
      Math.min(post.likeCountTarget, candidates.length),
      (user) => likeWeight(user, post, author),
      rng,
    );

    for (const liker of selected) {
      likes.push({
        user_id: liker.id,
        post_id: post.id,
      });
    }
  }

  return uniqueBy(likes, (like) => `${like.user_id}:${like.post_id}`);
}

function buildCommentText(post, commenter, commentIndex, rng) {
  const medium = post.medium_tags[0]?.toLowerCase() || 'material';
  const subject = post.subject_tags[0]?.toLowerCase() || 'piece';
  const tonePool = commenter.goofy
    ? ['meme', 'encouragement', 'question', 'advice', 'critique']
    : ['encouragement', 'critique', 'question', 'advice', 'encouragement'];
  const tone = tonePool[(commentIndex + Math.floor(rng() * tonePool.length)) % tonePool.length];

  if (tone === 'question') {
    return `${cleanText(pick(rng, processQuestions))} The ${subject} choices are carrying a lot of the read.`;
  }

  if (tone === 'critique') {
    return `${cleanText(pick(rng, critiqueFragments))} The ${medium} handling is already close.`;
  }

  if (tone === 'advice') {
    return `${cleanText(pick(rng, adviceFragments))} The ${subject} side of it is already there.`;
  }

  if (tone === 'meme') {
    return `${pick(rng, COMMENT_PG_SNARK)} ${cleanText(pick(rng, memeFragments))}`;
  }

  return `${cleanText(pick(rng, encouragementFragments))} ${pick(rng, COMMENT_SUPPORT_LINES)}`;
}

function commentWeight(user, post, author) {
  return (
    0.4 +
    (user.communities.includes(post.communitySlug) ? 5.2 : 0.2) +
    sharedCommunityCount(user, author) * 1.5 +
    user.activityScore * 0.55 +
    (user.primaryCommunity === post.communitySlug ? 2 : 0) +
    hashedJitter(`${user.username}:${post.title}:comment`)
  );
}

function buildCommentSpecs(batch, postRows, userSpecs) {
  const userById = new Map(userSpecs.map((user) => [user.id, user]));
  const comments = [];

  for (const post of postRows) {
    const rng = createRng(`${batch}:comments:${post.authorId}:${post.title}`);
    const author = userById.get(post.authorId);
    const candidates = userSpecs.filter((user) => user.id !== post.authorId);
    const selected = weightedSampleWithoutReplacement(
      candidates,
      Math.min(post.commentCountTarget, candidates.length),
      (user) => commentWeight(user, post, author),
      rng,
    );

    for (let index = 0; index < selected.length; index += 1) {
      const commenter = selected[index];

      comments.push({
        post_id: post.id,
        author_id: commenter.id,
        text: buildCommentText(post, commenter, index, rng),
      });
    }
  }

  return comments;
}

async function ensureUsersAndProfiles(userSpecs, dryRun) {
  const existingUsers = await listAllUsers();
  const existingUsersByEmail = new Map(existingUsers.map((user) => [user.email, user]));
  const userStats = {
    created: 0,
    reused: 0,
  };

  for (const userSpec of userSpecs) {
    const existing = existingUsersByEmail.get(userSpec.email);

    if (dryRun) {
      if (existing) {
        userStats.reused += 1;
        userSpec.id = existing.id;
      } else {
        userStats.created += 1;
        userSpec.id = `dry-${createHash('sha1').update(userSpec.email).digest('hex').slice(0, 16)}`;
      }

      continue;
    }

    let userRecord = existing;

    if (!existing) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userSpec.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          username: userSpec.username,
          display_name: userSpec.displayName,
        },
      });

      if (error) {
        throw error;
      }

      userRecord = data.user;
      existingUsersByEmail.set(userSpec.email, userRecord);
      userStats.created += 1;
    } else {
      const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          username: userSpec.username,
          display_name: userSpec.displayName,
        },
      });

      if (error) {
        throw error;
      }

      userRecord = data.user;
      userStats.reused += 1;
    }

    userSpec.id = userRecord.id;
    const avatarPath = `seed-world/${userSpec.batch}/${userSpec.username}.svg`;
    const coverPath = `seed-world/${userSpec.batch}/${userSpec.username}.svg`;
    userSpec.avatarUrl = publicBucketUrl('avatars', avatarPath);
    userSpec.coverImageUrl = publicBucketUrl('covers', coverPath);

    if (!existing) {
      await uploadTextAsset('avatars', avatarPath, buildAvatarSvg(userSpec));
      await uploadTextAsset('covers', coverPath, buildCoverSvg(userSpec));
    }

    const { error: profileError } = await supabase.from('users_profile').upsert(
      {
        id: userSpec.id,
        username: userSpec.username,
        display_name: userSpec.displayName,
        avatar_url: userSpec.avatarUrl,
        cover_image_url: userSpec.coverImageUrl,
        bio: userSpec.bio,
        social_links: userSpec.socialLinks,
        is_professional: userSpec.isProfessional,
      },
      {
        onConflict: 'id',
      },
    );

    if (profileError) {
      throw profileError;
    }
  }

  return {
    existingUsersByEmail,
    userStats,
  };
}

async function fetchExistingMemberships(communityIds) {
  const { data, error } = await supabase
    .from('community_members')
    .select('community_id, user_id')
    .in('community_id', communityIds);

  if (error) {
    throw error;
  }

  return data;
}

async function fetchExistingPosts(authorIds) {
  const validAuthorIds = authorIds.filter((authorId) => looksLikeUuid(authorId));

  if (validAuthorIds.length === 0) {
    return [];
  }

  const rows = [];

  for (const authorIdChunk of chunk(validAuthorIds, 100)) {
    const { data, error } = await supabase.from('posts').select('id, title, author_id, community_id').in('author_id', authorIdChunk);

    if (error) {
      throw error;
    }

    rows.push(...data);
  }

  return rows;
}

async function fetchExistingFollows(worldUserIds) {
  const validUserIds = worldUserIds.filter((userId) => looksLikeUuid(userId));

  if (validUserIds.length === 0) {
    return [];
  }

  const rows = [];

  for (const followerChunk of chunk(validUserIds, 100)) {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, following_id')
      .in('follower_id', followerChunk);

    if (error) {
      throw error;
    }

    rows.push(...data);
  }

  return rows.filter(
    (row) => validUserIds.includes(row.follower_id) && validUserIds.includes(row.following_id),
  );
}

async function fetchExistingLikes(worldUserIds) {
  const validUserIds = worldUserIds.filter((userId) => looksLikeUuid(userId));

  if (validUserIds.length === 0) {
    return [];
  }

  const rows = [];

  for (const userIdChunk of chunk(validUserIds, 100)) {
    const { data, error } = await supabase.from('likes').select('user_id, post_id').in('user_id', userIdChunk);

    if (error) {
      throw error;
    }

    rows.push(...data);
  }

  return rows;
}

async function fetchExistingComments(postIds) {
  const validPostIds = postIds.filter((postId) => looksLikeUuid(postId));

  if (validPostIds.length === 0) {
    return [];
  }

  const rows = [];

  for (const postIdChunk of chunk(validPostIds, 100)) {
    const { data, error } = await supabase
      .from('comments')
      .select('post_id, author_id, text')
      .in('post_id', postIdChunk);

    if (error) {
      throw error;
    }

    rows.push(...data);
  }

  return rows;
}

async function mirrorSelectedAssets(candidateByKey, selectedSourceKeys, batch, dryRun) {
  const mirroredUrlByKey = new Map();

  for (const sourceKey of selectedSourceKeys) {
    const candidate = candidateByKey.get(sourceKey);

    if (!candidate) {
      throw new Error(`Missing candidate metadata for ${sourceKey}`);
    }

    const baseExtension = getFileExtensionFromUrl(candidate.sourceUrl, 'jpg');
    const objectPath = `seed-world/${batch}/${candidate.provider}/${candidate.sourceKey}.${baseExtension}`;

    if (dryRun) {
      mirroredUrlByKey.set(sourceKey, `${supabaseUrl}/storage/v1/object/public/post-images/${objectPath}`);
      continue;
    }

    const response = await withRetries(`source fetch ${candidate.sourceKey}`, () =>
      fetch(candidate.sourceUrl, {
        headers: API_HEADERS,
      }),
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch source image ${candidate.sourceUrl}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = extensionFromContentType(contentType, candidate.sourceUrl);
    const finalPath = `seed-world/${batch}/${candidate.provider}/${candidate.sourceKey}.${extension}`;
    const body = Buffer.from(await response.arrayBuffer());
    await uploadToStorageWithRetries('post-images', finalPath, body, contentType);

    const { data } = supabase.storage.from('post-images').getPublicUrl(finalPath);
    mirroredUrlByKey.set(sourceKey, data.publicUrl);
  }

  return {
    mirroredUrlByKey,
  };
}

async function applyMemberships(userSpecs, communitiesBySlug, dryRun) {
  const existingMemberships = await fetchExistingMemberships(
    launchedCommunitySlugs.map((slug) => communitiesBySlug.get(slug).id),
  );
  const existingKeys = new Set(existingMemberships.map((row) => `${row.community_id}:${row.user_id}`));
  const desiredMemberships = userSpecs.flatMap((user) =>
    user.communities.map((communitySlug) => ({
      community_id: communitiesBySlug.get(communitySlug).id,
      user_id: user.id,
    })),
  );
  const stats = {
    created: 0,
    reused: 0,
  };
  const newMemberships = [];

  for (const membership of desiredMemberships) {
    const key = `${membership.community_id}:${membership.user_id}`;

    if (existingKeys.has(key)) {
      stats.reused += 1;
      continue;
    }

    stats.created += 1;
    newMemberships.push(membership);
  }

  if (!dryRun && newMemberships.length > 0) {
    for (const rows of chunk(newMemberships, 500)) {
      const { error } = await supabase.from('community_members').upsert(rows, {
        onConflict: 'community_id,user_id',
      });

      if (error) {
        throw error;
      }
    }
  }

  return stats;
}

async function applyPosts(postSpecs, mirroredUrlByKey, dryRun) {
  const existingPosts = await fetchExistingPosts(uniqueBy(postSpecs.map((post) => post.authorId), (value) => value));
  const existingByKey = new Map(existingPosts.map((post) => [`${post.author_id}:${post.title}`, post]));
  const stats = {
    created: 0,
    reused: 0,
  };
  const newRows = [];

  for (const post of postSpecs) {
    const key = `${post.authorId}:${post.title}`;
    const existing = existingByKey.get(key);

    if (existing) {
      stats.reused += 1;
      post.id = existing.id;
      continue;
    }

    newRows.push({
      author_id: post.authorId,
      title: post.title,
      description: post.description,
      images: post.images.map((sourceKey) => mirroredUrlByKey.get(sourceKey)),
      medium_tags: post.medium_tags,
      subject_tags: post.subject_tags,
      community_id: post.communityId,
    });
    stats.created += 1;
  }

  if (!dryRun && newRows.length > 0) {
    for (const rows of chunk(newRows, 100)) {
      const { data, error } = await supabase
        .from('posts')
        .insert(rows)
        .select('id, author_id, title');

      if (error) {
        throw error;
      }

      for (const inserted of data) {
        existingByKey.set(`${inserted.author_id}:${inserted.title}`, inserted);
      }
    }
  }

  for (const post of postSpecs) {
    const key = `${post.authorId}:${post.title}`;
    const existing = existingByKey.get(key);

    if (!existing) {
      post.id = `dry-post-${createHash('sha1').update(key).digest('hex').slice(0, 16)}`;
      continue;
    }

    post.id = existing.id;
  }

  return stats;
}

async function applyFollows(followSpecs, dryRun) {
  const worldUserIds = uniqueBy(
    followSpecs.flatMap((follow) => [follow.follower_id, follow.following_id]),
    (value) => value,
  );
  const existing = await fetchExistingFollows(worldUserIds);
  const existingKeys = new Set(existing.map((follow) => `${follow.follower_id}:${follow.following_id}`));
  const newRows = [];
  const stats = {
    created: 0,
    reused: 0,
  };

  for (const follow of followSpecs) {
    const key = `${follow.follower_id}:${follow.following_id}`;

    if (existingKeys.has(key)) {
      stats.reused += 1;
      continue;
    }

    stats.created += 1;
    newRows.push(follow);
  }

  if (!dryRun && newRows.length > 0) {
    for (const rows of chunk(newRows, 500)) {
      const { error } = await supabase.from('follows').upsert(rows, {
        onConflict: 'follower_id,following_id',
      });

      if (error) {
        throw error;
      }
    }
  }

  return stats;
}

async function applyLikes(likeSpecs, dryRun) {
  const worldUserIds = uniqueBy(likeSpecs.map((like) => like.user_id), (value) => value);
  const existing = await fetchExistingLikes(worldUserIds);
  const existingKeys = new Set(existing.map((like) => `${like.user_id}:${like.post_id}`));
  const newRows = [];
  const stats = {
    created: 0,
    reused: 0,
  };

  for (const like of likeSpecs) {
    const key = `${like.user_id}:${like.post_id}`;

    if (existingKeys.has(key)) {
      stats.reused += 1;
      continue;
    }

    stats.created += 1;
    newRows.push(like);
  }

  if (!dryRun && newRows.length > 0) {
    for (const rows of chunk(newRows, 500)) {
      const { error } = await supabase.from('likes').upsert(rows, {
        onConflict: 'user_id,post_id',
      });

      if (error) {
        throw error;
      }
    }
  }

  return stats;
}

async function applyComments(commentSpecs, dryRun) {
  const existing = await fetchExistingComments(uniqueBy(commentSpecs.map((comment) => comment.post_id), (value) => value));
  const existingKeys = new Set(existing.map((comment) => `${comment.post_id}:${comment.author_id}:${comment.text}`));
  const newRows = [];
  const stats = {
    created: 0,
    reused: 0,
  };

  for (const comment of commentSpecs) {
    const key = `${comment.post_id}:${comment.author_id}:${comment.text}`;

    if (existingKeys.has(key)) {
      stats.reused += 1;
      continue;
    }

    stats.created += 1;
    newRows.push(comment);
  }

  if (!dryRun && newRows.length > 0) {
    for (const rows of chunk(newRows, 500)) {
      const { error } = await supabase.from('comments').insert(rows);

      if (error) {
        throw error;
      }
    }
  }

  return stats;
}

async function resolveCommunities() {
  const { data, error } = await supabase
    .from('communities')
    .select('id, slug, name, icon_emoji, is_launched')
    .in('slug', launchedCommunitySlugs);

  if (error) {
    throw error;
  }

  if (data.length !== launchedCommunitySlugs.length) {
    throw new Error('Missing one or more launch communities. Apply the schema migration first.');
  }

  return new Map(data.map((community) => [community.slug, community]));
}

async function verifyMirroredStorage(batch) {
  const { data: providerFolders, error: rootError } = await supabase.storage.from('post-images').list(`seed-world/${batch}`);

  if (rootError) {
    throw rootError;
  }

  let objectCount = 0;

  for (const folder of providerFolders || []) {
    const { data: files, error } = await supabase.storage.from('post-images').list(`seed-world/${batch}/${folder.name}`, {
      limit: 1000,
    });

    if (error) {
      throw error;
    }

    objectCount += files.filter((file) => file.name).length;
  }

  return {
    folderCount: providerFolders?.length || 0,
    objectCount,
  };
}

async function runAppAcceptance(sampleUsers) {
  if (!publicClient) {
    return {
      skipped: true,
      reason: 'EXPO_PUBLIC_SUPABASE_ANON_KEY missing',
    };
  }

  const results = [];

  for (const sampleUser of sampleUsers) {
    const loginClient = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const { data: authData, error: authError } = await loginClient.auth.signInWithPassword({
      email: sampleUser.email,
      password: DEFAULT_PASSWORD,
    });

    if (authError) {
      throw authError;
    }

    const { data: profile, error: profileError } = await loginClient
      .from('users_profile')
      .select('id, username, display_name')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data: memberships, error: membershipError } = await loginClient
      .from('community_members')
      .select('community_id, communities:community_id (id, name, slug)')
      .eq('user_id', authData.user.id);

    if (membershipError) {
      throw membershipError;
    }

    const { data: feedPosts, error: feedError } = await loginClient
      .from('posts')
      .select('id, title, likes_count, comments_count, community_id')
      .order('created_at', { ascending: false })
      .limit(12);

    if (feedError) {
      throw feedError;
    }

    const communityId = memberships?.[0]?.community_id;
    const { data: communityPosts, error: communityPostsError } = await loginClient
      .from('posts')
      .select('id, title')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .limit(8);

    if (communityPostsError) {
      throw communityPostsError;
    }

    await loginClient.auth.signOut();

    results.push({
      email: sampleUser.email,
      username: profile.username,
      communities: memberships?.length || 0,
      feedPosts: feedPosts?.length || 0,
      variedCounts:
        new Set((feedPosts || []).map((post) => `${post.likes_count}:${post.comments_count}`)).size > 2,
      communityPosts: communityPosts?.length || 0,
    });
  }

  return {
    skipped: false,
    results,
  };
}

function printSummary(summary) {
  console.log(`World seed batch: ${summary.batch}${summary.dryRun ? ' (dry run)' : ''}`);
  console.log(`Shared password: ${DEFAULT_PASSWORD}`);
  console.log(`Users -> created ${summary.userStats.created}, reused ${summary.userStats.reused}`);
  console.log(
    `Memberships -> created ${summary.membershipStats.created}, reused ${summary.membershipStats.reused}`,
  );
  console.log(`Posts -> created ${summary.postStats.created}, reused ${summary.postStats.reused}`);
  console.log(`Follows -> created ${summary.followStats.created}, reused ${summary.followStats.reused}`);
  console.log(`Likes -> created ${summary.likeStats.created}, reused ${summary.likeStats.reused}`);
  console.log(`Comments -> created ${summary.commentStats.created}, reused ${summary.commentStats.reused}`);

  if (!summary.dryRun) {
    console.log(
      `Mirrored images -> ${summary.storageSummary.objectCount} objects across ${summary.storageSummary.folderCount} provider folders`,
    );
  }

  console.log('Per-community world post counts:');

  for (const [slug, count] of Object.entries(summary.postCountsByCommunity)) {
    console.log(`- ${slug}: ${count}`);
  }

  console.log('Sample world logins:');

  for (const credential of summary.sampleCredentials) {
    console.log(`- ${credential.email} / ${DEFAULT_PASSWORD}`);
  }

  if (summary.appAcceptance.skipped) {
    console.log(`App acceptance skipped: ${summary.appAcceptance.reason}`);
  } else {
    console.log('App acceptance summary:');

    for (const result of summary.appAcceptance.results) {
      console.log(
        `- ${result.email}: joined ${result.communities}, feed ${result.feedPosts}, community feed ${result.communityPosts}, varied counts ${result.variedCounts}`,
      );
    }
  }
}

async function main() {
  const communitiesBySlug = await resolveCommunities();
  const userSpecs = buildWorldUsers(args.batch);
  const { userStats } = await ensureUsersAndProfiles(userSpecs, args.dryRun);
  const membershipStats = await applyMemberships(userSpecs, communitiesBySlug, args.dryRun);
  const assetPools = await buildAssetPools();
  const postSpecs = buildPostSpecs(args.batch, userSpecs, communitiesBySlug, assetPools);
  const selectedSourceKeys = uniqueBy(postSpecs.flatMap((post) => post.images), (value) => value);
  const { mirroredUrlByKey } = await mirrorSelectedAssets(
    assetPools.candidateByKey,
    selectedSourceKeys,
    args.batch,
    args.dryRun,
  );
  const postStats = await applyPosts(postSpecs, mirroredUrlByKey, args.dryRun);
  const followSpecs = buildFollowSpecs(args.batch, userSpecs);
  const followStats = await applyFollows(followSpecs, args.dryRun);
  const likeSpecs = buildLikeSpecs(args.batch, postSpecs, userSpecs);
  const likeStats = await applyLikes(likeSpecs, args.dryRun);
  const commentSpecs = buildCommentSpecs(args.batch, postSpecs, userSpecs);
  const commentStats = await applyComments(commentSpecs, args.dryRun);
  const postCountsByCommunity = Object.fromEntries(
    launchedCommunitySlugs.map((slug) => [slug, postSpecs.filter((post) => post.communitySlug === slug).length]),
  );
  const sampleCredentials = [
    userSpecs[0],
    userSpecs[Math.floor(userSpecs.length / 2)],
    userSpecs[userSpecs.length - 1],
  ].map((user) => ({
    email: user.email,
    username: user.username,
  }));
  const storageSummary = args.dryRun
    ? {
        folderCount: 0,
        objectCount: 0,
      }
    : await verifyMirroredStorage(args.batch);
  const appAcceptance = args.dryRun
    ? {
        skipped: true,
        reason: 'dry run',
      }
    : await runAppAcceptance([userSpecs[0], userSpecs[76]]);

  printSummary({
    batch: args.batch,
    dryRun: args.dryRun,
    userStats,
    membershipStats,
    postStats,
    followStats,
    likeStats,
    commentStats,
    postCountsByCommunity,
    sampleCredentials,
    storageSummary,
    appAcceptance,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
