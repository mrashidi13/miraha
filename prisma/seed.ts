import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ThemeSettings
  await prisma.themeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // HeroSettings
  await prisma.heroSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      imageUrls: [],
      eyebrowEn: 'Welcome to our village',
      eyebrowFa: 'به روستای ما خوش آمدید',
      titleEn: 'Miraha',
      titleFa: 'میراها',
      subtitleEn: 'Preserving the language and memory of our village',
      subtitleFa: 'پاسداری از زبان و خاطرات روستای ما',
    },
  });

  // AboutSettings
  await prisma.aboutSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      bodyEn:
        'Our village is nestled in the heart of the desert, sustained for centuries by an ancient qanat irrigation system. The people here have developed a rich spoken language, unique traditions, and a deep connection to the land and sky.',
      bodyFa:
        'روستای ما در دل بیابان جای گرفته و قرن‌هاست با سیستم آبیاری قنات باستانی پایدار مانده است. مردم اینجا زبانی گفتاری غنی، آداب و رسوم منحصربه‌فرد و ارتباطی عمیق با زمین و آسمان پرورش داده‌اند.',
    },
  });

  // MapSettings
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

  // Sample words
  const words = [
    {
      term: 'لَرگ',
      pronunciation: 'larg',
      meaningEn: 'A cool evening breeze that arrives just before sunset',
      meaningFa: 'نسیم خنک عصرگاهی که درست قبل از غروب می‌وزد',
      exampleEn: 'The larg came and brought relief from the day\'s heat.',
      exampleFa: 'لرگ آمد و از گرمای روز آسوده‌مان کرد.',
    },
    {
      term: 'کَشکَم',
      pronunciation: 'kashkam',
      meaningEn: 'The sound of water running through a qanat channel underground',
      meaningFa: 'صدای جریان آب در دل قنات زیرزمینی',
      exampleEn: 'At night you can hear the kashkam beneath the village.',
      exampleFa: 'شب‌ها می‌توانی کشکم را زیر روستا بشنوی.',
    },
    {
      term: 'پیلَه',
      pronunciation: 'pile',
      meaningEn: 'The soft glow of starlight reflected on desert sand',
      meaningFa: 'درخش ملایم نور ستاره‌ها روی شن‌های بیابان',
      exampleEn: 'We walked home by the pile alone.',
      exampleFa: 'فقط با پیله راه خانه را رفتیم.',
    },
    {
      term: 'دِزگَر',
      pronunciation: 'dezgar',
      meaningEn: 'A person who remembers the village stories and recounts them to the young',
      meaningFa: 'کسی که داستان‌های روستا را به یاد دارد و برای جوانان بازگو می‌کند',
      exampleEn: 'Grandmother was the dezgar of our family.',
      exampleFa: 'مادربزرگ دزگر خانواده‌مان بود.',
    },
  ];

  for (const w of words) {
    await prisma.word.upsert({
      where: { id: `seed-${w.term}` },
      update: {},
      create: { id: `seed-${w.term}`, ...w, status: 'approved' },
    });
  }

  // Sample proverbs
  const proverbs = [
    {
      textEn: 'When the larg blows, even the stubborn date palm bends.',
      textFa: 'وقتی لرگ می‌وزد، حتی نخل لجوج هم خم می‌شود.',
      meaningEn: 'Even the strongest must yield to the right moment.',
      meaningFa: 'حتی قوی‌ترین هم باید تسلیم لحظه‌ی مناسب شود.',
      usageEn: 'Said when someone finally accepts advice they had long refused.',
      usageFa: 'وقتی کسی بالاخره نصیحتی را قبول کند که مدت‌ها از آن سر باز زده بود.',
    },
    {
      textEn: 'The qanat remembers every drought.',
      textFa: 'قنات هر خشکسالی را به یاد دارد.',
      meaningEn: 'The land holds the memory of hard times; do not forget them.',
      meaningFa: 'زمین خاطره‌ی روزهای سخت را نگه می‌دارد؛ آن‌ها را فراموش نکن.',
      usageEn: 'A reminder to stay humble and prepared even in times of plenty.',
      usageFa: 'یادآوری برای سر پایین نگه داشتن و آماده بودن حتی در دوران فراوانی.',
    },
  ];

  for (const p of proverbs) {
    await prisma.proverb.upsert({
      where: { id: `seed-${p.textEn.slice(0, 20)}` },
      update: {},
      create: { id: `seed-${p.textEn.slice(0, 20)}`, ...p, status: 'approved' },
    });
  }

  // Sample news
  await prisma.news.upsert({
    where: { id: 'seed-news-1' },
    update: {},
    create: {
      id: 'seed-news-1',
      titleEn: 'Village Language Archive Launches',
      titleFa: 'راه‌اندازی آرشیو زبان روستا',
      bodyEn: 'We are proud to launch Miraha — a living digital archive dedicated to preserving the unique spoken language of our village. Elder recordings are now being collected.',
      bodyFa: 'با افتخار اعلام می‌کنیم که میراها راه‌اندازی شد — آرشیو دیجیتال زنده‌ای برای پاسداری از زبان گفتاری منحصربه‌فرد روستای ما. ضبط صداهای بزرگان در حال انجام است.',
      publishedAt: new Date('2026-06-01'),
    },
  });

  // Sample events
  await prisma.event.upsert({
    where: { id: 'seed-event-1' },
    update: {},
    create: {
      id: 'seed-event-1',
      titleEn: 'Summer Harvest Festival',
      titleFa: 'جشن برداشت تابستانه',
      descriptionEn: 'Join us for the annual summer harvest festival. Traditional music, food, and storytelling from the village elders.',
      descriptionFa: 'به جشن سالانه برداشت تابستانه بپیوندید. موسیقی سنتی، غذا و داستان‌سرایی بزرگان روستا.',
      startsAt: new Date('2026-08-15T10:00:00Z'),
      endsAt: new Date('2026-08-15T20:00:00Z'),
      location: 'Village Square',
    },
  });

  // Sample people
  const people = [
    {
      nameEn: 'Elder Hassan',
      nameFa: 'حاج حسن',
      roleEn: 'Village elder and storyteller',
      roleFa: 'بزرگ روستا و قصه‌گو',
      locationEn: 'Village',
      locationFa: 'روستا',
    },
    {
      nameEn: 'Fatima Tehrani',
      nameFa: 'فاطمه تهرانی',
      roleEn: 'Diaspora — language researcher',
      roleFa: 'مهاجر — پژوهشگر زبان',
      locationEn: 'Tehran',
      locationFa: 'تهران',
    },
  ];

  for (const p of people) {
    await prisma.person.upsert({
      where: { id: `seed-${p.nameEn.replace(' ', '-')}` },
      update: {},
      create: { id: `seed-${p.nameEn.replace(' ', '-')}`, ...p },
    });
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
