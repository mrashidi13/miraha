import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const PIC = (seed: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  // ── Theme ──────────────────────────────────────────────────────────────────
  await prisma.themeSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  // ── Hero ───────────────────────────────────────────────────────────────────
  await prisma.heroSettings.upsert({
    where: { id: 1 },
    update: {
      imageUrls: [PIC('miraha-village', 1400, 700), PIC('miraha-desert', 1400, 700), PIC('miraha-qanat', 1400, 700)],
    },
    create: {
      id: 1,
      imageUrls: [PIC('miraha-village', 1400, 700), PIC('miraha-desert', 1400, 700), PIC('miraha-qanat', 1400, 700)],
      eyebrowEn: 'Welcome to our village',
      eyebrowFa: 'به روستای ما خوش آمدید',
      titleEn: 'Miraha',
      titleFa: 'میراها',
      subtitleEn: 'Preserving the language and memory of our village',
      subtitleFa: 'پاسداری از زبان و خاطرات روستای ما',
    },
  });

  // ── About ─────────────────────────────────────────────────────────────────
  await prisma.aboutSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      bodyEn: 'Our village is nestled in the heart of the desert, sustained for centuries by an ancient qanat irrigation system. The people here have developed a rich spoken language, unique traditions, and a deep connection to the land and sky. Miraha was created to ensure these words and stories are never lost.',
      bodyFa: 'روستای ما در دل بیابان جای گرفته و قرن‌هاست با سیستم آبیاری قنات باستانی پایدار مانده است. مردم اینجا زبانی گفتاری غنی، آداب و رسوم منحصربه‌فرد و ارتباطی عمیق با زمین و آسمان پرورش داده‌اند. میراها ساخته شد تا مطمئن شویم این کلمات و داستان‌ها هرگز از دست نمی‌روند.',
    },
  });

  // ── Map ───────────────────────────────────────────────────────────────────
  await prisma.mapSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      embedUrl: '',
      directionsTextEn: 'The village is reachable by road from the nearest city in approximately 3 hours. Turn off at the main highway junction and follow the desert track for 40 km.',
      directionsTextFa: 'روستا از نزدیک‌ترین شهر در حدود ۳ ساعت با جاده قابل دسترسی است. در تقاطع بزرگراه اصلی خارج شوید و ۴۰ کیلومتر جاده بیابانی را طی کنید.',
    },
  });

  // ── Dictionary words ───────────────────────────────────────────────────────
  const words = [
    { id: 'seed-larg',     term: 'لَرگ',    pronunciation: 'larg',     meaningEn: 'A cool evening breeze that arrives just before sunset',             meaningFa: 'نسیم خنک عصرگاهی که درست قبل از غروب می‌وزد',        exampleEn: "The larg came and brought relief from the day's heat.", exampleFa: 'لرگ آمد و از گرمای روز آسوده‌مان کرد.',                       photoUrl: PIC('sunset-desert', 600, 360) },
    { id: 'seed-kashkam',  term: 'کَشکَم',  pronunciation: 'kashkam',  meaningEn: 'The sound of water running through a qanat channel underground',    meaningFa: 'صدای جریان آب در دل قنات زیرزمینی',                    exampleEn: 'At night you can hear the kashkam beneath the village.', exampleFa: 'شب‌ها می‌توانی کشکم را زیر روستا بشنوی.',                   photoUrl: PIC('water-channel', 600, 360) },
    { id: 'seed-pile',     term: 'پیلَه',   pronunciation: 'pile',     meaningEn: 'The soft glow of starlight reflected on desert sand',               meaningFa: 'درخش ملایم نور ستاره‌ها روی شن‌های بیابان',             exampleEn: 'We walked home by the pile alone.',                     exampleFa: 'فقط با پیله راه خانه را رفتیم.',                              photoUrl: PIC('stars-night', 600, 360) },
    { id: 'seed-dezgar',   term: 'دِزگَر',  pronunciation: 'dezgar',   meaningEn: 'A person who remembers and recounts the village stories to the young',meaningFa: 'کسی که داستان‌های روستا را به یاد دارد و برای جوانان بازگو می‌کند', exampleEn: 'Grandmother was the dezgar of our family.',       exampleFa: 'مادربزرگ دزگر خانواده‌مان بود.',                              photoUrl: PIC('elder-storyteller', 600, 360) },
    { id: 'seed-havarak',  term: 'هَوَرَک', pronunciation: 'havarak',  meaningEn: 'The smell of rain on dry earth before a storm',                     meaningFa: 'بوی باران روی خاک خشک پیش از طوفان',                   exampleEn: 'The children ran outside when they smelled the havarak.',exampleFa: 'بچه‌ها وقتی هورک را بوییدند به بیرون دویدند.',               photoUrl: PIC('rain-desert', 600, 360) },
    { id: 'seed-golmeh',   term: 'گُلمَه',  pronunciation: 'golmeh',   meaningEn: 'The communal evening gathering around a fire or lamp',              meaningFa: 'گردهمایی جمعی شبانه دور آتش یا چراغ',                  exampleEn: 'The whole family came to the golmeh after dinner.',     exampleFa: 'تمام خانواده بعد از شام سر گلمه آمدند.',                     photoUrl: PIC('fire-gathering', 600, 360) },
    { id: 'seed-tafan',    term: 'تَفان',   pronunciation: 'tafan',    meaningEn: 'The shimmer of heat rising from the desert floor at midday',         meaningFa: 'تابش و لرزش هوای گرم از کف بیابان در نیمروز',          exampleEn: 'The road disappeared into the tafan in the distance.',  exampleFa: 'جاده در دوردست توی تفان محو شد.',                             photoUrl: PIC('heat-shimmer', 600, 360) },
    { id: 'seed-cheshmak', term: 'چِشمَک',  pronunciation: 'cheshmak', meaningEn: 'The first glimpse of a qanat spring emerging from underground',      meaningFa: 'اولین جوشش چشمه‌ی قنات از زیر زمین',                  exampleEn: 'Children would race to find the cheshmak each spring.', exampleFa: 'بچه‌ها هر بهار مسابقه می‌دادند که چشمک را زودتر پیدا کنند.', photoUrl: PIC('spring-water', 600, 360) },
  ];

  for (const w of words) {
    await prisma.word.upsert({ where: { id: w.id }, update: { photoUrl: w.photoUrl }, create: { ...w, status: 'approved' } });
  }

  // ── Proverbs ───────────────────────────────────────────────────────────────
  const proverbs = [
    { id: 'seed-proverb-1', textEn: 'When the larg blows, even the stubborn date palm bends.', textFa: 'وقتی لرگ می‌وزد، حتی نخل لجوج هم خم می‌شود.', meaningEn: 'Even the strongest must yield to the right moment.', meaningFa: 'حتی قوی‌ترین هم باید تسلیم لحظه‌ی مناسب شود.', usageEn: 'Said when someone finally accepts advice they long refused.', usageFa: 'وقتی کسی بالاخره نصیحتی را قبول کند که مدت‌ها سرپیچی کرده بود.' },
    { id: 'seed-proverb-2', textEn: 'The qanat remembers every drought.', textFa: 'قنات هر خشکسالی را به یاد دارد.', meaningEn: 'The land holds the memory of hard times; do not forget them.', meaningFa: 'زمین خاطره‌ی روزهای سخت را نگه می‌دارد؛ آن‌ها را فراموش نکن.', usageEn: 'A reminder to stay humble even in times of plenty.', usageFa: 'یادآوری برای فروتن ماندن حتی در دوران فراوانی.' },
    { id: 'seed-proverb-3', textEn: 'A dezgar is worth a thousand books.', textFa: 'یک دزگر هزار کتاب می‌ارزد.', meaningEn: 'Living oral memory carries more than any written text.', meaningFa: 'حافظه زنده‌ی شفاهی بیشتر از هر متن مکتوبی ارزش دارد.', usageEn: 'Said to honor elders who carry the village oral tradition.', usageFa: 'برای گرامی‌داشت بزرگانی که سنت شفاهی روستا را حفظ می‌کنند.' },
    { id: 'seed-proverb-4', textEn: 'The desert keeps no secrets — only the wind forgets.', textFa: 'بیابان رازی پنهان نمی‌کند — فقط باد فراموش می‌کند.', meaningEn: 'The truth always surfaces; only the careless overlook it.', meaningFa: 'حقیقت همیشه آشکار می‌شود؛ فقط بی‌توجهان آن را نمی‌بینند.', usageEn: 'Used when hidden matters finally come to light.', usageFa: 'وقتی امور پنهان سرانجام آشکار می‌شوند.' },
  ];

  for (const p of proverbs) {
    await prisma.proverb.upsert({ where: { id: p.id }, update: {}, create: { ...p, status: 'approved' } });
  }

  // ── News ──────────────────────────────────────────────────────────────────
  const news = [
    { id: 'seed-news-1', titleEn: 'Village Language Archive Launches', titleFa: 'راه‌اندازی آرشیو زبان روستا', bodyEn: 'We are proud to launch Miraha — a living digital archive dedicated to preserving the unique spoken language of our village. Elder recordings are now being collected. Every word added here is a word saved from being lost forever.', bodyFa: 'با افتخار اعلام می‌کنیم که میراها راه‌اندازی شد — آرشیو دیجیتال زنده‌ای برای پاسداری از زبان گفتاری منحصربه‌فرد روستای ما. ضبط صداهای بزرگان در حال انجام است. هر کلمه‌ای که اینجا اضافه می‌شود کلمه‌ای است که از فراموشی نجات می‌یابد.', imageUrl: PIC('archive-launch', 800, 450), publishedAt: new Date('2026-06-01') },
    { id: 'seed-news-2', titleEn: 'Elder Recordings Project Begins', titleFa: 'آغاز پروژه ضبط صدای بزرگان', bodyEn: 'A dedicated team has started visiting village elders to record stories, songs, and conversations in the local language. These recordings will be available in the audio section and linked to dictionary entries.', bodyFa: 'یک تیم ویژه شروع به بازدید از بزرگان روستا برای ضبط داستان‌ها، ترانه‌ها و مکالمات به زبان محلی کرده است. این ضبط‌ها در بخش صوتی موجود خواهند بود و به واژه‌های واژه‌نامه پیوند داده می‌شوند.', imageUrl: PIC('elder-recording', 800, 450), publishedAt: new Date('2026-06-08') },
    { id: 'seed-news-3', titleEn: 'Summer Harvest Festival Announced', titleFa: 'اعلام جشن برداشت تابستانه', bodyEn: 'The annual summer harvest festival will be held on August 15th at the village square. Traditional music, local food, and storytelling sessions are planned. All diaspora members are warmly invited to attend.', bodyFa: 'جشن سالانه برداشت تابستانه در ۱۵ آگوست در میدان روستا برگزار خواهد شد. موسیقی سنتی، غذای محلی و جلسات داستان‌سرایی برنامه‌ریزی شده است. همه اعضای مهاجر با گرمی دعوت می‌شوند.', imageUrl: PIC('harvest-festival', 800, 450), publishedAt: new Date('2026-06-13') },
  ];

  for (const n of news) {
    await prisma.news.upsert({ where: { id: n.id }, update: { imageUrl: n.imageUrl }, create: n });
  }

  // ── Gallery ────────────────────────────────────────────────────────────────
  const gallery = [
    { id: 'seed-gallery-1', seed: 'village-morning',    captionEn: 'Village at dawn',          captionFa: 'روستا در سپیده‌دم' },
    { id: 'seed-gallery-2', seed: 'qanat-tunnel',       captionEn: 'Inside a qanat tunnel',    captionFa: 'داخل تونل قنات' },
    { id: 'seed-gallery-3', seed: 'desert-palms',       captionEn: 'Date palms at the oasis',  captionFa: 'نخل‌های کنار آبادی' },
    { id: 'seed-gallery-4', seed: 'village-rooftops',   captionEn: 'Rooftop life in summer',   captionFa: 'زندگی روی پشت‌بام در تابستان' },
    { id: 'seed-gallery-5', seed: 'desert-sunset-gold', captionEn: 'Desert sunset',            captionFa: 'غروب بیابان' },
    { id: 'seed-gallery-6', seed: 'harvest-ceremony',   captionEn: 'Annual harvest gathering', captionFa: 'گردهمایی برداشت سالانه' },
    { id: 'seed-gallery-7', seed: 'pottery-craft',      captionEn: 'Traditional pottery',      captionFa: 'سفالگری سنتی' },
    { id: 'seed-gallery-8', seed: 'stars-over-village', captionEn: 'Stars over the village',   captionFa: 'ستاره‌ها بر فراز روستا' },
  ];

  for (const g of gallery) {
    await prisma.mediaItem.upsert({
      where: { id: g.id },
      update: {},
      create: { id: g.id, type: 'photo', url: PIC(g.seed, 800, 530), captionEn: g.captionEn, captionFa: g.captionFa, takenAt: new Date('2025-09-01') },
    });
  }

  // ── Events ────────────────────────────────────────────────────────────────
  const events = [
    { id: 'seed-event-1', titleEn: 'Summer Harvest Festival',   titleFa: 'جشن برداشت تابستانه',    descriptionEn: 'Annual harvest festival with traditional music, food, and elder storytelling.',       descriptionFa: 'جشن برداشت سالانه با موسیقی سنتی، غذا و داستان‌سرایی بزرگان.',      startsAt: new Date('2026-08-15T10:00:00Z'), endsAt: new Date('2026-08-15T20:00:00Z'), location: 'Village Square / میدان روستا' },
    { id: 'seed-event-2', titleEn: 'Qanat Cleaning Day',        titleFa: 'روز لایروبی قنات',       descriptionEn: 'Community gathering to clean and maintain the ancient qanat channels.',              descriptionFa: 'گردهمایی عمومی برای تمیز کردن و نگهداری کانال‌های قنات باستانی.',  startsAt: new Date('2026-09-05T07:00:00Z'), endsAt: new Date('2026-09-05T14:00:00Z'), location: 'Qanat Entrance / دهانه قنات' },
    { id: 'seed-event-3', titleEn: 'Language Recording Weekend', titleFa: 'آخر هفته ضبط زبان',   descriptionEn: 'Two-day event where volunteers interview elders and record words and stories.',       descriptionFa: 'رویدادی دو روزه که داوطلبان با بزرگان مصاحبه می‌کنند.',             startsAt: new Date('2026-10-10T09:00:00Z'), endsAt: new Date('2026-10-11T17:00:00Z'), location: 'Community Hall / سالن اجتماعات' },
  ];

  for (const e of events) {
    await prisma.event.upsert({ where: { id: e.id }, update: {}, create: e });
  }

  // ── People ────────────────────────────────────────────────────────────────
  const people = [
    { id: 'seed-person-1', nameEn: 'Elder Hassan',    nameFa: 'حاج حسن',       roleEn: 'Village elder and storyteller',       roleFa: 'بزرگ روستا و قصه‌گو',        locationEn: 'Village',  locationFa: 'روستا',    photoUrl: PIC('elder-man', 300, 300) },
    { id: 'seed-person-2', nameEn: 'Fatima Tehrani',  nameFa: 'فاطمه تهرانی',  roleEn: 'Diaspora — language researcher',      roleFa: 'مهاجر — پژوهشگر زبان',       locationEn: 'Tehran',   locationFa: 'تهران',    photoUrl: PIC('woman-researcher', 300, 300) },
    { id: 'seed-person-3', nameEn: 'Ali Karimi',      nameFa: 'علی کریمی',     roleEn: 'Qanat keeper — 4th generation',       roleFa: 'نگهبان قنات — نسل چهارم',    locationEn: 'Village',  locationFa: 'روستا',    photoUrl: PIC('farmer-man', 300, 300) },
    { id: 'seed-person-4', nameEn: 'Sara Mousavi',    nameFa: 'سارا موسوی',    roleEn: 'Diaspora — traditional crafts',       roleFa: 'مهاجر — صنایع دستی سنتی',   locationEn: 'Isfahan',  locationFa: 'اصفهان',   photoUrl: PIC('craftswoman', 300, 300) },
  ];

  for (const p of people) {
    await prisma.person.upsert({ where: { id: p.id }, update: { photoUrl: p.photoUrl }, create: p });
  }

  console.log('✅ Seed complete — words, proverbs, news, gallery, events, people all seeded.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
