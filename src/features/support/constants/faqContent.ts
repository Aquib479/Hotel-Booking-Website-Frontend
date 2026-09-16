import type { AppLanguage } from "@/lib/i18n/languages";
import type { FaqCategory, FaqItem } from "../types";

const FAQ_CATEGORIES_EN: FaqCategory[] = [
  {
    id: "half-day-booking",
    label: "How half-day booking works",
    description: "Rest slots, stay mode, and what makes RestHalf different",
  },
  {
    id: "booking-payment",
    label: "Booking & payment",
    description: "Direct vs Partner rates, currencies, and payment methods",
  },
  {
    id: "cancellations-refunds",
    label: "Cancellations & refunds",
    description: "Cutoffs, refund timing, and lane differences",
  },
  {
    id: "check-in",
    label: "Check-in & at the hotel",
    description: "What to bring, where to go, and slot windows",
  },
  {
    id: "account-notifications",
    label: "Account & WhatsApp",
    description: "Sign-in, notifications, and managing bookings",
  },
];

const FAQ_CATEGORIES_ID: FaqCategory[] = [
  {
    id: "half-day-booking",
    label: "Cara pemesanan setengah hari bekerja",
    description: "Slot istirahat, mode menginap, dan yang membedakan RestHalf",
  },
  {
    id: "booking-payment",
    label: "Pemesanan & pembayaran",
    description: "Tarif Langsung vs Mitra, mata uang, dan metode pembayaran",
  },
  {
    id: "cancellations-refunds",
    label: "Pembatalan & refund",
    description: "Batas waktu, jadwal refund, dan perbedaan jalur",
  },
  {
    id: "check-in",
    label: "Check-in & di hotel",
    description: "Yang perlu dibawa, ke mana, dan jendela slot",
  },
  {
    id: "account-notifications",
    label: "Akun & WhatsApp",
    description: "Masuk, notifikasi, dan mengelola pemesanan",
  },
];

const FAQ_ITEMS_EN: FaqItem[] = [
  {
    id: "what-is-half-day",
    category: "half-day-booking",
    question: "What is a half-day or rest slot booking?",
    answer:
      "RestHalf lets you book hotel time in fixed windows — typically 12 hours — instead of only full overnight stays. Rest mode is built for layovers, early arrivals, and anyone who needs a shower and sleep without paying for a full night. Stay mode works like a normal hotel booking with check-in and check-out dates.",
  },
  {
    id: "rest-vs-stay",
    category: "half-day-booking",
    question: "What's the difference between Rest and Stay?",
    answer:
      "Rest is time-boxed: you pick a date and a slot window (for example 12:00–24:00). Stay is date-range based: check-in and check-out across one or more nights. Both are available on RestHalf Exclusive (Direct) and Partner (Wholesale) properties where offered.",
  },
  {
    id: "slot-windows",
    category: "half-day-booking",
    question: "How do slot windows work?",
    answer:
      "Each rest booking covers a defined window on a single calendar day — such as midnight–noon, noon–midnight, or a full 24-hour block. Your confirmation shows the exact window in the hotel's local time. Arrive within that window; late arrival may shorten usable time.",
  },
  {
    id: "direct-vs-wholesale",
    category: "booking-payment",
    question: "What is RestHalf Exclusive vs Partner rate?",
    answer:
      "RestHalf Exclusive (Direct) bookings are sold and confirmed by RestHalf — instant confirmation and RestHalf cancellation rules apply. Partner (Wholesale) rates come from third-party suppliers; RestHalf hands you off to complete payment and the supplier's terms apply.",
    laneAnswers: {
      direct:
        "Booked on RestHalf with instant confirmation. Payment and support are handled through RestHalf. Cancellation follows RestHalf Exclusive policy.",
      wholesale:
        "Sourced from a partner supplier. You may complete payment on a partner flow. The supplier's cancellation and refund rules apply — shown at booking and on your confirmation.",
    },
  },
  {
    id: "payment-methods",
    category: "booking-payment",
    question: "Which payment methods are accepted?",
    answer:
      "For Direct bookings we support cards, e-wallets (GoPay, OVO, DANA), and virtual accounts depending on your market. Partner bookings may offer different methods on the supplier checkout. All amounts are shown in the currency charged at checkout.",
  },
  {
    id: "currency-display",
    category: "booking-payment",
    question: "Can I browse in a different currency than I pay?",
    answer:
      "Yes. RestHalf lets you switch display currency while browsing. The amount charged at checkout is always shown clearly before you pay — that is the currency your card or wallet will be debited in.",
  },
  {
    id: "how-to-cancel",
    category: "cancellations-refunds",
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings, select the booking, and use Cancel booking if eligible. Policies differ by lane.",
    laneAnswers: {
      direct:
        "Cancel from My Bookings up to 2 hours before your slot starts for a full refund. Inside 2 hours, the slot rate is non-refundable.",
      wholesale:
        "Submit a cancellation request through RestHalf support. Refunds follow the partner supplier's policy shown at booking — RestHalf cannot override partner terms after handoff.",
    },
  },
  {
    id: "refund-timing",
    category: "cancellations-refunds",
    question: "How long do refunds take?",
    answer:
      "Approved refunds typically appear on your original payment method within 5–7 business days. Partner bookings may follow the supplier's timeline. Track refund status on your booking detail page when applicable.",
  },
  {
    id: "no-show",
    category: "cancellations-refunds",
    question: "What happens if I don't show up?",
    answer:
      "No-shows on RestHalf Exclusive rest slots are non-refundable. For Partner stays, the supplier's no-show policy applies. Contact support as soon as possible if your plans change.",
  },
  {
    id: "check-in-what-to-bring",
    category: "check-in",
    question: "What do I need at check-in?",
    answer:
      "Bring a valid photo ID and your booking reference (also sent via WhatsApp). For rest slots, arrive within your confirmed window and go to the front desk unless your confirmation specifies otherwise.",
  },
  {
    id: "airport-hotels",
    category: "check-in",
    question: "Are rest slots only at airport hotels?",
    answer:
      "Many rest slots are at properties near major airports, but RestHalf also lists city hotels. Use location search and filters to find properties that fit your trip.",
  },
  {
    id: "whatsapp-confirmation",
    category: "account-notifications",
    question: "Will I get a WhatsApp confirmation?",
    answer:
      "Yes — for Direct bookings we send confirmation details to the WhatsApp number you provide at checkout. This message mirrors your web confirmation: reference, hotel, slot or dates, and check-in guidance.",
  },
  {
    id: "guest-checkout",
    category: "account-notifications",
    question: "Do I need an account to book?",
    answer:
      "No. You can complete guest checkout. Creating an account lets you manage bookings, save details, and update notification preferences in one place.",
  },
  {
    id: "manage-bookings",
    category: "account-notifications",
    question: "Where do I view my bookings?",
    answer:
      "Sign in and open My Bookings from the navigation menu or your account page. You'll see upcoming, past, and cancelled bookings with filters by lane.",
  },
];

const FAQ_ITEMS_ID: FaqItem[] = [
  {
    id: "what-is-half-day",
    category: "half-day-booking",
    question: "Apa itu pemesanan setengah hari atau slot istirahat?",
    answer:
      "RestHalf memungkinkan Anda memesan waktu hotel dalam jendela tetap — biasanya 12 jam — bukan hanya menginap semalam penuh. Mode Istirahat dirancang untuk transit, kedatangan pagi, dan siapa pun yang butuh mandi serta tidur tanpa membayar semalaman penuh. Mode Menginap bekerja seperti pemesanan hotel biasa dengan tanggal check-in dan check-out.",
  },
  {
    id: "rest-vs-stay",
    category: "half-day-booking",
    question: "Apa perbedaan Rest (Istirahat) dan Stay (Menginap)?",
    answer:
      "Istirahat berbasis waktu: Anda memilih tanggal dan jendela slot (misalnya 12:00–24:00). Menginap berbasis rentang tanggal: check-in dan check-out selama satu malam atau lebih. Keduanya tersedia di properti RestHalf Exclusive (Langsung) dan Mitra (Grosir) jika ditawarkan.",
  },
  {
    id: "slot-windows",
    category: "half-day-booking",
    question: "Bagaimana jendela slot bekerja?",
    answer:
      "Setiap pemesanan istirahat mencakup jendela tertentu pada satu hari kalender — misalnya tengah malam–siang, siang–tengah malam, atau blok 24 jam penuh. Konfirmasi Anda menampilkan jendela persis dalam waktu lokal hotel. Datang dalam jendela itu; keterlambatan dapat mempersingkat waktu yang dapat digunakan.",
  },
  {
    id: "direct-vs-wholesale",
    category: "booking-payment",
    question: "Apa itu tarif RestHalf Exclusive vs Mitra?",
    answer:
      "Pemesanan RestHalf Exclusive (Langsung) dijual dan dikonfirmasi oleh RestHalf — konfirmasi instan dan aturan pembatalan RestHalf berlaku. Tarif Mitra (Grosir) berasal dari pemasok pihak ketiga; RestHalf mengalihkan Anda untuk menyelesaikan pembayaran dan syarat pemasok berlaku.",
    laneAnswers: {
      direct:
        "Dipesan di RestHalf dengan konfirmasi instan. Pembayaran dan dukungan ditangani melalui RestHalf. Pembatalan mengikuti kebijakan RestHalf Exclusive.",
      wholesale:
        "Berasal dari pemasok mitra. Anda mungkin menyelesaikan pembayaran di alur mitra. Aturan pembatalan dan refund pemasok berlaku — ditampilkan saat pemesanan dan pada konfirmasi Anda.",
    },
  },
  {
    id: "payment-methods",
    category: "booking-payment",
    question: "Metode pembayaran apa yang diterima?",
    answer:
      "Untuk pemesanan Langsung kami mendukung kartu, e-wallet (GoPay, OVO, DANA), dan virtual account tergantung pasar Anda. Pemesanan mitra dapat menawarkan metode berbeda di checkout pemasok. Semua jumlah ditampilkan dalam mata uang yang ditagih saat checkout.",
  },
  {
    id: "currency-display",
    category: "booking-payment",
    question: "Bisakah saya menelusuri dalam mata uang berbeda dari yang saya bayar?",
    answer:
      "Ya. RestHalf memungkinkan Anda mengganti mata uang tampilan saat menjelajah. Jumlah yang ditagih saat checkout selalu ditampilkan jelas sebelum Anda membayar — itu mata uang yang akan didebit dari kartu atau dompet Anda.",
  },
  {
    id: "how-to-cancel",
    category: "cancellations-refunds",
    question: "Bagaimana cara membatalkan pemesanan?",
    answer:
      "Buka Pemesanan Saya, pilih pemesanan, dan gunakan Batalkan pemesanan jika memenuhi syarat. Kebijakan berbeda menurut jalur.",
    laneAnswers: {
      direct:
        "Batalkan dari Pemesanan Saya hingga 2 jam sebelum slot dimulai untuk refund penuh. Di dalam 2 jam, tarif slot tidak dapat direfund.",
      wholesale:
        "Ajukan permintaan pembatalan melalui dukungan RestHalf. Refund mengikuti kebijakan pemasok mitra yang ditampilkan saat pemesanan — RestHalf tidak dapat mengubah syarat mitra setelah penyerahan.",
    },
  },
  {
    id: "refund-timing",
    category: "cancellations-refunds",
    question: "Berapa lama refund diproses?",
    answer:
      "Refund yang disetujui biasanya muncul di metode pembayaran asli Anda dalam 5–7 hari kerja. Pemesanan mitra dapat mengikuti jadwal pemasok. Lacak status refund di halaman detail pemesanan jika berlaku.",
  },
  {
    id: "no-show",
    category: "cancellations-refunds",
    question: "Apa yang terjadi jika saya tidak datang?",
    answer:
      "Tidak hadir pada slot istirahat RestHalf Exclusive tidak dapat direfund. Untuk menginap Mitra, kebijakan tidak hadir pemasok berlaku. Hubungi dukungan sesegera mungkin jika rencana Anda berubah.",
  },
  {
    id: "check-in-what-to-bring",
    category: "check-in",
    question: "Apa yang perlu saya bawa saat check-in?",
    answer:
      "Bawa identitas berfoto yang valid dan referensi pemesanan Anda (juga dikirim via WhatsApp). Untuk slot istirahat, datang dalam jendela yang dikonfirmasi dan ke resepsionis kecuali konfirmasi Anda menyatakan lain.",
  },
  {
    id: "airport-hotels",
    category: "check-in",
    question: "Apakah slot istirahat hanya di hotel bandara?",
    answer:
      "Banyak slot istirahat berada di properti dekat bandara utama, tetapi RestHalf juga menampilkan hotel kota. Gunakan pencarian lokasi dan filter untuk menemukan properti yang sesuai perjalanan Anda.",
  },
  {
    id: "whatsapp-confirmation",
    category: "account-notifications",
    question: "Apakah saya akan mendapat konfirmasi WhatsApp?",
    answer:
      "Ya — untuk pemesanan Langsung kami mengirim detail konfirmasi ke nomor WhatsApp yang Anda berikan saat checkout. Pesan ini mencerminkan konfirmasi web Anda: referensi, hotel, slot atau tanggal, dan panduan check-in.",
  },
  {
    id: "guest-checkout",
    category: "account-notifications",
    question: "Apakah saya perlu akun untuk memesan?",
    answer:
      "Tidak. Anda dapat menyelesaikan checkout sebagai tamu. Membuat akun memungkinkan Anda mengelola pemesanan, menyimpan data, dan memperbarui preferensi notifikasi di satu tempat.",
  },
  {
    id: "manage-bookings",
    category: "account-notifications",
    question: "Di mana saya melihat pemesanan saya?",
    answer:
      "Masuk dan buka Pemesanan Saya dari menu navigasi atau halaman akun. Anda akan melihat pemesanan mendatang, selesai, dan dibatalkan dengan filter menurut jalur.",
  },
];

export const FAQ_CATEGORIES = FAQ_CATEGORIES_EN;
export const FAQ_ITEMS = FAQ_ITEMS_EN;

export function getFaqCategories(language: AppLanguage): FaqCategory[] {
  return language === "id" ? FAQ_CATEGORIES_ID : FAQ_CATEGORIES_EN;
}

export function getFaqItems(language: AppLanguage): FaqItem[] {
  return language === "id" ? FAQ_ITEMS_ID : FAQ_ITEMS_EN;
}

export function getFaqItemsByCategory(
  categoryId: FaqCategory["id"],
  language: AppLanguage = "en",
): FaqItem[] {
  return getFaqItems(language).filter((item) => item.category === categoryId);
}
