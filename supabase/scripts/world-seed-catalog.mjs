export const launchedCommunitySlugs = [
  'painting',
  'drawing',
  'digital-art',
  'photography',
  'sculpture-ceramics',
  'mixed-media-collage',
];

export const communityAffinities = {
  painting: ['drawing', 'mixed-media-collage', 'photography'],
  drawing: ['painting', 'digital-art', 'mixed-media-collage'],
  'digital-art': ['drawing', 'photography', 'mixed-media-collage'],
  photography: ['digital-art', 'drawing', 'painting'],
  'sculpture-ceramics': ['mixed-media-collage', 'painting', 'drawing'],
  'mixed-media-collage': ['painting', 'drawing', 'digital-art', 'sculpture-ceramics'],
};

export const goofyFirstParts = [
  'brush',
  'mud',
  'cranky',
  'pixel',
  'easel',
  'goblin',
  'snack',
  'derp',
  'chaos',
  'moss',
  'grease',
  'noodle',
  'goober',
  'glitch',
  'feral',
  'blob',
  'dust',
  'clown',
  'soggy',
  'smudge',
];

export const goofySecondParts = [
  'wizard',
  'bandit',
  'muffin',
  'bucket',
  'gremlin',
  'beast',
  'captain',
  'rascal',
  'giraffe',
  'badger',
  'walrus',
  'scooter',
  'pigeon',
  'meatball',
  'weasel',
  'pickle',
  'ferret',
  'potato',
  'melon',
  'hamster',
];

export const realFirstNames = [
  'Maya',
  'Jordan',
  'Evelyn',
  'Miles',
  'Avery',
  'Lena',
  'Sofia',
  'Malcolm',
  'Riley',
  'Naomi',
  'Eli',
  'Camila',
  'Theo',
  'Zoe',
  'Adrian',
  'Nora',
  'Isaac',
  'Clara',
  'Jasper',
  'Elena',
  'Noah',
  'Audrey',
  'Levi',
  'Mae',
  'Elijah',
];

export const realLastNames = [
  'Bennett',
  'Torres',
  'Nguyen',
  'Foster',
  'Morales',
  'Kim',
  'Sullivan',
  'Reed',
  'Patel',
  'Brooks',
  'Rivera',
  'Coleman',
  'Young',
  'Serrano',
  'Ward',
  'Bailey',
  'Chavez',
  'Diaz',
  'Mitchell',
  'Hayes',
  'Price',
  'Ellis',
  'Bell',
  'Warren',
  'Cruz',
];

export const encouragementFragments = [
  'The read lands fast without feeling overworked.',
  'The mood is immediate and really sticky.',
  'This feels polished without losing the hand of the maker.',
  'The composition is doing a lot of quiet heavy lifting.',
  'The palette restraint here is excellent.',
  'This has that “opened the app for five minutes and accidentally cooked” energy.',
];

export const critiqueFragments = [
  'I would push the darkest values one step further.',
  'The focal point is strong, but the edge control could go even harder.',
  'You might get more separation if the midtones stayed a little warmer.',
  'The whole thing is working; I’d just simplify one busy area.',
  'Try letting one shape stay quieter so the main read breathes.',
  'I think the background could fall back half a step and the subject would snap.',
];

export const processQuestions = [
  'How many passes did this take before the shapes locked in?',
  'Did you thumbnail this first or find it while working?',
  'Was this built from reference or did you riff most of it?',
  'What brush or material did you use for the texture pass?',
  'Did you mask anything off or just trust the hand?',
  'How much cleanup did you do after the first rough pass?',
];

export const memeFragments = [
  'This looks like the exact frame where the art teacher says “okay wow.”',
  'Respectfully, this is absurd in the best way.',
  'The little gremlin in my brain loves this.',
  'This is one of those posts that makes people reopen a dead sketchbook.',
  'Extremely specific vibe. I mean that as a compliment.',
  'This has “deranged but correct” energy and I support it.',
];

export const adviceFragments = [
  'A slightly cooler shadow pass could make the warm notes sing even more.',
  'If you want extra depth, reserve one clean highlight and let everything else stay softer.',
  'A tiny crop on one side could make the composition feel even tighter.',
  'You could probably stop one step earlier next time and keep the freshness.',
  'I’d keep the texture but simplify the silhouette on the next version.',
  'If this becomes a series, the format is strong enough to carry it.',
];

export const worldSeedCatalog = {
  painting: {
    titleLead: ['Ochre', 'Windowlight', 'Quiet', 'Blue Hour', 'Velvet', 'Rainy', 'Golden', 'Mossy'],
    styles: [
      {
        key: 'portrait-atelier',
        label: 'portrait atelier',
        mediums: ['Oil', 'Acrylic', 'Gouache'],
        subjects: ['Portrait', 'Figure', 'Photorealism', 'Expressionist'],
        searchBuckets: [
          { provider: 'met', query: 'portrait painting' },
          { provider: 'aic', query: 'portrait painting' },
        ],
        titleSubjects: ['Portrait', 'Sitter', 'Atelier Pass', 'Figure Study'],
        descriptionTemplates: [
          'Testing a slower {medium} pass to keep the {subject} read calm and direct.',
          'A studio piece built around warm shadows, soft edges, and one clean focal plane.',
          'Trying to keep the face painterly while still letting the silhouette stay sharp.',
        ],
      },
      {
        key: 'landscape-light',
        label: 'landscape light',
        mediums: ['Oil', 'Acrylic', 'Watercolor'],
        subjects: ['Landscape', 'Botanical', 'Expressionist', 'Photorealism'],
        searchBuckets: [
          { provider: 'met', query: 'landscape painting' },
          { provider: 'aic', query: 'landscape' },
        ],
        titleSubjects: ['Field Study', 'Evening Ridge', 'Rain Front', 'Light Notes'],
        descriptionTemplates: [
          'Built this around a narrow value range so the sky could do most of the work.',
          'Small color study chasing atmosphere before I scale it into a larger canvas.',
          'Trying to let the land stay simple and let the light carry the story.',
        ],
      },
      {
        key: 'still-life-table',
        label: 'still life table',
        mediums: ['Oil', 'Gouache', 'Watercolor'],
        subjects: ['Still Life', 'Botanical', 'Minimalist', 'Photorealism'],
        searchBuckets: [
          { provider: 'met', query: 'still life painting' },
          { provider: 'aic', query: 'still life' },
        ],
        titleSubjects: ['Table Study', 'Tea Cup', 'Shelf Notes', 'Studio Still Life'],
        descriptionTemplates: [
          'A small {medium} study built around ordinary objects and one risky reflected light.',
          'Trying to keep the table setup honest without sanding off all the texture.',
          'Quick still life to test how far I can push warm neutrals before it turns muddy.',
        ],
      },
      {
        key: 'fantasy-tableau',
        label: 'fantasy tableau',
        mediums: ['Acrylic', 'Gouache', 'Watercolor'],
        subjects: ['Concept Art', 'Surreal', 'Landscape', 'Expressionist'],
        searchBuckets: [
          { provider: 'commons', query: 'fantasy painting filetype:bitmap' },
          { provider: 'commons', query: 'mythological painting filetype:bitmap' },
        ],
        titleSubjects: ['Moon Garden', 'Dream Gate', 'Sky Stair', 'Lantern Path'],
        descriptionTemplates: [
          'Leaning into a more imaginative {medium} pass while still keeping the value grouping readable.',
          'Wanted this one to feel half fairytale, half color study, with the {subject} tag doing the heavy lift.',
          'Pushed the shapes into a slightly weirder place without letting the painting lose structure.',
        ],
      },
    ],
  },
  drawing: {
    titleLead: ['Smudged', 'Midnight', 'Crooked', 'Quiet', 'Loose', 'Dusty', 'Fast', 'Graphite'],
    styles: [
      {
        key: 'charcoal-portrait',
        label: 'charcoal portrait',
        mediums: ['Charcoal', 'Pencil'],
        subjects: ['Portrait', 'Figure', 'Expressionist', 'Photorealism'],
        searchBuckets: [
          { provider: 'met', query: 'charcoal drawing' },
          { provider: 'aic', query: 'charcoal drawing' },
        ],
        titleSubjects: ['Head Study', 'Portrait Pass', 'Gesture Portrait', 'Late Session'],
        descriptionTemplates: [
          'Quick studio drawing to test whether the charcoal could stay loose without losing the likeness.',
          'Trying to keep the dark masses big and simple instead of noodling every edge.',
          'This one started as a warm-up and turned into a full {subject} study.',
        ],
      },
      {
        key: 'ink-urban',
        label: 'ink urban',
        mediums: ['Ink', 'Marker', 'Pencil'],
        subjects: ['Urban', 'Figure', 'Minimalist', 'Landscape'],
        searchBuckets: [
          { provider: 'met', query: 'ink drawing' },
          { provider: 'commons', query: 'ink drawing city filetype:bitmap' },
        ],
        titleSubjects: ['Corner Notes', 'Street Lines', 'Window Seat', 'Crosswalk Sketch'],
        descriptionTemplates: [
          'Ink sketch chasing shape rhythm more than detail.',
          'Trying to make the city read with just enough line to keep it from stiffening up.',
          'Fast marker and ink pass from a reference set that felt weirder than expected.',
        ],
      },
      {
        key: 'pastel-botanical',
        label: 'pastel botanical',
        mediums: ['Pastel', 'Pencil'],
        subjects: ['Botanical', 'Still Life', 'Minimalist', 'Portrait'],
        searchBuckets: [
          { provider: 'met', query: 'pastel drawing' },
          { provider: 'aic', query: 'pastel drawing' },
        ],
        titleSubjects: ['Soft Study', 'Garden Notes', 'Petal Pass', 'Plant Study'],
        descriptionTemplates: [
          'Pastel and pencil study trying to stay soft without going sugary.',
          'Built this around a limited palette and a bunch of erased-back edges.',
          'More interested in the shape rhythm than the exact species here.',
        ],
      },
      {
        key: 'creature-sketch',
        label: 'creature sketch',
        mediums: ['Pencil', 'Ink', 'Marker'],
        subjects: ['Concept Art', 'Surreal', 'Wildlife', 'Fan Art'],
        searchBuckets: [
          { provider: 'commons', query: 'fantasy drawing filetype:bitmap' },
          { provider: 'commons', query: 'creature drawing filetype:bitmap' },
        ],
        titleSubjects: ['Gremlin Sheet', 'Creature Pass', 'Little Menace', 'Cave Friend'],
        descriptionTemplates: [
          'Sketchbook page where the shapes got progressively stranger and I decided not to stop it.',
          'Trying to keep the creature readable with just silhouette, line weight, and a couple marker notes.',
          'Started as a joke thumbnail, ended up keeping the whole weird page.',
        ],
      },
    ],
  },
  'digital-art': {
    titleLead: ['Signal', 'Neon', 'Derpy', 'Lunar', 'Rust', 'Fantasy', 'Pixel', 'Glitch'],
    styles: [
      {
        key: 'fantasy-keyframe',
        label: 'fantasy keyframe',
        mediums: ['Digital', '3D'],
        subjects: ['Concept Art', 'Landscape', 'Surreal', 'Fan Art'],
        searchBuckets: [
          { provider: 'commons', query: 'fantasy illustration filetype:bitmap' },
          { provider: 'commons', query: 'concept art filetype:bitmap' },
        ],
        titleSubjects: ['Keyframe', 'Shrine Shot', 'Boss Room', 'Forest Gate'],
        descriptionTemplates: [
          'Paint-over and lighting pass for a fantasy frame that started as a rough block-in.',
          'Trying to keep the keyframe moody without burying the read.',
          'A digital scene study where I mostly cared about scale, atmosphere, and one loud focal shape.',
        ],
      },
      {
        key: 'voxel-chaos',
        label: 'voxel chaos',
        mediums: ['Digital', 'Vector', '3D'],
        subjects: ['Concept Art', 'Minimalist', 'Urban', 'Fan Art'],
        searchBuckets: [
          { provider: 'commons', query: 'voxel art filetype:bitmap' },
          { provider: 'commons', query: 'pixel art filetype:bitmap' },
        ],
        titleSubjects: ['Block Party', 'Tiny Realm', 'Chunk World', 'Gremlin Map'],
        descriptionTemplates: [
          'Leaning into blocky shapes and goofy energy without locking it to any specific franchise.',
          'A little voxel-ish test that somehow got more emotional than expected.',
          'Built this one from primitive forms and then left the charming weirdness alone.',
        ],
      },
      {
        key: 'surreal-poster',
        label: 'surreal poster',
        mediums: ['Digital', 'Vector'],
        subjects: ['Abstract', 'Surreal', 'Minimalist', 'Expressionist'],
        searchBuckets: [
          { provider: 'commons', query: 'digital illustration filetype:bitmap' },
          { provider: 'commons', query: 'abstract illustration filetype:bitmap' },
        ],
        titleSubjects: ['Poster Draft', 'Signal Bloom', 'Ghost Ad', 'Nocturne Sheet'],
        descriptionTemplates: [
          'Poster study where I kept chasing a cleaner silhouette and stranger color choices.',
          'Trying to make the typography and image feel like they were fighting a little, but on purpose.',
          'This one is mostly shape design, texture, and a very stubborn accent color.',
        ],
      },
      {
        key: 'creature-render',
        label: 'creature render',
        mediums: ['Digital', '3D'],
        subjects: ['Concept Art', 'Wildlife', 'Surreal', 'Fan Art'],
        searchBuckets: [
          { provider: 'commons', query: 'fantasy creature illustration filetype:bitmap' },
          { provider: 'commons', query: 'dragon illustration filetype:bitmap' },
        ],
        titleSubjects: ['Creature Pass', 'Mud Sprite', 'Cave Lurker', 'Bog Friend'],
        descriptionTemplates: [
          'A render pass for a design that was supposed to be throwaway and absolutely refused to leave.',
          'Wanted the creature to feel cute, suspicious, and slightly underqualified for hero work.',
          'Playing with scale cues and texture before I over-model the whole thing.',
        ],
      },
    ],
  },
  photography: {
    titleLead: ['Quiet', 'Neon', 'Rain', 'Golden', 'Crosswalk', 'River', 'Backlot', 'Birdsong'],
    styles: [
      {
        key: 'street-frame',
        label: 'street frame',
        mediums: ['Digital', 'Film'],
        subjects: ['Urban', 'Minimalist', 'Photorealism'],
        searchBuckets: [
          { provider: 'commons', query: 'street photography filetype:bitmap' },
          { provider: 'commons', query: 'urban photograph filetype:bitmap' },
        ],
        titleSubjects: ['Street Frame', 'Crosswalk', 'Platform Light', 'Corner Turn'],
        descriptionTemplates: [
          'Street capture where the geometry did more than the subject ever could.',
          'A quick frame that somehow lined up all at once and then disappeared.',
          'Trying to keep the grade subtle and let the composition carry the image.',
        ],
      },
      {
        key: 'portrait-natural',
        label: 'portrait natural',
        mediums: ['Digital', 'Film'],
        subjects: ['Portrait', 'Figure', 'Photorealism'],
        searchBuckets: [
          { provider: 'commons', query: 'portrait photograph filetype:bitmap' },
          { provider: 'commons', query: 'editorial portrait photograph filetype:bitmap' },
        ],
        titleSubjects: ['Natural Light', 'Portrait Session', 'Side Window', 'Late Afternoon'],
        descriptionTemplates: [
          'Natural light portrait with just enough grading to keep the skin tones from going sleepy.',
          'Trying to keep the portrait direct and un-fussy instead of over-styled.',
          'One of those shoots where the light did half the job for me.',
        ],
      },
      {
        key: 'wildlife-field',
        label: 'wildlife field',
        mediums: ['Digital', 'Film'],
        subjects: ['Wildlife', 'Photorealism', 'Botanical'],
        searchBuckets: [
          { provider: 'commons', query: 'wildlife photograph filetype:bitmap' },
          { provider: 'commons', query: 'bird photograph filetype:bitmap' },
        ],
        titleSubjects: ['Field Study', 'Perch', 'Wetland Frame', 'Watcher'],
        descriptionTemplates: [
          'Long-lens patience exercise that finally paid off with one usable frame.',
          'Trying to keep the edit respectful and let the environment stay present.',
          'A wildlife capture where the background ended up mattering almost as much as the subject.',
        ],
      },
      {
        key: 'landscape-weather',
        label: 'landscape weather',
        mediums: ['Digital', 'Film'],
        subjects: ['Landscape', 'Minimalist', 'Photorealism', 'Expressionist'],
        searchBuckets: [
          { provider: 'commons', query: 'landscape photograph filetype:bitmap' },
          { provider: 'commons', query: 'storm landscape photograph filetype:bitmap' },
        ],
        titleSubjects: ['Weather Pass', 'Mist Line', 'Roadside Light', 'Cloud Break'],
        descriptionTemplates: [
          'Landscape frame built around weather and a very small color shift.',
          'Trying to keep the scene understated and let the atmosphere do the storytelling.',
          'A travel frame where the sky changed faster than I could react.',
        ],
      },
    ],
  },
  'sculpture-ceramics': {
    titleLead: ['Kiln', 'Speckled', 'Bronze', 'Carved', 'Quiet', 'Glaze', 'Clay', 'Moss'],
    styles: [
      {
        key: 'vessel-glaze',
        label: 'vessel glaze',
        mediums: ['Clay'],
        subjects: ['Still Life', 'Minimalist', 'Botanical'],
        searchBuckets: [
          { provider: 'met', query: 'ceramic vessel' },
          { provider: 'aic', query: 'ceramic vessel' },
        ],
        titleSubjects: ['Glaze Test', 'Mug Pass', 'Vessel Study', 'Kiln Notes'],
        descriptionTemplates: [
          'Small ceramic study chasing a warmer glaze break and a cleaner lip.',
          'Functional piece with just enough weirdness to keep it from feeling too polite.',
          'Wanted the surface to stay tactile and slightly imperfect.',
        ],
      },
      {
        key: 'bronze-figure',
        label: 'bronze figure',
        mediums: ['Bronze', 'Wood'],
        subjects: ['Figure', 'Portrait', 'Expressionist'],
        searchBuckets: [
          { provider: 'met', query: 'bronze sculpture' },
          { provider: 'aic', query: 'bronze sculpture' },
        ],
        titleSubjects: ['Figure Cast', 'Bronze Pass', 'Gesture Form', 'Quiet Monument'],
        descriptionTemplates: [
          'Figure study focused more on weight and gesture than clean finish.',
          'Trying to keep the form readable from a distance before I over-describe the surface.',
          'This one lives somewhere between portrait, gesture, and stubborn material test.',
        ],
      },
      {
        key: 'carved-form',
        label: 'carved form',
        mediums: ['Wood', 'Clay'],
        subjects: ['Abstract', 'Minimalist', 'Botanical'],
        searchBuckets: [
          { provider: 'met', query: 'wood sculpture' },
          { provider: 'commons', query: 'wood sculpture filetype:bitmap' },
        ],
        titleSubjects: ['Carved Form', 'Grain Study', 'Studio Shape', 'Soft Monument'],
        descriptionTemplates: [
          'Material study where I mostly cared about silhouette and one clean interior curve.',
          'Trying to keep the form simple enough that the texture could stay loud.',
          'A carved piece that started botanical and ended up more abstract.',
        ],
      },
      {
        key: 'weird-idol',
        label: 'weird idol',
        mediums: ['Clay', 'Bronze'],
        subjects: ['Surreal', 'Figure', 'Concept Art'],
        searchBuckets: [
          { provider: 'met', query: 'statuette' },
          { provider: 'commons', query: 'ceramic figurine filetype:bitmap' },
        ],
        titleSubjects: ['Little Idol', 'Shelf Gremlin', 'Clay Friend', 'Odd Figure'],
        descriptionTemplates: [
          'Small sculptural character test with a face that is probably up to something.',
          'Made this one by following the material until it got a little weird and charming.',
          'A figure pass where the silhouette mattered more than anatomical honesty.',
        ],
      },
    ],
  },
  'mixed-media-collage': {
    titleLead: ['Tape', 'Cutout', 'Static', 'Sage', 'Noise', 'Paper', 'Patchwork', 'Gluey'],
    styles: [
      {
        key: 'paper-collage',
        label: 'paper collage',
        mediums: ['Mixed', 'Fiber', 'Digital'],
        subjects: ['Abstract', 'Minimalist', 'Botanical'],
        searchBuckets: [
          { provider: 'commons', query: 'collage art filetype:bitmap' },
          { provider: 'aic', query: 'collage' },
        ],
        titleSubjects: ['Paper Stack', 'Cutout Study', 'Patch Notes', 'Layer Pass'],
        descriptionTemplates: [
          'Layered paper study trying to keep the shapes lively without losing the structure.',
          'Mostly torn edges, one digital cleanup pass, and a lot of stubborn rearranging.',
          'I wanted this collage to feel casual up close and deliberate from across the room.',
        ],
      },
      {
        key: 'spray-layer',
        label: 'spray layer',
        mediums: ['Mixed', 'Spray Paint', 'Digital'],
        subjects: ['Urban', 'Abstract', 'Expressionist'],
        searchBuckets: [
          { provider: 'commons', query: 'mixed media art filetype:bitmap' },
          { provider: 'commons', query: 'street art collage filetype:bitmap' },
        ],
        titleSubjects: ['Wall Fragment', 'Spray Notes', 'City Layer', 'Noise Poster'],
        descriptionTemplates: [
          'Mixed-media piece built around noisy texture and one clean graphic interruption.',
          'Trying to make the spray layer and paper layer fight each other in a useful way.',
          'This started as scraps on the table and ended up feeling like a little wall fragment.',
        ],
      },
      {
        key: 'textile-assemblage',
        label: 'textile assemblage',
        mediums: ['Fiber', 'Mixed', 'Clay'],
        subjects: ['Botanical', 'Abstract', 'Surreal'],
        searchBuckets: [
          { provider: 'commons', query: 'fiber art filetype:bitmap' },
          { provider: 'commons', query: 'assemblage art filetype:bitmap' },
        ],
        titleSubjects: ['Assemblage', 'Thread Study', 'Soft Structure', 'Pinned Garden'],
        descriptionTemplates: [
          'Pulled together fabric, thread, and a few harder shapes to keep the whole thing from floating away.',
          'A softer mixed-media pass where I let the materials decide more than I usually do.',
          'Trying to make the fiber elements feel structural instead of decorative.',
        ],
      },
      {
        key: 'derpy-mashup',
        label: 'derpy mashup',
        mediums: ['Mixed', 'Digital', 'Spray Paint'],
        subjects: ['Fan Art', 'Surreal', 'Concept Art', 'Urban'],
        searchBuckets: [
          { provider: 'commons', query: 'pixel art collage filetype:bitmap' },
          { provider: 'commons', query: 'surreal collage filetype:bitmap' },
        ],
        titleSubjects: ['Goblin Poster', 'Chaos Sheet', 'Derpy Mix', 'Sticker Wall'],
        descriptionTemplates: [
          'Wanted this to feel a little meme-adjacent, a little sincere, and a little too loud.',
          'Mixed-media nonsense with a surprising amount of shape discipline holding it together.',
          'I let the weird digital bits stay weird instead of sanding them into generic polish.',
        ],
      },
    ],
  },
};
