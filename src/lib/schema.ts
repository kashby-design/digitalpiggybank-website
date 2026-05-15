const SITE_URL = 'https://digitalpiggybank.com';
const ORG_NAME = 'Digital Piggy Bank';
const LOGO_PATH = '/images/App-Icon.svg';

const SOCIAL_LINKS = [
  'https://www.facebook.com/profile.php?id=61566121137460',
  'https://www.instagram.com/piggybank_app/',
  'https://www.tiktok.com/@piggy.bank.app',
  'https://x.com/dgtlpiggybank',
];

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${LOGO_PATH}`,
    },
    sameAs: SOCIAL_LINKS,
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-US',
  };
}

export function mobileApplication() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: ORG_NAME,
    operatingSystem: 'iOS, Android',
    applicationCategory: 'FinanceApplication',
    description:
      'A digital piggy bank for parents of kids 4–12, because nobody carries cash anymore.',
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    offers: [
      {
        '@type': 'Offer',
        price: '7.99',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '7.99',
          priceCurrency: 'USD',
          billingDuration: 'P1Y',
          billingIncrement: 1,
        },
        category: 'subscription',
        description: 'Annual subscription — $7.99/year',
      },
      {
        '@type': 'Offer',
        price: '1.00',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '1.00',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
          billingIncrement: 1,
        },
        category: 'subscription',
        description: 'Monthly subscription — $1.00/month',
      },
    ],
  };
}

type Faq = { question: string; answer?: string | null; bullets?: string[] };

export function faqPage(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => {
      const text = f.answer
        ? f.answer
        : f.bullets
          ? f.bullets.join(' ')
          : '';
      return {
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text,
        },
      };
    }),
  };
}

type ArticleInput = {
  title: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  url: string;
  authorName?: string;
};

const TEAM_AUTHORS = new Set([ORG_NAME, 'Digital Piggy Bank Team']);

export function article(input: ArticleInput) {
  const name = input.authorName ?? ORG_NAME;
  const isTeam = TEAM_AUTHORS.has(name);
  const author = isTeam
    ? { '@type': 'Organization', name, url: SITE_URL }
    : { '@type': 'Person', name, url: `${SITE_URL}/about` };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: input.image.startsWith('http') ? input.image : `${SITE_URL}${input.image}`,
    datePublished: input.datePublished.toISOString(),
    dateModified: (input.dateModified ?? input.datePublished).toISOString(),
    author,
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
  };
}

type BreadcrumbItem = { name: string; url: string };

export function breadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
