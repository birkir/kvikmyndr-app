import { Locale } from 'date-fns';
import en_US from 'date-fns/locale/en-US';
const buildLocalizeFn = require('date-fns/locale/_lib/buildLocalizeFn');
const buildFormatLongFn = require('date-fns/locale/_lib/buildFormatLongFn');

const dateFormats = {
  full: 'EEEE, d. MMMM y',
  long: 'd. MMMM y',
  medium: 'd MMM y',
  short: 'dd/MM/y',
};

const timeFormats = {
  full: 'HH:mm:ss zzzz',
  long: 'HH:mm:ss z',
  medium: 'HH:mm:ss',
  short: 'HH:mm',
};

const dateTimeFormats = {
  full: '{{date}} klukkan {{time}}',
  long: '{{date}} kl. {{time}}',
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}',
};

const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: 'full',
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: 'full',
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: 'full',
  }),
};

const monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'Á', 'S', 'O', 'N', 'D'],
  abbreviated: ['jan', 'feb', 'mar', 'apr', 'maí', 'jún', 'júl', 'ágú', 'sep', 'okt', 'nóv', 'des'],
  wide: ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'],
};

const dayPeriodValues = {
  narrow: {
    am: 'AM',
    pm: 'PM',
    midnight: 'miðn.',
    noon: 'hád.',
    morning: 'morg.',
    afternoon: 'ef.miðd.',
    evening: 'kvöld',
    night: 'nótt',
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'miðnætti',
    noon: 'hádedgi',
    morning: 'morgun',
    afternoon: 'eftirmiðdagur',
    evening: 'kvöld',
    night: 'nótt',
  },
  wide: {
    am: 'AM',
    pm: 'PM',
    midnight: 'miðnætti',
    noon: 'hádedgi',
    morning: 'morgun',
    afternoon: 'eftirmiðdagur',
    evening: 'kvöld',
    night: 'nótt',
  },
};

function ordinalNumber(dirtyNumber: any) {
  const number = Number(dirtyNumber);
  return String(number);
}

const dayValues = {
  narrow: ['su', 'má', 'þr', 'mi', 'fi', 'fö', 'la'],
  short: ['sun', 'mán', 'þri', 'mið', 'fim', 'fös', 'lau'],
  abbreviated: ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau'],
  long: ['sunnudaginn', 'mánudaginn', 'þriðjudaginn', 'miðvikudaginn', 'fimmtudaginn', 'föstudaginn', 'laugardaginn'],
};

export const dateFnsLocaleIS = {
  ...en_US,
  ordinalNumber,
  // formatDistance,
  // formatRelative,
  formatLong,
  localize: {
    ...en_US.localize,
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: 'wide',
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide',
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
    }),
  },
  options: {
    weekStartsOn: 1 /* Monday */,
    firstWeekContainsDate: 4,
  },
} as Locale;

export interface ILocaleSet {
  SETTINGS: string;
  COMING_SOON: string;
  IN_THEATERS: string;
  GENERAL: string;
  APPEARANCE: string;
  BROWSER: string;
  ABOUT: string;
  LANGUAGE: string;
  HIDE_SYNOPSIS: string;
  HIDE_CAST: string;
  HIDE_BARS_ON_SCROLL: string;
  ENABLE_POSTER_ANIMATIONS: string;
  ALWAYS_USE_READER_MODE: string;
  OPEN_LINKS_IN: string;
  IN_APP: string;
  SAFARI: string;
  CHROME: string;
  VERSION: string;
  CHECK_FOR_UPDATE: string;
  SUMMARY: string;
  CAST: string;
  BUDGET: string;
  FIRST_RELEASED: string;
  TAGLINE: string;
  SORT_POPULARITY: string;
  SORT_TITLE: string;
  SORT_RATING: string;
  OPT_IN_TO_BETA: string;
  BETA: string;
  YES: string;
  NO: string;
  NO_UPDATE_AVAILABLE: string;
  REVENUE: string;
  HOMEPAGE: string;
  MORE: string;
  LESS: string;
}

export const locales: { [key: string]: ILocaleSet } = {
  en: {
    SETTINGS: 'Settings',
    COMING_SOON: 'Coming Soon',
    IN_THEATERS: 'In Theaters',
    GENERAL: 'General',
    APPEARANCE: 'Appearance',
    BROWSER: 'Browser',
    ABOUT: 'About',
    LANGUAGE: 'Language',
    HIDE_SYNOPSIS: 'Hide Synopsis',
    HIDE_CAST: 'Hide Cast',
    HIDE_BARS_ON_SCROLL: 'Hide Bars On Scroll',
    ENABLE_POSTER_ANIMATIONS: 'Enable Poster Animations',
    ALWAYS_USE_READER_MODE: 'Always Use Reader Mode',
    OPEN_LINKS_IN: 'Open Links In',
    IN_APP: 'In-App',
    SAFARI: 'Safari',
    CHROME: 'Chrome',
    VERSION: 'Version',
    CHECK_FOR_UPDATE: 'Check for Update',
    SUMMARY: 'Summary',
    CAST: 'Cast',
    BUDGET: 'Budget',
    FIRST_RELEASED: 'First Released',
    TAGLINE: 'Tagline',
    SORT_POPULARITY: 'Popularity',
    SORT_TITLE: 'Title',
    SORT_RATING: 'Rating',
    OPT_IN_TO_BETA: 'Opt-in to Beta',
    BETA: 'Beta',
    YES: 'Yes',
    NO: 'No',
    NO_UPDATE_AVAILABLE: 'No update available',
    REVENUE: 'Revenue',
    HOMEPAGE: 'Homepage',
    MORE: 'more',
    LESS: 'less',
  },
  is: {
    SETTINGS: 'Stillingar',
    COMING_SOON: 'Væntanlegt',
    IN_THEATERS: 'Í Sýningu',
    GENERAL: 'Almennt',
    APPEARANCE: 'Viðmót',
    BROWSER: 'Vafri',
    ABOUT: 'Um Bíóhúsið',
    LANGUAGE: 'Tungumál',
    HIDE_SYNOPSIS: 'Fela Samantekt',
    HIDE_CAST: 'Fela Leikara',
    HIDE_BARS_ON_SCROLL: 'Fela Vikudaga á Skruni',
    ENABLE_POSTER_ANIMATIONS: 'Virkja Hreyfingu á Skjám',
    ALWAYS_USE_READER_MODE: 'Alltaf Nota Lesham',
    OPEN_LINKS_IN: 'Opna Hlekki',
    IN_APP: 'Í Appinu',
    SAFARI: 'Safari',
    CHROME: 'Chrome',
    VERSION: 'Útgáfa',
    CHECK_FOR_UPDATE: 'Athuga með uppfærslu',
    SUMMARY: 'Samantekt',
    CAST: 'Leikarar og stjórnendur',
    BUDGET: 'Kostaði',
    FIRST_RELEASED: 'Fyrst gefin út',
    TAGLINE: 'Stutt lýsing',
    SORT_POPULARITY: 'Vinsældir',
    SORT_TITLE: 'Titill',
    SORT_RATING: 'Einkunn',
    OPT_IN_TO_BETA: 'Taka þátt í Beta',
    BETA: 'Beta',
    YES: 'Já',
    NO: 'Nei',
    NO_UPDATE_AVAILABLE: 'Engin uppfærsla í boði',
    REVENUE: 'Gróði',
    HOMEPAGE: 'Vefsíða',
    MORE: 'meira',
    LESS: 'minna',
  },
};
