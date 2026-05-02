// Types
import { SignatureColor, SignatureFont } from "@/types";

/**
 * Environment
 */
export const ENV = process.env.NODE_ENV;

/**
 * Websites
 */
export const BASE_URL = "https://invoify.vercel.app";
export const AUTHOR_WEBSITE = "https://aliabb.vercel.app";
export const AUTHOR_GITHUB = "https://github.com/al1abb";

/**
 * API endpoints
 */
export const GENERATE_PDF_API = "/api/invoice/generate";
export const SEND_PDF_API = "/api/invoice/send";
export const EXPORT_INVOICE_API = "/api/invoice/export";

/**
 * External API endpoints
 */
export const CURRENCIES_API =
  "https://openexchangerates.org/api/currencies.json";

/**
 * Local storage
 */
export const LOCAL_STORAGE_INVOICE_DRAFT_KEY = "invoify:invoiceDraft";

/**
 * Tailwind
 */
export const TAILWIND_CDN =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

/**
 * Google
 */
export const GOOGLE_SC_VERIFICATION = process.env.GOOGLE_SC_VERIFICATION;

/**
 * Nodemailer
 */
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PW = process.env.NODEMAILER_PW;

/**
 * I18N
 */
export const LOCALES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "es", name: "Español" },
  { code: "ca", name: "Català" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "pl", name: "Polish" },
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "tr", name: "Türkçe" },
  { code: "zh-CN", name: "简体中文" },
  { code: "ja", name: "日本語" },
  { code: "nb-NO", name: "Norwegian (bokmål)" },
  { code: "nn-NO", name: "Norwegian (nynorsk)" },
];
export const DEFAULT_LOCALE = LOCALES[0].code;

/**
 * Signature variables
 */
export const SIGNATURE_COLORS: SignatureColor[] = [
  { name: "black", label: "Black", color: "rgb(0, 0, 0)" },
  { name: "dark blue", label: "Dark Blue", color: "rgb(0, 0, 128)" },
  {
    name: "crimson",
    label: "Crimson",
    color: "#DC143C",
  },
];

export const SIGNATURE_FONTS: SignatureFont[] = [
  {
    name: "Dancing Script",
    variable: "var(--font-dancing-script)",
  },
  { name: "Parisienne", variable: "var(--font-parisienne)" },
  {
    name: "Great Vibes",
    variable: "var(--font-great-vibes)",
  },
  {
    name: "Alex Brush",
    variable: "var(--font-alex-brush)",
  },
];

/**
 * Form date options
 */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * Form defaults
 */
export const FORM_DEFAULT_VALUES = {
  sender: {
    name: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    email: "",
    phone: "",
    gstin: "",
    pan: "",
    customInputs: [],
  },
  receiver: {
    name: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    email: "",
    phone: "",
    customInputs: [],
  },
  details: {
    invoiceLogo: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    items: [
      {
        name: "",
        sacHsn: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        total: 0,
      },
    ],
    currency: "USD",
    language: "English",
    placeOfSupply: "",
    taxDetails: {
      amount: 0,
      amountType: "amount",
      taxID: "",
    },
    discountDetails: {
      amount: 0,
      amountType: "amount",
    },
    shippingDetails: {
      cost: 0,
      costType: "amount",
    },
    paymentInformation: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      paymentMethod: "",
      accountCurrency: "",
      ifscCode: "",
      accountType: "",
      beneficiaryAddress: "",
    },
    additionalNotes: "",
    paymentTerms: "",
    totalAmountInWords: "",
    pdfTemplate: 1,
  },
};

/**
 * ? DEV Only
 * Form auto fill values for testing
 */
export const FORM_FILL_VALUES = {
  sender: {
    name: "Silicon Instructors",
    address: "Room A, Prabinika Complex, 2/503, Pollachi Main Road, Malumichampatti",
    zipCode: "641050",
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    email: "info@siliconinstructos.com",
    phone: "+91 8883447274",
    gstin: "33AFRFS8793J1ZZ",
    pan: "AFRFS8793J",
  },
  receiver: {
    name: "GAG Nexus Private Limited",
    address: "3/5 Green Park, Rayampalayam, Avinashi",
    zipCode: "641654",
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    email: "edge@gagnexus.com",
    phone: "+91 9092472223",
    gstin: "33AALCG7774P1ZQ",
  },
  details: {
    invoiceLogo: "",
    invoiceNumber: "INV0001",
    invoiceDate: new Date(),
    dueDate: new Date(),
    items: [
      {
        name: "LegionInfo SafePlus Maintanance",
        sacHsn: "998313",
        description: "For the month of April 2026",
        quantity: 1,
        unitPrice: 10,
        total: 200,
      }
    ],
    currency: "INR",
    language: "English",
    placeOfSupply: "Tamil Nadu (33)",
    taxDetails: {
      amount: 15,
      amountType: "percentage",
      taxID: "18",
    },
    discountDetails: {
      amount: 5,
      amountType: "percentage",
    },
    shippingDetails: {
      cost: 5,
      costType: "percentage",
    },
    paymentInformation: {
      bankName: "Federal Bank",
      accountName: "Silicon Instructors",
      accountNumber: "20980200001963",
      paymentMethod: "NEFT",
      accountCurrency: "INR",
      ifscCode: "FDRL0002098",
      accountType: "Current account",
      beneficiaryAddress: "",
    },
    additionalNotes: "Thank you for your business",
    paymentTerms: "Net 15",
    signature: {
      data: "",
    },
    subTotal: "",
    totalAmount: "",
    totalAmountInWords: "",
    pdfTemplate: 3,
  },
};
