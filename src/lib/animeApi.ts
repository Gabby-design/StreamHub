import { AnimeSeries, AnimeEpisode } from '@/types/anime';
import { CURATED_MOVIES } from '@/lib/movieApi';

// Curated canonical anime records for instant fallback and high-speed delivery
const CURATED_ANIME: AnimeSeries[] = [
  {
    id: 'sakamoto-days',
    malId: 58943,
    title: 'SAKAMOTO DAYS',
    titleEnglish: 'Sakamoto Days',
    titleJapanese: 'サカモトデイズ',
    synopsis: 'Taro Sakamoto was once hailed as the greatest hitman of all time, feared by villains and admired by peers. One day, he fell in love with a convenience store clerk named Aoi, retired from the underworld, married, had a child, and gained some weight. Now living a quiet life running a local neighborhood market, former colleagues and lethal assassins come to disturb his domestic peace.',
    score: 8.7,
    episodesCount: 12,
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://media.kitsu.app/anime/48915/poster_image/large-37aa395d6e0fbd2e6cbce7f3f6c77347.jpeg',
    genres: ['Action', 'Comedy', 'Shonen'],
    studio: 'TMS Entertainment',
    status: 'Currently Airing',
    year: 2025,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE',
    trailerYoutubeId: '9TbmxbckSjE',
    hasSub: true,
    hasDub: true,
    rating: 'PG-13',
    resolution: '1080p',
    episodes: [
      {
        id: 'sakamoto-ep-1',
        number: 1,
        title: 'The Legendary Hitman',
        thumbnailUrl: 'https://media.kitsu.app/anime/48915/poster_image/large-37aa395d6e0fbd2e6cbce7f3f6c77347.jpeg',
        duration: '23:40',
        streamUrl: 'https://multiembed.mov/?video_id=Sakamoto%20Days&s=1&e=1',
        dubStreamUrl: 'https://vidsrc.to/embed/tv/58943/1/1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Taro Sakamoto defends his grocery store against an assassin strike team while keeping his promise to his wife.',
        streamServers: [
          { name: 'Server 1 (1080p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Sakamoto%20Days&s=1&e=1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p VidSrc)', url: 'https://vidsrc.to/embed/tv/58943/1/1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'sakamoto-ep-2',
        number: 2,
        title: 'Rules of the Sakamoto Family',
        thumbnailUrl: 'https://media.kitsu.app/anime/48915/cover_image/large-ea326302e1ec733e8c9b9ec2c9e830e0.jpeg',
        duration: '24:10',
        streamUrl: 'https://multiembed.mov/?video_id=Sakamoto%20Days&s=1&e=2',
        dubStreamUrl: 'https://vidsrc.to/embed/tv/58943/1/2',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Shin the telepathic assassin is sent to eliminate Sakamoto, only to find himself inspired by his peaceful home life.',
        streamServers: [
          { name: 'Server 1 (1080p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Sakamoto%20Days&s=1&e=2', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p VidSrc)', url: 'https://vidsrc.to/embed/tv/58943/1/2', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'sakamoto-ep-3',
        number: 3,
        title: 'Amusement Park Showdown',
        thumbnailUrl: 'https://media.kitsu.app/anime/48915/poster_image/small-7b5ecfa23e597bf6fe963d7e7c85aa16.jpeg',
        duration: '23:55',
        streamUrl: 'https://multiembed.mov/?video_id=Sakamoto%20Days&s=1&e=3',
        dubStreamUrl: 'https://vidsrc.to/embed/tv/58943/1/3',
        isHls: false,
        resolution: '1080p',
        synopsis: 'A family trip to the theme park turns into an acrobatic roller coaster brawl against sniper operatives.',
        streamServers: [
          { name: 'Server 1 (1080p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Sakamoto%20Days&s=1&e=3', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p VidSrc)', url: 'https://vidsrc.to/embed/tv/58943/1/3', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/9TbmxbckSjE', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
  },
  {
    id: 'attack-on-titan',
    malId: 16498,
    title: 'Shingeki no Kyojin',
    titleEnglish: 'Attack on Titan',
    titleJapanese: '進撃の巨人',
    synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. Eren Jaeger vows to cleanse the earth of Titans after tragedy strikes his hometown.',
    score: 9.1,
    episodesCount: 87,
    genres: ['Action', 'Dark Fantasy', 'Military', 'Mystery'],
    studio: 'Wit Studio / MAPPA',
    status: 'Finished Airing',
    year: 2013,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8',
    trailerYoutubeId: 'M_OauHnAFc8',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
    resolution: '1080p',
    episodes: [
      {
        id: 'aot-ep-1',
        number: 1,
        title: 'To You, in 2000 Years: The Fall of Shiganshina, Part 1',
        thumbnailUrl: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg',
        duration: '24:00',
        streamUrl: 'https://vidsrc.to/embed/tv/16498/1/1',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Attack%20on%20Titan&s=1&e=1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'The Colossal Titan breaches Wall Maria, ending one hundred years of fragile peace.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/16498/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Attack%20on%20Titan&s=1&e=1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'aot-ep-2',
        number: 2,
        title: 'That Day: The Fall of Shiganshina, Part 2',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
        duration: '24:00',
        streamUrl: 'https://vidsrc.to/embed/tv/16498/1/2',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Attack%20on%20Titan&s=1&e=2',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Eren, Mikasa, and Armin join the refugee evacuation as the Armored Titan smashes the inner gate.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/16498/1/2', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Attack%20on%20Titan&s=1&e=2', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'aot-ep-3',
        number: 3,
        title: 'A Dim Light Amid Despair: Humanity Rebirth',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&auto=format&fit=crop&q=80',
        duration: '24:00',
        streamUrl: 'https://vidsrc.to/embed/tv/16498/1/3',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Attack%20on%20Titan&s=1&e=3',
        isHls: false,
        resolution: '1080p',
        synopsis: 'The cadets begin their grueling military training under Instructor Keith Shadis.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/16498/1/3', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Attack%20on%20Titan&s=1&e=3', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/M_OauHnAFc8', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg',
  },
  {
    id: 'solo-leveling',
    malId: 52299,
    title: 'Ore dake Level Up na Ken',
    titleEnglish: 'Solo Leveling',
    titleJapanese: '俺だけレベルアップな件',
    synopsis: 'In a world where dimensional gates connect our world to dungeons filled with monsters, human awakeners known as hunters battle for survival. Sung Jinwoo, notoriously known as the weakest hunter of all mankind, is trapped inside a lethal double dungeon and awakens with a singular player status interface.',
    score: 8.6,
    episodesCount: 24,
    genres: ['Action', 'Fantasy', 'Supernatural'],
    studio: 'A-1 Pictures',
    status: 'Currently Airing',
    year: 2024,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM',
    trailerYoutubeId: 'LrNvF8gcJPM',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
    resolution: '1080p',
    episodes: [
      {
        id: 'sl-ep-1',
        number: 1,
        title: 'I am Used to It',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
        duration: '23:45',
        streamUrl: 'https://vidsrc.to/embed/tv/52299/1/1',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Solo%20Leveling&s=1&e=1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Sung Jinwoo undertakes a standard D-rank raid that leads into a hidden catastrophic chamber.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/52299/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Solo%20Leveling&s=1&e=1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'sl-ep-2',
        number: 2,
        title: 'If I Had One More Chance',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
        duration: '23:50',
        streamUrl: 'https://vidsrc.to/embed/tv/52299/1/2',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Solo%20Leveling&s=1&e=2',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Faced with the stone statues and the Commandments of the Temple, Jinwoo solves the deadly trial.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/52299/1/2', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Solo%20Leveling&s=1&e=2', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/LrNvF8gcJPM', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
  },
  {
    id: 'jujutsu-kaisen',
    malId: 40748,
    title: 'Jujutsu Kaisen',
    titleEnglish: 'Jujutsu Kaisen',
    titleJapanese: '呪術廻戦',
    synopsis: 'Idly indulging in paranormal activities with the Occult Club, high schooler Yuji Itadori swallows the cursed finger of Ryomen Sukuna, king of curses, plunging into the realm of Jujutsu Sorcery.',
    score: 8.8,
    episodesCount: 47,
    genres: ['Action', 'Supernatural', 'Dark Fantasy'],
    studio: 'MAPPA',
    status: 'Finished Airing',
    year: 2020,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/9OhV3IWUsxE',
    trailerYoutubeId: '9OhV3IWUsxE',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
    resolution: '1080p',
    episodes: [
      {
        id: 'jjk-ep-1',
        number: 1,
        title: 'Ryomen Sukuna',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
        duration: '24:12',
        streamUrl: 'https://vidsrc.to/embed/tv/40748/1/1',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Jujutsu%20Kaisen&s=1&e=1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Yuji Itadori encounters Megumi Fushiguro and ingests a special grade cursed object.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/40748/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Jujutsu%20Kaisen&s=1&e=1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/9OhV3IWUsxE', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
  },
  {
    id: 'demon-slayer',
    malId: 38000,
    title: 'Kimetsu no Yaiba',
    titleEnglish: 'Demon Slayer: Kimetsu no Yaiba',
    titleJapanese: '鬼滅の刃',
    synopsis: 'Ever since the death of his father, Tanjiro Kamado has taken on the burden of supporting his family. One fateful day, his family is slaughtered by a demon and his sister Nezuko is transformed into one.',
    score: 8.9,
    episodesCount: 55,
    genres: ['Action', 'Historical', 'Supernatural'],
    studio: 'ufotable',
    status: 'Finished Airing',
    year: 2019,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/PraFso1sVIc',
    trailerYoutubeId: 'PraFso1sVIc',
    hasSub: true,
    hasDub: true,
    rating: 'R - 17+',
    resolution: '1080p',
    episodes: [
      {
        id: 'ds-ep-1',
        number: 1,
        title: 'Cruelty',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
        duration: '23:50',
        streamUrl: 'https://vidsrc.to/embed/tv/38000/1/1',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Demon%20Slayer&s=1&e=1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Tanjiro returns home through snowy mountains to discover an unfathomable tragedy.',
        streamServers: [
          { name: 'Server 1 (1080p VidSrc)', url: 'https://vidsrc.to/embed/tv/38000/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Demon%20Slayer&s=1&e=1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/PraFso1sVIc', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=80',
  },
  {
    id: 'kaiju-no-8',
    malId: 52588,
    title: 'Kaijuu 8-gou',
    titleEnglish: 'Kaiju No. 8',
    titleJapanese: '怪獣8号',
    synopsis: 'In a world plagued by creatures known as Kaiju, Kafka Hibino aspired to enlist in The Defense Force. After a miniature Kaiju forces its way into his body, Kafka gains monstrous powers to fight back and protect humanity.',
    score: 8.5,
    episodesCount: 12,
    genres: ['Action', 'Sci-Fi', 'Military', 'Shonen'],
    studio: 'Production I.G',
    status: 'Finished Airing',
    year: 2024,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/5U2V22jZ_D4',
    trailerYoutubeId: '5U2V22jZ_D4',
    hasSub: true,
    hasDub: true,
    rating: 'PG-13',
    resolution: '1080p',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/htGeuCcNhlBe8GTx3izKOsd8frw.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/83yDUQVpdhv8ePy3nbTRzFaKYuQ.jpg',
    episodes: [
      {
        id: 'kaiju-ep-1',
        number: 1,
        title: 'The Man Who Became a Kaiju',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/htGeuCcNhlBe8GTx3izKOsd8frw.jpg',
        duration: '24:00',
        streamUrl: 'https://vidlink.pro/tv/207468/1/1',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Kaiju%20No.%208&s=1&e=1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Kafka Hibino works for the Kaiju cleanup crew until an attack changes his fate forever.',
        streamServers: [
          { name: 'Server 1 (1080p VidLink)', url: 'https://vidlink.pro/tv/207468/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (1080p VidFast)', url: 'https://vidfast.pro/tv/207468/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 3 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Kaiju%20No.%208&s=1&e=1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/5U2V22jZ_D4', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'kaiju-ep-2',
        number: 2,
        title: 'The Kaiju Who Defeated a Kaiju',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/htGeuCcNhlBe8GTx3izKOsd8frw.jpg',
        duration: '24:00',
        streamUrl: 'https://vidlink.pro/tv/207468/1/2',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Kaiju%20No.%208&s=1&e=2',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Kafka and Reno flee the hospital as Defense Force officers investigate the anomaly.',
        streamServers: [
          { name: 'Server 1 (1080p VidLink)', url: 'https://vidlink.pro/tv/207468/1/2', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (1080p VidFast)', url: 'https://vidfast.pro/tv/207468/1/2', isEmbed: true, quality: '1080p' },
          { name: 'Server 3 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Kaiju%20No.%208&s=1&e=2', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/5U2V22jZ_D4', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'kaiju-ep-3',
        number: 3,
        title: 'Rematch',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/htGeuCcNhlBe8GTx3izKOsd8frw.jpg',
        duration: '24:00',
        streamUrl: 'https://vidlink.pro/tv/207468/1/3',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Kaiju%20No.%208&s=1&e=3',
        isHls: false,
        resolution: '1080p',
        synopsis: 'The practical exam begins as candidates face simulated and real subterranean beasts.',
        streamServers: [
          { name: 'Server 1 (1080p VidLink)', url: 'https://vidlink.pro/tv/207468/1/3', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (1080p VidFast)', url: 'https://vidfast.pro/tv/207468/1/3', isEmbed: true, quality: '1080p' },
          { name: 'Server 3 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Kaiju%20No.%208&s=1&e=3', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/5U2V22jZ_D4', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
  },
  {
    id: 'black-clover',
    malId: 34572,
    title: 'Black Clover',
    titleEnglish: 'Black Clover',
    titleJapanese: 'ブラッククローバー',
    synopsis: 'In a world where magic is everything, Asta was born with no magical power. In order to keep his promise to his rival Yuno, Asta aims to become the Wizard King by wielding anti-magic swords.',
    score: 8.5,
    episodesCount: 170,
    genres: ['Action', 'Fantasy', 'Magic', 'Shonen'],
    studio: 'Studio Pierrot',
    status: 'Finished Airing',
    year: 2017,
    trailerUrl: 'https://www.youtube-nocookie.com/embed/vUjky_aW8G8',
    trailerYoutubeId: 'vUjky_aW8G8',
    hasSub: true,
    hasDub: true,
    rating: 'PG-13',
    resolution: '1080p',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/qu9epTZh29fGUkY7ZYc9PVsv0Ig.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/uZUtoVChBGhNj9OfrM2LYpwBm8E.jpg',
    episodes: [
      {
        id: 'bc-ep-1',
        number: 1,
        title: 'Asta and Yuno',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/qu9epTZh29fGUkY7ZYc9PVsv0Ig.jpg',
        duration: '23:45',
        streamUrl: 'https://vidlink.pro/tv/73223/1/1',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Black%20Clover&s=1&e=1',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Asta and Yuno are orphans raised together at a church in Hage Village on the edge of the Clover Kingdom.',
        streamServers: [
          { name: 'Server 1 (1080p VidLink)', url: 'https://vidlink.pro/tv/73223/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (1080p VidFast)', url: 'https://vidfast.pro/tv/73223/1/1', isEmbed: true, quality: '1080p' },
          { name: 'Server 3 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Black%20Clover&s=1&e=1', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/vUjky_aW8G8', isEmbed: true, quality: 'HD' },
        ],
      },
      {
        id: 'bc-ep-2',
        number: 2,
        title: 'A Young Man Vow',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w1280/qu9epTZh29fGUkY7ZYc9PVsv0Ig.jpg',
        duration: '23:45',
        streamUrl: 'https://vidlink.pro/tv/73223/1/2',
        dubStreamUrl: 'https://multiembed.mov/?video_id=Black%20Clover&s=1&e=2',
        isHls: false,
        resolution: '1080p',
        synopsis: 'Asta receives his five-leaf clover grimoire containing the mysterious Anti-Magic demon blade.',
        streamServers: [
          { name: 'Server 1 (1080p VidLink)', url: 'https://vidlink.pro/tv/73223/1/2', isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (1080p VidFast)', url: 'https://vidfast.pro/tv/73223/1/2', isEmbed: true, quality: '1080p' },
          { name: 'Server 3 (720p MultiEmbed)', url: 'https://multiembed.mov/?video_id=Black%20Clover&s=1&e=2', isEmbed: true, quality: '720p' },
          { name: 'Trailer (HD Preview)', url: 'https://www.youtube-nocookie.com/embed/vUjky_aW8G8', isEmbed: true, quality: 'HD' },
        ],
      },
    ],
  },
];

// In-memory cache to prevent duplicate fetches
const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * 1. Fetch Trending & Airing Anime
 */
export async function getTrendingAnime(limit = 16): Promise<AnimeSeries[]> {
  const cacheKey = `trending_${limit}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://kitsu.io/api/edge/anime?sort=-userCount&page[limit]=${limit}`, {
      headers: {
        Accept: 'application/vnd.api+json',
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const json = await res.json();
      const mapped = json.data.map(mapKitsuToAnimeSeries);
      const combined = mergeWithCurated(mapped);
      apiCache.set(cacheKey, { timestamp: Date.now(), data: combined });
      return combined;
    }
  } catch {
    // Return curated anime if network fails
  }

  return CURATED_ANIME;
}

/**
 * 2. Search Anime by title (English or Romaji)
 */
export async function searchAnime(query: string, language = 'en'): Promise<AnimeSeries[]> {
  if (!query || !query.trim()) {
    return getTrendingAnime();
  }

  const cleanQuery = query.trim().toLowerCase();
  const cacheKey = `search_${cleanQuery}_${language}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Check curated first
  const curatedMatches = CURATED_ANIME.filter(
    (a) =>
      a.title.toLowerCase().includes(cleanQuery) ||
      a.titleEnglish.toLowerCase().includes(cleanQuery) ||
      a.genres.some((g) => g.toLowerCase().includes(cleanQuery))
  );

  try {
    const res = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(cleanQuery)}&page[limit]=16`,
      {
        headers: { Accept: 'application/vnd.api+json' },
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      const json = await res.json();
      const mapped = json.data.map(mapKitsuToAnimeSeries);
      const merged = [...curatedMatches, ...mapped.filter((m: AnimeSeries) => !curatedMatches.some((c) => c.id === m.id))];
      apiCache.set(cacheKey, { timestamp: Date.now(), data: merged });
      return merged;
    }
  } catch {
    // fallback
  }

  return curatedMatches.length > 0 ? curatedMatches : CURATED_ANIME;
}

/**
 * 3. Get Anime Series Details by ID
 */
export async function getAnimeDetails(id: string): Promise<AnimeSeries | null> {
  if (!id) return null;
  const cleanId = id.toLowerCase().trim();
  const slug = cleanId
    .replace(/^anime-tmdb-/, '')
    .replace(/^tv-tmdb-/, '')
    .replace(/^movie-tmdb-/, '')
    .replace(/^anime-/, '')
    .replace(/^tv-/, '')
    .replace(/^movie-/, '')
    .replace(/[-_]+/g, '');

  // 1. Check CURATED_ANIME
  const curated = CURATED_ANIME.find((a) => {
    if (a.id === id || a.id.toLowerCase() === cleanId) return true;
    const aSlug = a.id.toLowerCase().replace(/[-_]+/g, '');
    if (slug && (aSlug === slug || aSlug.includes(slug) || slug.includes(aSlug))) return true;
    const aTitleSlug = a.titleEnglish.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug && (aTitleSlug.includes(slug) || slug.includes(aTitleSlug))) return true;
    if (a.malId && cleanId.includes(String(a.malId))) return true;
    return false;
  });
  if (curated) return curated;

  // 2. Check CURATED_MOVIES
  const movieCurated = CURATED_MOVIES.find((m) => {
    if (m.id === id || m.id.toLowerCase() === cleanId) return true;
    if (String(m.tmdbId) === cleanId || cleanId.includes(String(m.tmdbId))) return true;
    const mSlug = m.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug && (mSlug.includes(slug) || slug.includes(mSlug))) return true;
    return false;
  });
  if (movieCurated) {
    const epCount = movieCurated.numberOfEpisodes || 24;
    const episodes: AnimeEpisode[] = Array.from({ length: Math.min(epCount, 24) }).map((_, idx) => {
      const epNum = idx + 1;
      const sNum = 1;
      const tmdbId = movieCurated.tmdbId || cleanId;
      const fullVidLink = `https://vidlink.pro/tv/${tmdbId}/${sNum}/${epNum}?primaryColor=6366f1&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&title=true&poster=true&autoplay=true`;
      const fullVidFast = `https://vidfast.pro/tv/${tmdbId}/${sNum}/${epNum}?autoPlay=true&title=true&poster=true&theme=6366f1`;
      const fullMultiEmbed = `https://multiembed.mov/?video_id=${encodeURIComponent(movieCurated.title)}&s=${sNum}&e=${epNum}&tmdb=1`;
      const fullVidSrc = `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${sNum}/${epNum}`;
      return {
        id: `ep-${tmdbId}-${epNum}`,
        number: epNum,
        title: `Episode ${epNum}: ${movieCurated.title}`,
        thumbnailUrl: movieCurated.thumbnailUrl,
        duration: '24:00',
        streamUrl: fullVidLink,
        dubStreamUrl: fullMultiEmbed,
        isHls: false,
        resolution: '1080p' as const,
        synopsis: `Official episode ${epNum} of ${movieCurated.title} in 1080p Full HD with English Dub and Sub.`,
        streamServers: [
          { name: 'Server 1 (1080p VidLink)', url: fullVidLink, isEmbed: true, quality: '1080p' },
          { name: 'Server 2 (1080p VidFast)', url: fullVidFast, isEmbed: true, quality: '1080p' },
          { name: 'Server 3 (1080p VidSrc CC)', url: fullVidSrc, isEmbed: true, quality: '1080p' },
          { name: 'Server 4 (720p MultiEmbed)', url: fullMultiEmbed, isEmbed: true, quality: '720p' },
        ],
      };
    });

    return {
      id: movieCurated.id,
      malId: movieCurated.tmdbId ? Number(movieCurated.tmdbId) : undefined,
      title: movieCurated.title,
      titleEnglish: movieCurated.title,
      synopsis: movieCurated.description,
      score: Number(movieCurated.rating) || 8.6,
      episodesCount: epCount,
      episodes,
      bannerUrl: movieCurated.backdropUrl || movieCurated.thumbnailUrl,
      posterUrl: movieCurated.posterUrl || movieCurated.thumbnailUrl,
      genres: movieCurated.tags || ['Anime', 'Action', 'Shonen'],
      studio: 'Animation Studio',
      status: 'Currently Airing',
      year: Number(movieCurated.createdAt) || 2024,
      trailerUrl: movieCurated.streamServers?.find((s) => s.quality === 'HD')?.url,
      hasSub: true,
      hasDub: true,
      rating: 'PG-13',
      resolution: '1080p',
    };
  }

  // 3. Fallback to Kitsu API for numerical or standard IDs
  const kitsuId = cleanId.replace('anime-', '');
  if (/^\d+$/.test(kitsuId)) {
    try {
      const res = await fetch(`https://kitsu.io/api/edge/anime/${kitsuId}`, {
        headers: { Accept: 'application/vnd.api+json' },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const json = await res.json();
        return mapKitsuToAnimeSeries(json.data);
      }
    } catch {}
  }

  return null;
}

function mapKitsuToAnimeSeries(item: any): AnimeSeries {
  const attr = item.attributes;
  const ytId = attr.youtubeVideoId;
  const title = attr.canonicalTitle || attr.titles?.en_jp || 'Anime';
  const titleEnglish = attr.titles?.en || attr.canonicalTitle || title;
  const epCount = attr.episodeCount || 12;

  // Generate synthetic episode list for episode selector carousel with multi-server 1080p streams
  const episodes: AnimeEpisode[] = Array.from({ length: Math.min(epCount, 24) }).map((_, idx) => {
    const fullStream = `https://multiembed.mov/?video_id=${encodeURIComponent(titleEnglish)}&s=1&e=${idx + 1}`;
    const vidsrcStream = `https://vidsrc.to/embed/tv/${item.id}/1/${idx + 1}`;
    const trailer = ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : undefined;

    return {
      id: `ep-${item.id}-${idx + 1}`,
      number: idx + 1,
      title: `Episode ${idx + 1}: ${titleEnglish}`,
      thumbnailUrl: attr.posterImage?.medium || attr.coverImage?.small || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
      duration: '24:00',
      streamUrl: fullStream,
      dubStreamUrl: vidsrcStream,
      isHls: false,
      resolution: '1080p' as const,
      synopsis: `Official broadcast episode ${idx + 1} of ${titleEnglish}. Streaming in complete 1080p high definition with English Sub & Dub options.`,
      streamServers: [
        { name: 'Server 1 (1080p MultiEmbed)', url: fullStream, isEmbed: true, quality: '1080p' },
        { name: 'Server 2 (720p VidSrc)', url: vidsrcStream, isEmbed: true, quality: '720p' },
        ...(trailer ? [{ name: 'Trailer (HD Preview)', url: trailer, isEmbed: true, quality: 'HD' }] : []),
      ],
    };
  });

  return {
    id: `anime-${item.id}`,
    malId: item.id ? parseInt(item.id, 10) : undefined,
    title,
    titleEnglish,
    titleJapanese: attr.titles?.ja_jp || undefined,
    synopsis: attr.synopsis || 'No synopsis available.',
    score: attr.averageRating ? parseFloat((attr.averageRating / 10).toFixed(1)) : 8.0,
    episodesCount: epCount,
    episodes,
    bannerUrl: attr.coverImage?.large || attr.posterImage?.large || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterUrl: attr.posterImage?.large || attr.posterImage?.medium || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
    genres: [attr.subtype || 'TV', attr.ageRating || 'PG-13', 'Action'],
    studio: attr.ageRatingGuide || 'Animation Studio',
    status: attr.status === 'current' ? 'Currently Airing' : 'Finished Airing',
    year: attr.startDate ? parseInt(attr.startDate.split('-')[0], 10) : 2024,
    trailerUrl: ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined,
    trailerYoutubeId: ytId || undefined,
    hasSub: true,
    hasDub: true,
    rating: attr.ageRating || 'PG-13',
    resolution: '1080p',
  };
}

function mergeWithCurated(fetched: AnimeSeries[]): AnimeSeries[] {
  const existingIds = new Set(CURATED_ANIME.map((c) => c.id));
  const filtered = fetched.filter((f) => !existingIds.has(f.id));
  return [...CURATED_ANIME, ...filtered];
}
