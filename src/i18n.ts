import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import authorizationEN from './locales/en/authorization.json';
import categoriesAndProductsEN from './locales/en/categoriesAndProducts.json';
import clientsEN from './locales/en/clients.json';
import dashboardDefaultEN from './locales/en/dashboardDefault.json';
import employeesEN from './locales/en/employees.json';
import invoicesEN from './locales/en/invoices.json';
import globalMenuEN from './locales/en/globalMenu.json';
import landingPageEN from './locales/en/landingPage.json';
import termsEN from './locales/en/terms.json';
import settingsEN from './locales/en/settings.json';
import chartsEN from './locales/en/charts.json'

import authorizationES from './locales/es/authorization.json';
import categoriesAndProductsES from './locales/es/categoriesAndProducts.json';
import clientsES from './locales/es/clients.json';
import dashboardDefaultES from './locales/es/dashboardDefault.json';
import employeesES from './locales/es/employees.json';
import invoicesES from './locales/es/invoices.json';
import globalMenuES from './locales/es/globalMenu.json';
import landingPageES from './locales/es/landingPage.json';
import termsES from './locales/es/terms.json';
import settingsES from './locales/es/settings.json';
import chartsES from './locales/es/charts.json'

import authorizationGE from './locales/ge/authorization.json';
import categoriesAndProductsGE from './locales/ge/categoriesAndProducts.json';
import clientsGE from './locales/ge/clients.json';
import dashboardDefaultGE from './locales/ge/dashboardDefault.json';
import employeesGE from './locales/ge/employees.json';
import invoicesGE from './locales/ge/invoices.json';
import globalMenuGE from './locales/ge/globalMenu.json';
import landingPageGE from './locales/ge/landingPage.json';
import termsGE from './locales/ge/terms.json';
import settingsGE from './locales/ge/settings.json';
import chartsGE from './locales/ge/charts.json'

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
        globalMenu: globalMenuEN,
        landingPage: landingPageEN,
        terms: termsEN,
        settings: settingsEN,
        charts: chartsEN
      },
      es: {
        authorization: authorizationES,
        categoriesAndProducts: categoriesAndProductsES,
        clients: clientsES,
        dashboardDefault: dashboardDefaultES,
        employees: employeesES,
        invoices: invoicesES,
        globalMenu: globalMenuES,
        landingPage: landingPageES,
        terms: termsES,
        settings: settingsES,
        charts: chartsES
      },
      ge: {
        authorization: authorizationGE,
        categoriesAndProducts: categoriesAndProductsGE,
        clients: clientsGE,
        dashboardDefault: dashboardDefaultGE,
        employees: employeesGE,
        invoices: invoicesGE,
        globalMenu: globalMenuGE,
        landingPage: landingPageGE,
        terms: termsGE,
        settings: settingsGE,
        charts: chartsGE
      },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    debug: true,
    ns: [
      'authorization',
      'categoriesAndProducts',
      'clients',
      'dashboardDefault',
      'employees',
      'invoices',
      'globalMenu',
      'landingPage',
      'terms',
      'settings',
      'charts'
    ], 
    defaultNS: 'authorization',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
