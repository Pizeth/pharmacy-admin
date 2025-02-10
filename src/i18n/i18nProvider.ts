import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";

const messages: { [key: string]: any } = {
  en: {
    ...englishMessages,
    ra: {
      validation: {
        required: "This field is required", // Add the translation
      },
    },
  },
};

export const i18nProvider = polyglotI18nProvider(
  (locale) => messages[locale],
  "en",
);
