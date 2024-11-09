import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translation files
import authorizationEN from './locales/en/authorization.json';
import categoriesAndProductsEN from './locales/en/categoriesAndProducts.json';
import clientsEN from './locales/en/clients.json';
import dashboardDefaultEN from './locales/en/dashboardDefault.json';
import employeesEN from './locales/en/employees.json';
import invoicesEN from './locales/en/invoices.json';
// import privacyPolicyEN from './locales/en/privacyPolicy.json';
// import quotesEN from './locales/en/quotes.json';
// import settingsEN from './locales/en/settings.json';

// Spanish translation files
import authorizationES from './locales/es/authorization.json';
import categoriesAndProductsES from './locales/es/categoriesAndProducts.json';
import clientsES from './locales/es/clients.json';
import dashboardDefaultES from './locales/es/dashboardDefault.json';
import employeesES from './locales/es/employees.json';
import invoicesES from './locales/es/invoices.json';
// import privacyPolicyES from './locales/es/privacyPolicy.json';
// import quotesES from './locales/es/quotes.json';
// import settingsES from './locales/es/settings.json';

// Georgian translation files
import authorizationGE from './locales/ge/authorization.json';
import categoriesAndProductsGE from './locales/ge/categoriesAndProducts.json';
import clientsGE from './locales/ge/clients.json';
import dashboardDefaultGE from './locales/ge/dashboardDefault.json';
import employeesGE from './locales/ge/employees.json';
import invoicesGE from './locales/ge/invoices.json';
// import privacyPolicyGE from './locales/ge/privacyPolicy.json';
// import quotesGE from './locales/ge/quotes.json';
// import settingsGE from './locales/ge/settings.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        authorization: authorizationEN,
        categoriesAndProducts: categoriesAndProductsEN,
        clients: clientsEN,
        dashboardDefault: dashboardDefaultEN,
        employees: employeesEN,
        invoices: invoicesEN,
        // privacyPolicy: privacyPolicyEN,
        // quotes: quotesEN,
        // settings: settingsEN,
      },
      es: {
        authorization: authorizationES,
        categoriesAndProducts: categoriesAndProductsES,
        clients: clientsES,
        dashboardDefault: dashboardDefaultES,
        employees: employeesES,
        invoices: invoicesES,
        // privacyPolicy: privacyPolicyES,
        // quotes: quotesES,
        // settings: settingsES,
      },
      ge: {
        authorization: authorizationGE,
        categoriesAndProducts: categoriesAndProductsGE,
        clients: clientsGE,
        dashboardDefault: dashboardDefaultGE,
        employees: employeesGE,
        invoices: invoicesGE,
        // privacyPolicy: privacyPolicyGE,
        // quotes: quotesGE,
        // settings: settingsGE,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    ns: [
      'authorization',
      'categoriesAndProducts',
      'clients',
      'dashboardDefault',
      'employees',
      'invoices',
      'privacyPolicy',
      'quotes',
      'settings'
    ],
    defaultNS: 'authorization',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
