import type { AppLanguage } from "@/lib/i18n/languages";

type AboutSection = {
  id: string;
  title: string;
  subtitle?: string;
  body: readonly string[];
};

type AboutCopy = {
  title: string;
  intro: readonly string[];
  sections: readonly AboutSection[];
};

type HowItWorksCopy = {
  title: string;
  intro: string;
  steps: readonly { number: number; title: string; body: string }[];
  tagline: string;
};

const ABOUT_EN: AboutCopy = {
  title: "About RestHalf",
  intro: [
    "RestHalf is a travel technology company making travel more flexible, accessible, and efficient by connecting people with accommodation that fits their time, needs, and budget, while creating smarter opportunities for hotels to serve additional travelers and make better use of available inventory.",
    "Travel does not always follow traditional hotel schedules. Travelers may arrive early, leave late, have a long gap between flights or train journeys, attend business meetings, or simply need a comfortable place to stay for a specific period of time.",
    "RestHalf helps travelers find accommodation that better matches their actual schedule, while giving hotels an additional way to serve customers whose travel needs may not fit traditional hotel stays.",
    "For hotels, RestHalf provides a flexible distribution channel that can help attract additional customers and make better use of available inventory. Hotels remain in control of their availability, room types, pricing, schedules, and booking conditions.",
    "Our goal is simple: make accommodation work better for both travelers and hospitality partners.",
  ],
  sections: [
    {
      id: "travelers",
      title: "For Travelers",
      subtitle: "Accommodation that fits your schedule.",
      body: [
        "Whether you arrive early, depart late, have time between journeys, or need a comfortable place during a busy day, RestHalf helps you find accommodation that fits your time, needs, and budget.",
      ],
    },
    {
      id: "hotels",
      title: "For Hotels",
      subtitle: "More opportunities to serve travelers.",
      body: [
        "RestHalf helps hotels reach additional customer segments and create new opportunities from available inventory, while keeping hotels in control of their rooms, rates, availability, and booking conditions.",
      ],
    },
    {
      id: "vision",
      title: "Our Vision",
      body: [
        "We believe accommodation should be more flexible and better aligned with the way people actually travel.",
        "RestHalf is building a more flexible travel ecosystem where travelers have more choice and hotels have more opportunities to serve them.",
      ],
    },
  ],
} as const;

const ABOUT_ID: AboutCopy = {
  title: "Tentang RestHalf",
  intro: [
    "RestHalf adalah perusahaan teknologi perjalanan yang membuat perjalanan lebih fleksibel, mudah diakses, dan efisien dengan menghubungkan orang pada akomodasi yang sesuai dengan waktu, kebutuhan, dan anggaran mereka, sekaligus menciptakan peluang yang lebih cerdas bagi hotel untuk melayani lebih banyak wisatawan dan memanfaatkan inventaris yang tersedia dengan lebih baik.",
    "Perjalanan tidak selalu mengikuti jadwal hotel tradisional. Wisatawan mungkin tiba lebih awal, berangkat terlambat, memiliki jeda panjang antara penerbangan atau perjalanan kereta, menghadiri rapat bisnis, atau hanya membutuhkan tempat yang nyaman untuk jangka waktu tertentu.",
    "RestHalf membantu wisatawan menemukan akomodasi yang lebih sesuai dengan jadwal mereka, sekaligus memberi hotel cara tambahan untuk melayani pelanggan yang kebutuhannya mungkin tidak sesuai dengan menginap hotel tradisional.",
    "Bagi hotel, RestHalf menyediakan saluran distribusi yang fleksibel untuk menarik pelanggan tambahan dan memanfaatkan inventaris yang tersedia dengan lebih baik. Hotel tetap mengendalikan ketersediaan, tipe kamar, harga, jadwal, dan syarat pemesanan.",
    "Tujuan kami sederhana: membuat akomodasi bekerja lebih baik bagi wisatawan dan mitra perhotelan.",
  ],
  sections: [
    {
      id: "travelers",
      title: "Untuk Wisatawan",
      subtitle: "Akomodasi yang sesuai dengan jadwal Anda.",
      body: [
        "Baik Anda tiba lebih awal, berangkat terlambat, memiliki waktu di antara perjalanan, atau membutuhkan tempat yang nyaman di hari yang sibuk, RestHalf membantu Anda menemukan akomodasi yang sesuai dengan waktu, kebutuhan, dan anggaran Anda.",
      ],
    },
    {
      id: "hotels",
      title: "Untuk Hotel",
      subtitle: "Lebih banyak peluang untuk melayani wisatawan.",
      body: [
        "RestHalf membantu hotel menjangkau segmen pelanggan tambahan dan menciptakan peluang baru dari inventaris yang tersedia, sambil tetap memberi hotel kendali atas kamar, tarif, ketersediaan, dan syarat pemesanan.",
      ],
    },
    {
      id: "vision",
      title: "Visi Kami",
      body: [
        "Kami percaya akomodasi harus lebih fleksibel dan lebih selaras dengan cara orang benar-benar bepergian.",
        "RestHalf membangun ekosistem perjalanan yang lebih fleksibel di mana wisatawan memiliki lebih banyak pilihan dan hotel memiliki lebih banyak peluang untuk melayani mereka.",
      ],
    },
  ],
} as const;

export const ABOUT_CONTENT: Record<AppLanguage, AboutCopy> = {
  en: ABOUT_EN,
  id: ABOUT_ID,
};

const HOW_IT_WORKS_EN: HowItWorksCopy = {
  title: "How RestHalf works",
  intro: "RestHalf makes it easier to find accommodation that fits your travel schedule.",
  steps: [
    {
      number: 1,
      title: "Choose your destination",
      body: "Search for hotels and accommodation available at your destination.",
    },
    {
      number: 2,
      title: "Choose the time that fits you",
      body: "Select an available stay option that matches your arrival, departure, or travel schedule.",
    },
    {
      number: 3,
      title: "Choose your accommodation",
      body: "Compare available rooms, facilities, location, and pricing, then select the option that suits your needs.",
    },
    {
      number: 4,
      title: "Book securely",
      body: "Complete your booking through RestHalf and receive your booking confirmation.",
    },
    {
      number: 5,
      title: "Stay and enjoy",
      body: "Arrive at the hotel during your selected time and enjoy a comfortable stay without having to book more time than you need.",
    },
  ],
  tagline: "RestHalf: Accommodation that fits your time, needs, and budget.",
} as const;

const HOW_IT_WORKS_ID: HowItWorksCopy = {
  title: "Cara RestHalf bekerja",
  intro: "RestHalf memudahkan Anda menemukan akomodasi yang sesuai dengan jadwal perjalanan Anda.",
  steps: [
    {
      number: 1,
      title: "Pilih destinasi Anda",
      body: "Cari hotel dan akomodasi yang tersedia di destinasi Anda.",
    },
    {
      number: 2,
      title: "Pilih waktu yang sesuai untuk Anda",
      body: "Pilih opsi menginap yang tersedia sesuai kedatangan, keberangkatan, atau jadwal perjalanan Anda.",
    },
    {
      number: 3,
      title: "Pilih akomodasi Anda",
      body: "Bandingkan kamar, fasilitas, lokasi, dan harga yang tersedia, lalu pilih opsi yang sesuai dengan kebutuhan Anda.",
    },
    {
      number: 4,
      title: "Pesan dengan aman",
      body: "Selesaikan pemesanan melalui RestHalf dan terima konfirmasi pemesanan Anda.",
    },
    {
      number: 5,
      title: "Menginap dan nikmati",
      body: "Datang ke hotel pada waktu yang Anda pilih dan nikmati menginap yang nyaman tanpa harus memesan lebih lama dari yang Anda butuhkan.",
    },
  ],
  tagline: "RestHalf: Akomodasi yang sesuai dengan waktu, kebutuhan, dan anggaran Anda.",
} as const;

export const HOW_IT_WORKS_CONTENT: Record<AppLanguage, HowItWorksCopy> = {
  en: HOW_IT_WORKS_EN,
  id: HOW_IT_WORKS_ID,
};

type ListPropertyCopy = {
  title: string;
  intro: string;
  benefits: readonly string[];
};

const LIST_PROPERTY_EN: ListPropertyCopy = {
  title: "List your property",
  intro:
    "Partner with RestHalf to offer rest slots and overnight stays to travelers who need flexible hotel access near airports and city centers.",
  benefits: [
    "Reach travelers looking for daytime rest and short stays",
    "Keep control of inventory windows and rates",
    "Dedicated partner support from Jakarta and Hyderabad teams",
  ],
};

const LIST_PROPERTY_ID: ListPropertyCopy = {
  title: "Daftarkan properti Anda",
  intro:
    "Bermitra dengan RestHalf untuk menawarkan slot istirahat dan menginap semalam kepada wisatawan yang membutuhkan akses hotel fleksibel dekat bandara dan pusat kota.",
  benefits: [
    "Jangkau wisatawan yang mencari istirahat siang dan menginap singkat",
    "Tetap kendalikan jendela inventaris dan tarif",
    "Dukungan mitra khusus dari tim Jakarta dan Hyderabad",
  ],
};

export const LIST_PROPERTY_CONTENT: Record<AppLanguage, ListPropertyCopy> = {
  en: LIST_PROPERTY_EN,
  id: LIST_PROPERTY_ID,
};

type RateAppCopy = {
  title: string;
  intro: string;
  storeLinks: readonly { id: string; label: string; href: string }[];
};

const RATE_APP_EN: RateAppCopy = {
  title: "Rate this app",
  intro: "Your feedback helps us improve RestHalf for every traveler.",
  storeLinks: [
    { id: "ios", label: "Rate on the App Store", href: "#" },
    { id: "android", label: "Rate on Google Play", href: "#" },
  ],
};

const RATE_APP_ID: RateAppCopy = {
  title: "Nilai aplikasi ini",
  intro: "Masukan Anda membantu kami meningkatkan RestHalf untuk setiap wisatawan.",
  storeLinks: [
    { id: "ios", label: "Nilai di App Store", href: "#" },
    { id: "android", label: "Nilai di Google Play", href: "#" },
  ],
};

export const RATE_APP_CONTENT: Record<AppLanguage, RateAppCopy> = {
  en: RATE_APP_EN,
  id: RATE_APP_ID,
};
