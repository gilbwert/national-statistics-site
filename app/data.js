// Nusantara in Numbers — the figures.
// Every series is compiled from Statistics Indonesia (BPS) releases and the
// BPS state-of-the-nation tables; each indicator names its source and the
// period its latest value belongs to. Values are the published ones, rounded
// the way BPS rounds them in its headlines. This file is data only: charts.js
// draws it and main.js lays it out.
window.NUSA_DATA = (function () {
  'use strict';

  // years: the ten observation years every national series below shares.
  var YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  // Each indicator: id, name, short label for cards, unit, decimals,
  // direction ('up' when a rise is good news, 'down' when a fall is),
  // the ten yearly values in YEARS order, the period the latest value
  // describes, its source, and the reading notes a visitor needs.
  var INDICATORS = [
    {
      id: 'population', name: 'Population', card: 'People living in Indonesia',
      unit: 'million people', short: 'million', decimals: 1, direction: 'flat',
      values: [255.5, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6],
      period: 'Mid-year 2024', source: 'BPS population projections, based on the 2020 Census',
      about: 'Indonesia is the world\'s fourth most populous country. The 2020 Census counted 270.2 million people; the mid-2024 projection puts the figure at 281.6 million, growing at just under 1% a year and slowing as fertility falls toward replacement level.',
      reading: 'Java still holds about 56% of the population on 7% of the land. The median age is about 30, so the demographic dividend — a large working-age share — runs into the 2030s.'
    },
    {
      id: 'gdp-growth', name: 'Economic growth', card: 'Real GDP growth, year on year',
      unit: '% per year', short: '%', decimals: 2, direction: 'up',
      values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
      period: 'Full year 2024', source: 'BPS national accounts, constant 2010 prices',
      about: 'The economy grew 5.03% in 2024, a fifth straight year near the 5% mark once the pandemic contraction of 2020 (-2.07%) and the rebound that followed are set aside. Household consumption, about 54% of GDP, remains the largest engine; investment and exports share most of the rest.',
      reading: 'Growth has been remarkably steady — between 4.9% and 5.3% in every non-pandemic year since 2015 — but raising it durably above 5% is the central economic debate of the new administration.'
    },
    {
      id: 'gdp-nominal', name: 'GDP at current prices', card: 'Size of the economy, nominal',
      unit: 'Rp trillion', short: 'Rp trillion', decimals: 0, direction: 'up',
      values: [11526, 12402, 13588, 14838, 15833, 15443, 16977, 19588, 20892, 22139],
      period: 'Full year 2024', source: 'BPS national accounts, current prices',
      about: 'Nominal GDP reached Rp 22,139 trillion in 2024 — roughly US$1.4 trillion, the largest economy in Southeast Asia and 16th in the world. GDP per capita was Rp 78.6 million (about US$4,960), which keeps Indonesia in the World Bank\'s upper-middle-income group.',
      reading: 'The nominal series dips in 2020 even in rupiah terms: the pandemic year shrank the economy in both real and current prices, the only fall in the decade.'
    },
    {
      id: 'inflation', name: 'Inflation', card: 'Consumer prices, year on year',
      unit: '% per year', short: '%', decimals: 2, direction: 'down',
      values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
      period: 'December 2024', source: 'BPS consumer price index, 150 cities',
      about: 'Inflation ended 2024 at 1.57% year on year, the lowest December reading in the series shown and comfortably inside Bank Indonesia\'s 1.5–3.5% target band. The decade\'s spike came in 2022 (5.51%), when subsidised fuel prices were raised about 30% in one step.',
      reading: 'Food prices drive most of the month-to-month movement; administered prices (fuel, electricity) drive the big steps. Core inflation, which strips both out, has stayed near 2–3% throughout.'
    },
    {
      id: 'poverty', name: 'Poverty rate', card: 'Share of people below the poverty line',
      unit: '% of population', short: '%', decimals: 2, direction: 'down',
      values: [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03],
      period: 'March 2024 (September 2024: 8.57%)', source: 'BPS National Socioeconomic Survey (Susenas), March rounds',
      about: 'In March 2024, 9.03% of Indonesians — about 25.2 million people — lived below the national poverty line of roughly Rp 583,000 per person per month. By September 2024 the rate had fallen to 8.57%, the first reading below 9% on record.',
      reading: 'The pandemic reversed five years of progress in a single year (2020–21). Rural poverty (about 11%) remains well above urban poverty (about 7%), and the eastern provinces record the highest rates in the country.'
    },
    {
      id: 'unemployment', name: 'Unemployment', card: 'Open unemployment rate, August',
      unit: '% of labour force', short: '%', decimals: 2, direction: 'down',
      values: [6.18, 5.61, 5.50, 5.34, 5.23, 7.07, 6.49, 5.86, 5.32, 4.91],
      period: 'August 2024', source: 'BPS National Labour Force Survey (Sakernas), August rounds',
      about: 'The open unemployment rate fell to 4.91% in August 2024, the lowest in the series — about 7.5 million people out of a labour force of 152.1 million. The rate has fully retraced its pandemic jump to 7.07% in August 2020.',
      reading: 'The headline rate flatters job quality: about 58% of workers are in informal work, and underemployment (working under 35 hours while seeking more) adds roughly another 8% of the labour force.'
    },
    {
      id: 'hdi', name: 'Human Development Index', card: 'Health, schooling and living standards',
      unit: 'index points', short: 'points', decimals: 2, direction: 'up',
      values: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 72.91, 74.39, 75.02],
      period: '2024', source: 'BPS Human Development Index (IPM); method revised in 2023',
      about: 'Indonesia\'s HDI reached 75.02 in 2024, in the "high" development band. The index combines life expectancy (72.4 years), expected schooling (13.4 years), mean schooling (8.9 years) and per-capita expenditure. BPS revised the method in 2023, which lifts the last two readings relative to the older series.',
      reading: 'Jakarta (84.2) sits a full band above every other province; the highland provinces of Papua score in the mid-50s — the widest internal development gap of any large country in the region.'
    },
    {
      id: 'gini', name: 'Income inequality', card: 'Gini ratio of expenditure, March',
      unit: 'ratio (0–1)', short: '', decimals: 3, direction: 'down',
      values: [0.408, 0.397, 0.393, 0.389, 0.380, 0.381, 0.384, 0.381, 0.388, 0.379],
      period: 'March 2024', source: 'BPS, from Susenas expenditure data',
      about: 'The Gini ratio of household expenditure was 0.379 in March 2024: 0 means perfect equality, 1 means one household spends everything. Inequality narrowed slowly over the decade from 0.408, with a pandemic-era wobble, and is lower in villages (about 0.31) than in cities (about 0.41).',
      reading: 'Expenditure-based Gini understates income and wealth concentration; tax-record studies put the top 1% income share near a fifth of national income.'
    },
    {
      id: 'exports', name: 'Exports of goods', card: 'Merchandise exports, fob',
      unit: 'US$ billion', short: 'US$ bn', decimals: 1, direction: 'up',
      values: [150.4, 145.2, 168.8, 180.0, 167.5, 163.2, 231.6, 291.9, 258.8, 264.7],
      period: 'Full year 2024', source: 'BPS foreign trade statistics, customs records',
      about: 'Exports earned US$264.7 billion in 2024. The commodity supercycle of 2021–22 — coal, palm oil and then nickel — pushed the total to a record US$291.9 billion in 2022; prices have since normalised while nickel volumes keep rising on the back of the smelter build-out.',
      reading: 'China takes about a quarter of exports, then the United States, Japan and India. Manufactures are about 45% of the total; the rest is still commodities, which is why the trade balance swings with world prices.'
    },
    {
      id: 'life-expectancy', name: 'Life expectancy', card: 'Expected years of life at birth',
      unit: 'years', short: 'years', decimals: 1, direction: 'up',
      values: [70.8, 70.9, 71.1, 71.2, 71.5, 71.5, 71.6, 71.9, 72.1, 72.4],
      period: '2024', source: 'BPS, from census and survey mortality data',
      about: 'A child born in Indonesia in 2024 can expect to live 72.4 years — about a year and a half longer than a child born in 2015, despite the pandemic, which briefly stalled the gains in 2020–21. Women outlive men by about four years.',
      reading: 'Provincial gaps are wide: life expectancy is near 75 in Yogyakarta and Bali and under 65 in parts of Papua. Non-communicable diseases — stroke, heart disease, diabetes — are now the leading causes of death.'
    }
  ];

  // The 38 provinces: population (millions, mid-2024), poverty rate
  // (%, March 2024), HDI (2024) and real GRDP growth (%, 2024).
  var PROVINCES = [
    { name: 'Aceh', capital: 'Banda Aceh', island: 'Sumatra', population: 5.62, poverty: 12.64, hdi: 74.7, growth: 4.6 },
    { name: 'North Sumatra', capital: 'Medan', island: 'Sumatra', population: 15.60, poverty: 7.99, hdi: 75.4, growth: 5.0 },
    { name: 'West Sumatra', capital: 'Padang', island: 'Sumatra', population: 5.84, poverty: 5.97, hdi: 76.4, growth: 4.4 },
    { name: 'Riau', capital: 'Pekanbaru', island: 'Sumatra', population: 6.73, poverty: 6.67, hdi: 76.0, growth: 3.5 },
    { name: 'Jambi', capital: 'Jambi', island: 'Sumatra', population: 3.72, poverty: 7.10, hdi: 74.7, growth: 4.1 },
    { name: 'South Sumatra', capital: 'Palembang', island: 'Sumatra', population: 8.84, poverty: 10.97, hdi: 73.9, growth: 5.2 },
    { name: 'Bengkulu', capital: 'Bengkulu', island: 'Sumatra', population: 2.11, poverty: 13.78, hdi: 74.3, growth: 4.6 },
    { name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatra', population: 9.42, poverty: 10.69, hdi: 72.9, growth: 4.6 },
    { name: 'Bangka Belitung', capital: 'Pangkal Pinang', island: 'Sumatra', population: 1.52, poverty: 4.29, hdi: 74.4, growth: 3.4 },
    { name: 'Riau Islands', capital: 'Tanjung Pinang', island: 'Sumatra', population: 2.18, poverty: 4.85, hdi: 79.5, growth: 5.0 },
    { name: 'Jakarta', capital: 'Jakarta', island: 'Java', population: 10.56, poverty: 4.14, hdi: 84.2, growth: 4.9 },
    { name: 'West Java', capital: 'Bandung', island: 'Java', population: 49.94, poverty: 7.46, hdi: 74.3, growth: 5.0 },
    { name: 'Central Java', capital: 'Semarang', island: 'Java', population: 37.89, poverty: 9.58, hdi: 74.0, growth: 4.9 },
    { name: 'Yogyakarta', capital: 'Yogyakarta', island: 'Java', population: 3.76, poverty: 10.83, hdi: 81.1, growth: 5.0 },
    { name: 'East Java', capital: 'Surabaya', island: 'Java', population: 41.81, poverty: 9.79, hdi: 74.2, growth: 4.9 },
    { name: 'Banten', capital: 'Serang', island: 'Java', population: 12.43, poverty: 5.84, hdi: 76.6, growth: 4.8 },
    { name: 'Bali', capital: 'Denpasar', island: 'Bali & Nusa Tenggara', population: 4.29, poverty: 3.80, hdi: 78.6, growth: 5.5 },
    { name: 'West Nusa Tenggara', capital: 'Mataram', island: 'Bali & Nusa Tenggara', population: 5.65, poverty: 12.91, hdi: 71.8, growth: 4.9 },
    { name: 'East Nusa Tenggara', capital: 'Kupang', island: 'Bali & Nusa Tenggara', population: 5.66, poverty: 19.02, hdi: 67.7, growth: 3.8 },
    { name: 'West Kalimantan', capital: 'Pontianak', island: 'Kalimantan', population: 5.87, poverty: 6.25, hdi: 71.2, growth: 4.9 },
    { name: 'Central Kalimantan', capital: 'Palangka Raya', island: 'Kalimantan', population: 2.81, poverty: 5.17, hdi: 74.4, growth: 4.5 },
    { name: 'South Kalimantan', capital: 'Banjarmasin', island: 'Kalimantan', population: 4.30, poverty: 4.02, hdi: 74.9, growth: 4.7 },
    { name: 'East Kalimantan', capital: 'Samarinda', island: 'Kalimantan', population: 3.99, poverty: 5.51, hdi: 79.4, growth: 5.9 },
    { name: 'North Kalimantan', capital: 'Tanjung Selor', island: 'Kalimantan', population: 0.72, poverty: 6.32, hdi: 73.1, growth: 5.2 },
    { name: 'North Sulawesi', capital: 'Manado', island: 'Sulawesi', population: 2.70, poverty: 7.25, hdi: 75.8, growth: 5.4 },
    { name: 'Central Sulawesi', capital: 'Palu', island: 'Sulawesi', population: 3.12, poverty: 11.77, hdi: 71.2, growth: 9.5 },
    { name: 'South Sulawesi', capital: 'Makassar', island: 'Sulawesi', population: 9.46, poverty: 8.06, hdi: 74.4, growth: 5.0 },
    { name: 'Southeast Sulawesi', capital: 'Kendari', island: 'Sulawesi', population: 2.82, poverty: 10.63, hdi: 73.6, growth: 5.4 },
    { name: 'Gorontalo', capital: 'Gorontalo', island: 'Sulawesi', population: 1.27, poverty: 14.57, hdi: 71.9, growth: 4.3 },
    { name: 'West Sulawesi', capital: 'Mamuju', island: 'Sulawesi', population: 1.53, poverty: 10.86, hdi: 69.8, growth: 4.7 },
    { name: 'Maluku', capital: 'Ambon', island: 'Maluku & Papua', population: 1.95, poverty: 15.36, hdi: 72.0, growth: 4.8 },
    { name: 'North Maluku', capital: 'Sofifi', island: 'Maluku & Papua', population: 1.37, poverty: 6.32, hdi: 71.4, growth: 20.5 },
    { name: 'Papua', capital: 'Jayapura', island: 'Maluku & Papua', population: 1.06, poverty: 17.26, hdi: 63.0, growth: 4.5 },
    { name: 'West Papua', capital: 'Manokwari', island: 'Maluku & Papua', population: 0.57, poverty: 21.66, hdi: 67.2, growth: 4.2 },
    { name: 'South Papua', capital: 'Merauke', island: 'Maluku & Papua', population: 0.54, poverty: 24.80, hdi: 62.5, growth: 3.9 },
    { name: 'Central Papua', capital: 'Nabire', island: 'Maluku & Papua', population: 1.35, poverty: 29.50, hdi: 58.9, growth: 3.5 },
    { name: 'Highland Papua', capital: 'Wamena', island: 'Maluku & Papua', population: 1.45, poverty: 34.40, hdi: 54.4, growth: 3.2 },
    { name: 'Southwest Papua', capital: 'Sorong', island: 'Maluku & Papua', population: 0.61, poverty: 18.50, hdi: 66.8, growth: 4.0 }
  ];

  // National reference values the province pages compare against.
  var NATIONAL = { population: 281.6, poverty: 9.03, hdi: 75.02, growth: 5.03 };

  // Release calendar: when the headline series are next published by BPS.
  var RELEASES = [
    { date: 'First Monday each month', title: 'Inflation and foreign trade', detail: 'Consumer price index for the month just ended, plus exports and imports.' },
    { date: '5 February', title: 'GDP and economic growth', detail: 'Fourth-quarter and full-year national accounts.' },
    { date: 'Early May & November', title: 'Labour force survey', detail: 'Unemployment, wages and informality from Sakernas (February and August rounds).' },
    { date: 'Mid-January & July', title: 'Poverty profile', detail: 'Poverty rate and depth from the March and September Susenas rounds.' },
    { date: 'Mid-November', title: 'Human Development Index', detail: 'National and provincial HDI with its four components.' }
  ];

  function indicatorById(id) {
    for (var i = 0; i < INDICATORS.length; i++) if (INDICATORS[i].id === id) return INDICATORS[i];
    return null;
  }

  function provinceSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  function provinceBySlug(slug) {
    for (var i = 0; i < PROVINCES.length; i++) if (provinceSlug(PROVINCES[i].name) === slug) return PROVINCES[i];
    return null;
  }

  return {
    YEARS: YEARS,
    INDICATORS: INDICATORS,
    PROVINCES: PROVINCES,
    NATIONAL: NATIONAL,
    RELEASES: RELEASES,
    indicatorById: indicatorById,
    provinceSlug: provinceSlug,
    provinceBySlug: provinceBySlug
  };
})();
