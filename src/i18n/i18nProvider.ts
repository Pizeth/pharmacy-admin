import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import fr from "ra-language-french";
import jp from "@bicstone/ra-language-japanese";
import { maxValue, mergeTranslations, resolveBrowserLocale } from "react-admin";

const messages: { [key: string]: any } = {
  en: {
    ...englishMessages,
    razeth: {
      validation: {
        required: "%{field} is required!",
        notmatch: "The password do not match!",
        unique: "%{field} %{value} is already existed!",
        async: "An error occurred while validating the %{field}!",
      },
    },
    // "razeth.validation.required": "%{field} is required!",
    // "razeth.validation.notmatch": "The passwords do not match!",

    // ra: {
    //   validation: {
    //     // ...englishMessages,
    //     required: "%{field} is required!", // Add the translation
    //     unique: "Value %{value} is already used for %{field}",
    //     maxValue: "%{max} is higher than %{value}",
    //   },
    // },
  },
  jp: {
    ...jp,
  },
  fr: {
    ...fr,
  },
};

// export const i18nProvider = polyglotI18nProvider(
//   (locale) => (messages[locale] ? messages[locale] : messages.en),
//   resolveBrowserLocale(),
//   [
//     { locale: "en", name: "English" },
//     { locale: "fr", name: "Français" },
//     { locale: "jp", name: "日本語" },
//   ],
// );

export const i18nProvider = polyglotI18nProvider(
  (locale) => messages[locale] || messages.en,
  // (locale) => {
  //   const messagesForLocale = messages[locale] || messages.en;
  //   console.log("Loaded messages:", messagesForLocale); // Debugging
  //   return messagesForLocale;
  // },
  // (locale) => {
  //   const finalMessages = {
  //     ...(messages[locale] || messages.en),
  //     // Add fallback for missing translations
  //     "razeth.validation.notmatch":
  //       messages[locale]?.["razeth.validation.notmatch"] ||
  //       "Password mismatch (fallback)",
  //   };
  //   // console.log("Active translations:", finalMessages);
  //   return finalMessages;
  // },
  resolveBrowserLocale(),
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
    { locale: "jp", name: "日本語" },
  ],
);
