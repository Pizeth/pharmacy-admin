import polyglotI18nProvider from "ra-i18n-polyglot";
import en from "ra-language-english";
import fr from "ra-language-french";
import jp from "@bicstone/ra-language-japanese";
import { resolveBrowserLocale } from "react-admin";

const messages: { [key: string]: any } = {
  en: {
    ...en,
    ra: {
      validation: {
        required: "This field is required", // Add the translation
      },
    },
  },
  jp: {
    ...jp,
  },
  fr: {
    ...fr,
  },
};

// export const i18nProvider = polyglotI18nProvider(
//   (locale) => messages[locale],
//   "en", // default locale
//   [
//     { locale: "en", name: "English" },
//     { locale: "fr", name: "Français" },
//     { locale: "jp", name: "日本語" },
//   ],
// );

export const i18nProvider = polyglotI18nProvider(
  (locale) => (messages[locale] ? messages[locale] : messages.en),
  resolveBrowserLocale(),
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
    { locale: "jp", name: "日本語" },
  ],
);

// export const i18nProvider = polyglotI18nProvider(
//   (locale) => messages[locale],
//   "en",
// );
