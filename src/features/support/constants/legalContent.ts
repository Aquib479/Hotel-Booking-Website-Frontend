import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";
import type { AppLanguage } from "@/lib/i18n/languages";
import type { ContactMethod, LegalDocument } from "../types";
import { formatDirectCancellationBullets } from "../types";

const directBullets = formatDirectCancellationBullets();

export const TERMS_OF_SERVICE: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  lastUpdated: "2026-01-15",
  intro:
    "These Terms govern your use of RestHalf's website and booking services. By completing a booking you agree to these Terms and our Cancellation Policy.",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of terms",
      paragraphs: [
        "RestHalf provides a platform to search and book hotel rest slots and overnight stays. These Terms apply to all users, whether or not you create an account.",
        "If you book on behalf of someone else, you confirm you have authority to accept these Terms for them.",
      ],
    },
    {
      id: "services",
      title: "Our services",
      paragraphs: [
        "RestHalf offers RestHalf Exclusive (Direct) inventory confirmed by RestHalf and Partner (Wholesale) rates supplied by third parties. Product availability, pricing, and confirmation times vary by lane and property.",
      ],
      listItems: [
        "Direct bookings: sold and supported by RestHalf subject to these Terms.",
        "Partner bookings: subject to the supplier's terms in addition to these Terms where applicable.",
      ],
    },
    {
      id: "bookings",
      title: "Bookings and payment",
      paragraphs: [
        "A booking is confirmed only when you receive a confirmation reference and, where required, payment succeeds. Display currencies are indicative until checkout shows the charge currency and amount.",
        "You are responsible for accurate guest details, contact information, and compliance with hotel house rules.",
      ],
    },
    {
      id: "conduct",
      title: "Acceptable use",
      paragraphs: [
        "You may not misuse the platform, attempt unauthorized access, or make fraudulent bookings. We may suspend accounts or cancel bookings that violate these Terms or applicable law.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      paragraphs: [
        "RestHalf acts as an intermediary for Partner rates. To the extent permitted by law, RestHalf is not liable for acts or omissions of hotels or partner suppliers beyond our direct booking obligations.",
        "Nothing in these Terms limits rights that cannot be excluded under consumer protection law in your jurisdiction.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these Terms",
      paragraphs: [
        "We may update these Terms from time to time. The last-updated date at the top of this page indicates the current version. Material changes affecting existing bookings will be communicated where required.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Questions about these Terms: support@resthalf.com or via our Contact page.",
      ],
    },
  ],
};

export const CANCELLATION_POLICY: LegalDocument = {
  slug: "cancellation-policy",
  title: "Cancellation Policy",
  lastUpdated: "2026-01-15",
  intro:
    "Cancellation and refund rules depend on whether you booked RestHalf Exclusive (Direct) or a Partner (Wholesale) rate. The summary shown at checkout and on your booking is drawn from this policy.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        "Always check your booking confirmation for the policy that applied at the time of purchase. Partner bookings may include supplier-specific terms captured on your confirmation.",
      ],
    },
    {
      id: "direct-bookings",
      title: "RestHalf Exclusive (Direct) bookings",
      paragraphs: [
        `Direct rest and stay bookings follow RestHalf's cancellation windows. Free cancellation is available until ${DIRECT_CANCEL_HOURS_BEFORE_SLOT} hours before your slot or check-in time (hotel local time).`,
      ],
      listItems: directBullets,
      subsections: [
        {
          id: "direct-refund-tiers",
          title: "Refund timing",
          paragraphs: [
            "Cancellations before the free cutoff receive a full refund of the amount paid for the booking.",
            `Cancellations within ${DIRECT_CANCEL_HOURS_BEFORE_SLOT} hours of slot start (or after check-in for stay bookings where applicable) forfeit the booking amount.`,
            "No-shows are treated as non-refundable.",
          ],
        },
        {
          id: "direct-processing",
          title: "How refunds are processed",
          paragraphs: [
            "Approved refunds are returned to your original payment method. Most refunds complete within 5–7 business days depending on your bank or wallet provider.",
            "Partial refunds, if any, will be explained on the cancellation preview before you confirm.",
          ],
        },
      ],
    },
    {
      id: "wholesale-bookings",
      title: "Partner (Wholesale) bookings",
      paragraphs: [
        "Partner bookings are fulfilled by third-party suppliers. RestHalf does not set partner cancellation terms — those terms are displayed when you select the rate and on your booking confirmation.",
        "RestHalf may assist with cancellation requests but cannot guarantee outcomes beyond the supplier's policy.",
      ],
      listItems: [
        "Cancellation windows and refund percentages are defined by the partner supplier.",
        "Supplier confirmation numbers may be required when contacting the hotel directly.",
        "Submit cancellation requests through My Bookings or RestHalf support if self-serve cancel is unavailable.",
        "Refund timelines follow the supplier and payment processor — often 5–14 business days.",
      ],
    },
    {
      id: "how-to-cancel",
      title: "How to cancel",
      paragraphs: [
        "Sign in, open My Bookings, select your booking, and follow the cancel flow when eligible. If cancel is unavailable, contact support with your booking reference.",
      ],
    },
    {
      id: "disputes",
      title: "Questions and disputes",
      paragraphs: [
        "For policy questions email support@resthalf.com with your booking reference. We will respond with the policy snapshot stored for your booking.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: "2026-01-15",
  intro:
    "This Privacy Policy explains how RestHalf collects, uses, and protects personal data when you use our website and booking services.",
  sections: [
    {
      id: "data-we-collect",
      title: "Information we collect",
      paragraphs: [
        "We collect information you provide when searching, booking, creating an account, or contacting support.",
      ],
      listItems: [
        "Identity and contact: name, email, phone number (including WhatsApp).",
        "Booking details: hotels, dates, slots, guest counts, special requests.",
        "Payment metadata: method type and transaction references (we do not store full card numbers).",
        "Usage data: device, browser, and analytics to improve the product.",
      ],
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      paragraphs: [
        "We use your data to process bookings, send confirmations and service messages (including WhatsApp), provide support, prevent fraud, and improve RestHalf.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing with hotels and partners",
      paragraphs: [
        "We share necessary booking details with hotels and partner suppliers to fulfill your reservation. Partners process data under their own privacy policies when you complete a wholesale booking.",
      ],
    },
    {
      id: "whatsapp",
      title: "WhatsApp notifications",
      paragraphs: [
        "If you provide a mobile number, we may send booking confirmations and service updates via WhatsApp. You can manage marketing preferences in your account; transactional messages may still be sent for active bookings.",
      ],
    },
    {
      id: "retention",
      title: "Data retention",
      paragraphs: [
        "We retain booking and account records as needed for legal, tax, and support purposes, then delete or anonymize data when no longer required.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "Depending on your location you may have rights to access, correct, delete, or export your data. Contact privacy@resthalf.com or use account settings where available.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We use industry-standard measures to protect data in transit and at rest. No method of transmission over the internet is 100% secure.",
      ],
    },
    {
      id: "updates",
      title: "Policy updates",
      paragraphs: [
        "We may update this policy periodically. Continued use after changes constitutes acceptance of the updated policy where permitted by law.",
      ],
    },
  ],
};

const TERMS_OF_SERVICE_ID: LegalDocument = {
  slug: "terms",
  title: "Ketentuan Layanan",
  lastUpdated: "2026-01-15",
  intro:
    "Ketentuan ini mengatur penggunaan situs web dan layanan pemesanan RestHalf. Dengan menyelesaikan pemesanan, Anda menyetujui Ketentuan ini dan Kebijakan Pembatalan kami.",
  sections: [
    {
      id: "acceptance",
      title: "Penerimaan ketentuan",
      paragraphs: [
        "RestHalf menyediakan platform untuk mencari dan memesan slot istirahat hotel serta menginap semalam. Ketentuan ini berlaku untuk semua pengguna, baik yang memiliki akun maupun tidak.",
        "Jika Anda memesan atas nama orang lain, Anda menegaskan bahwa Anda berwenang menerima Ketentuan ini untuk mereka.",
      ],
    },
    {
      id: "services",
      title: "Layanan kami",
      paragraphs: [
        "RestHalf menawarkan inventaris RestHalf Exclusive (Langsung) yang dikonfirmasi oleh RestHalf dan tarif Mitra (Grosir) yang disediakan pihak ketiga. Ketersediaan produk, harga, dan waktu konfirmasi berbeda menurut jalur dan properti.",
      ],
      listItems: [
        "Pemesanan langsung: dijual dan didukung oleh RestHalf sesuai Ketentuan ini.",
        "Pemesanan mitra: tunduk pada ketentuan pemasok selain Ketentuan ini jika berlaku.",
      ],
    },
    {
      id: "bookings",
      title: "Pemesanan dan pembayaran",
      paragraphs: [
        "Pemesanan dikonfirmasi hanya setelah Anda menerima referensi konfirmasi dan, jika diperlukan, pembayaran berhasil. Mata uang tampilan bersifat indikatif hingga checkout menampilkan mata uang dan jumlah penagihan.",
        "Anda bertanggung jawab atas data tamu yang akurat, informasi kontak, dan mematuhi peraturan hotel.",
      ],
    },
    {
      id: "conduct",
      title: "Penggunaan yang dapat diterima",
      paragraphs: [
        "Anda tidak boleh menyalahgunakan platform, mencoba akses tanpa izin, atau membuat pemesanan palsu. Kami dapat menangguhkan akun atau membatalkan pemesanan yang melanggar Ketentuan ini atau hukum yang berlaku.",
      ],
    },
    {
      id: "liability",
      title: "Batasan tanggung jawab",
      paragraphs: [
        "RestHalf bertindak sebagai perantara untuk tarif Mitra. Sejauh diizinkan hukum, RestHalf tidak bertanggung jawab atas tindakan atau kelalaian hotel atau pemasok mitra di luar kewajiban pemesanan langsung kami.",
        "Tidak ada dalam Ketentuan ini yang membatasi hak yang tidak dapat dikecualikan berdasarkan hukum perlindungan konsumen di yurisdiksi Anda.",
      ],
    },
    {
      id: "changes",
      title: "Perubahan Ketentuan ini",
      paragraphs: [
        "Kami dapat memperbarui Ketentuan ini dari waktu ke waktu. Tanggal terakhir diperbarui di bagian atas halaman ini menunjukkan versi yang berlaku. Perubahan material yang memengaruhi pemesanan yang ada akan dikomunikasikan jika diwajibkan.",
      ],
    },
    {
      id: "contact",
      title: "Kontak",
      paragraphs: [
        "Pertanyaan tentang Ketentuan ini: support@resthalf.com atau melalui halaman Kontak kami.",
      ],
    },
  ],
};

const CANCELLATION_POLICY_ID: LegalDocument = {
  slug: "cancellation-policy",
  title: "Kebijakan Pembatalan",
  lastUpdated: "2026-01-15",
  intro:
    "Aturan pembatalan dan refund bergantung pada apakah Anda memesan RestHalf Exclusive (Langsung) atau tarif Mitra (Grosir). Ringkasan yang ditampilkan saat checkout dan pada pemesanan Anda diambil dari kebijakan ini.",
  sections: [
    {
      id: "overview",
      title: "Ikhtisar",
      paragraphs: [
        "Selalu periksa konfirmasi pemesanan Anda untuk kebijakan yang berlaku pada saat pembelian. Pemesanan mitra dapat mencakup syarat khusus pemasok yang tercantum pada konfirmasi Anda.",
      ],
    },
    {
      id: "direct-bookings",
      title: "Pemesanan RestHalf Exclusive (Langsung)",
      paragraphs: [
        `Pemesanan istirahat dan menginap langsung mengikuti jendela pembatalan RestHalf. Pembatalan gratis tersedia hingga ${DIRECT_CANCEL_HOURS_BEFORE_SLOT} jam sebelum slot atau waktu check-in Anda (waktu lokal hotel).`,
      ],
      listItems: formatDirectCancellationBullets("id"),
      subsections: [
        {
          id: "direct-refund-tiers",
          title: "Waktu refund",
          paragraphs: [
            "Pembatalan sebelum batas gratis menerima refund penuh dari jumlah yang dibayar untuk pemesanan.",
            `Pembatalan dalam ${DIRECT_CANCEL_HOURS_BEFORE_SLOT} jam sebelum slot dimulai (atau setelah check-in untuk pemesanan menginap jika berlaku) menggugurkan jumlah pemesanan.`,
            "Tidak hadir diperlakukan sebagai tidak dapat direfund.",
          ],
        },
        {
          id: "direct-processing",
          title: "Cara refund diproses",
          paragraphs: [
            "Refund yang disetujui dikembalikan ke metode pembayaran asli Anda. Sebagian besar refund selesai dalam 5–7 hari kerja tergantung bank atau penyedia dompet Anda.",
            "Refund sebagian, jika ada, akan dijelaskan pada pratinjau pembatalan sebelum Anda mengonfirmasi.",
          ],
        },
      ],
    },
    {
      id: "wholesale-bookings",
      title: "Pemesanan Mitra (Grosir)",
      paragraphs: [
        "Pemesanan mitra dipenuhi oleh pemasok pihak ketiga. RestHalf tidak menetapkan syarat pembatalan mitra — syarat tersebut ditampilkan saat Anda memilih tarif dan pada konfirmasi pemesanan.",
        "RestHalf dapat membantu permintaan pembatalan tetapi tidak dapat menjamin hasil di luar kebijakan pemasok.",
      ],
      listItems: [
        "Jendela pembatalan dan persentase refund ditentukan oleh pemasok mitra.",
        "Nomor konfirmasi pemasok mungkin diperlukan saat menghubungi hotel secara langsung.",
        "Ajukan permintaan pembatalan melalui Pemesanan Saya atau dukungan RestHalf jika pembatalan mandiri tidak tersedia.",
        "Jadwal refund mengikuti pemasok dan prosesor pembayaran — sering 5–14 hari kerja.",
      ],
    },
    {
      id: "how-to-cancel",
      title: "Cara membatalkan",
      paragraphs: [
        "Masuk, buka Pemesanan Saya, pilih pemesanan, dan ikuti alur pembatalan jika memenuhi syarat. Jika pembatalan tidak tersedia, hubungi dukungan dengan referensi pemesanan Anda.",
      ],
    },
    {
      id: "disputes",
      title: "Pertanyaan dan sengketa",
      paragraphs: [
        "Untuk pertanyaan kebijakan, email support@resthalf.com dengan referensi pemesanan Anda. Kami akan merespons dengan snapshot kebijakan yang tersimpan untuk pemesanan Anda.",
      ],
    },
  ],
};

const PRIVACY_POLICY_ID: LegalDocument = {
  slug: "privacy",
  title: "Kebijakan Privasi",
  lastUpdated: "2026-01-15",
  intro:
    "Kebijakan Privasi ini menjelaskan bagaimana RestHalf mengumpulkan, menggunakan, dan melindungi data pribadi saat Anda menggunakan situs web dan layanan pemesanan kami.",
  sections: [
    {
      id: "data-we-collect",
      title: "Informasi yang kami kumpulkan",
      paragraphs: [
        "Kami mengumpulkan informasi yang Anda berikan saat mencari, memesan, membuat akun, atau menghubungi dukungan.",
      ],
      listItems: [
        "Identitas dan kontak: nama, email, nomor telepon (termasuk WhatsApp).",
        "Detail pemesanan: hotel, tanggal, slot, jumlah tamu, permintaan khusus.",
        "Metadata pembayaran: jenis metode dan referensi transaksi (kami tidak menyimpan nomor kartu lengkap).",
        "Data penggunaan: perangkat, browser, dan analitik untuk meningkatkan produk.",
      ],
    },
    {
      id: "how-we-use",
      title: "Bagaimana kami menggunakan informasi Anda",
      paragraphs: [
        "Kami menggunakan data Anda untuk memproses pemesanan, mengirim konfirmasi dan pesan layanan (termasuk WhatsApp), memberikan dukungan, mencegah penipuan, dan meningkatkan RestHalf.",
      ],
    },
    {
      id: "sharing",
      title: "Berbagi dengan hotel dan mitra",
      paragraphs: [
        "Kami membagikan detail pemesanan yang diperlukan kepada hotel dan pemasok mitra untuk memenuhi reservasi Anda. Mitra memproses data berdasarkan kebijakan privasi mereka sendiri saat Anda menyelesaikan pemesanan grosir.",
      ],
    },
    {
      id: "whatsapp",
      title: "Notifikasi WhatsApp",
      paragraphs: [
        "Jika Anda memberikan nomor ponsel, kami dapat mengirim konfirmasi pemesanan dan pembaruan layanan melalui WhatsApp. Anda dapat mengelola preferensi pemasaran di akun Anda; pesan transaksional tetap dapat dikirim untuk pemesanan aktif.",
      ],
    },
    {
      id: "retention",
      title: "Retensi data",
      paragraphs: [
        "Kami menyimpan catatan pemesanan dan akun sesuai kebutuhan hukum, pajak, dan dukungan, lalu menghapus atau menganonimkan data jika tidak lagi diperlukan.",
      ],
    },
    {
      id: "rights",
      title: "Hak Anda",
      paragraphs: [
        "Tergantung lokasi Anda, Anda mungkin memiliki hak untuk mengakses, memperbaiki, menghapus, atau mengekspor data Anda. Hubungi privacy@resthalf.com atau gunakan pengaturan akun jika tersedia.",
      ],
    },
    {
      id: "security",
      title: "Keamanan",
      paragraphs: [
        "Kami menggunakan langkah standar industri untuk melindungi data dalam perjalanan dan saat disimpan. Tidak ada metode transmisi melalui internet yang 100% aman.",
      ],
    },
    {
      id: "updates",
      title: "Pembaruan kebijakan",
      paragraphs: [
        "Kami dapat memperbarui kebijakan ini secara berkala. Penggunaan berkelanjutan setelah perubahan merupakan penerimaan kebijakan yang diperbarui sepanjang diizinkan hukum.",
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS = {
  terms: TERMS_OF_SERVICE,
  "cancellation-policy": CANCELLATION_POLICY,
  privacy: PRIVACY_POLICY,
} as const;

const LEGAL_DOCUMENTS_ID = {
  terms: TERMS_OF_SERVICE_ID,
  "cancellation-policy": CANCELLATION_POLICY_ID,
  privacy: PRIVACY_POLICY_ID,
} as const;

export type LegalDocumentSlug = keyof typeof LEGAL_DOCUMENTS;

export function getLegalDocument(
  slug: LegalDocumentSlug,
  language: AppLanguage = "en",
): LegalDocument {
  return language === "id" ? LEGAL_DOCUMENTS_ID[slug] : LEGAL_DOCUMENTS[slug];
}

export const CONTACT_METHODS = [
  {
    id: "email",
    label: "Email",
    description: "contactus@resthalf.com",
    href: "mailto:contactus@resthalf.com?subject=RestHalf%20inquiry",
    responseTime: "Within 24 hours on business days",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Chat with us — fastest for booking questions on the go",
    href: "https://wa.me/6281523902591?text=Hi%20RestHalf%2C%20I%20need%20help%20with%20a%20booking",
    responseTime: "Usually replies within 1 hour",
    external: true,
  },
  {
    id: "phone",
    label: "Phone",
    description: "+62 81523902591 (English & Bahasa)",
    href: "tel:+6281523902591",
    responseTime: "9:00–21:00 WIB",
  },
] as const;

export function getContactMethods(language: AppLanguage): ContactMethod[] {
  if (language !== "id") {
    return CONTACT_METHODS.map((m) => ({ ...m }));
  }
  return [
    {
      id: "email",
      label: "Email",
      description: "contactus@resthalf.com",
      href: "mailto:contactus@resthalf.com?subject=RestHalf%20inquiry",
      responseTime: "Dalam 24 jam pada hari kerja",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      description: "Chat dengan kami — tercepat untuk pertanyaan pemesanan di perjalanan",
      href: "https://wa.me/6281523902591?text=Hi%20RestHalf%2C%20I%20need%20help%20with%20a%20booking",
      responseTime: "Biasanya membalas dalam 1 jam",
      external: true,
    },
    {
      id: "phone",
      label: "Telepon",
      description: "+62 81523902591 (English & Bahasa)",
      href: "tel:+6281523902591",
      responseTime: "9:00–21:00 WIB",
    },
  ];
}

export const CONTACT_OFFICES = [
  {
    id: "hq",
    label: "Indonesia",
    city: "Jakarta, Indonesia",
    detail:
      "Office address: Komplek Perkantoran Duta Merlin Blok F13, Room number: 3E, Jl. Gajah Mada RT.2/RW.8, Petojo Utara, Kec. Gambir, Jakarta Pusat, DKI Jakarta 10130",
  },
  {
    id: "india",
    label: "Hyderabad",
    city: "Hyderabad, India",
    detail:
      "Premises: Unit no 103, 10-2299/A, Alliance Landmark, Mallepally Village, Asifnagar Mandal, Hyderabad District, T.S",
  },
] as const;

export const CONSUMER_COMPLAINT = {
  whatsappLine: "WhatsApp No: +62853-1111-1010",
  agencyWhatsAppHref: "https://wa.me/6285311111010",
  en: {
    heading: "Consumer complaints",
    agency: "Directorate General of Consumer Protection and Trade Compliance,",
    ministry: "Ministry of Trade of the Republic of Indonesia",
  },
  id: {
    heading: "Layanan Pengaduan Konsumen",
    agency: "Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga",
    ministry: "Kementerian Perdagangan Republik Indonesia",
  },
} as const;

export const CONTACT_SUBJECT_OPTIONS = [
  { value: "booking_issue" as const, label: "Booking issue" },
  { value: "refund_question" as const, label: "Refund question" },
  { value: "technical_issue" as const, label: "Technical issue" },
  { value: "other" as const, label: "Other" },
];

export function getContactSubjectOptions(t: (key: string) => string) {
  return [
    { value: "booking_issue" as const, label: t("support.bookingIssue") },
    { value: "refund_question" as const, label: t("support.refundQ") },
    { value: "technical_issue" as const, label: t("support.techIssue") },
    { value: "other" as const, label: t("support.other") },
  ];
}
