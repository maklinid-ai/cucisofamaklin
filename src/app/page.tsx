'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, type Variants } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { WhatsAppButton } from '@/components/landing/whatsapp-button'
import {
  BOOKING_TIME_OPTIONS,
  formatBookingSchedule,
  getBookingScheduleError,
} from '@/lib/booking'

import {
  Wind,
  AlertTriangle,
  Bug,
  UtensilsCrossed,
  Droplets,
  Frown,
  Sparkles,
  Eraser,
  Flower2,
  ShieldCheck,
  Clock,
  Award,
  Search,
  ArrowUpFromLine,
  CheckCircle,
  Star,
  User,
  Link2,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Menu,
  Loader2,
  ChevronRight,
  Quote,
  Home as HomeIcon,
  Zap,
  Truck,
  Shield,
  Send,
  Info,
  Calendar as CalendarIcon,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────
const WA_NUMBER = '6285793676315'
const WA_MESSAGE = 'Halo MAKLIN, saya ingin konsultasi tentang jasa cuci sofa.'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`
const CURRENT_YEAR = new Date().getFullYear()

const NAV_LINKS = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Layanan', href: '#harga' },
  { label: 'Cara Kerja', href: '#proses' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Booking', href: '#booking' },
]

const TRUST_BULLETS = [
  {
    icon: ShieldCheck,
    title: 'Chemical Aman',
    subtitle: 'Bahan pembersih yang aman untuk keluarga dan hewan peliharaan.',
  },
  {
    icon: Award,
    title: 'Garansi Pengerjaan',
    subtitle: 'Memberikan jaminan kualitas hingga 3 hari setelah layanan.',
  },
  {
    icon: HomeIcon,
    title: 'Teknisi Berpengalaman',
    subtitle: 'Tim profesional yang terlatih untuk semua jenis sofa & kasur.',
  },
  {
    icon: Zap,
    title: 'Respon Cepat',
    subtitle: 'Konfirmasi booking cepat melalui WhatsApp.',
  },
  {
    icon: CalendarIcon,
    title: 'Booking Mudah',
    subtitle: 'Form mudah diisi dan proses langsung dipantau admin.',
  },
]

const HERO_STATS = [
  {
    icon: Star,
    value: '500+',
    label: 'Pelanggan Puas',
  },
  {
    icon: Award,
    value: '5',
    label: 'Jenis Layanan',
  },
  {
    icon: HomeIcon,
    value: '100%',
    label: 'Home Service',
  },
  {
    icon: Star,
    value: '4.9★',
    label: 'Rating Pelanggan',
  },
]

const SERVICE_AREAS = [
  'Purwakarta Kota',
  'Bungursari',
  'Campaka',
  'Jatiluhur',
  'Plered',
  'Pasawahan',
  'Babakancikao',
  'Wanayasa',
  'Darangdan',
  'Cibatu',
  'Sukatani',
  'Bojong',
]

const PROBLEMS = [
  {
    icon: Wind,
    title: 'Banyak Debu',
    desc: 'Debu menumpuk di sela-sela sofa, menyebabkan ruangan terasa tidak nyaman dan kurang bersih.',
  },
  {
    icon: AlertTriangle,
    title: 'Bau Tidak Sedap',
    desc: 'Aroma apek dan tidak sedap yang mengganggu dari sofa yang jarang dibersihkan.',
  },
  {
    icon: Bug,
    title: 'Tungau & Bakteri',
    desc: 'Sofa kotor menjadi sarang tungau dan bakteri yang tidak terlihat oleh mata telanjang.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Bekas Makanan',
    desc: 'Noda makanan yang sudah lama menempel dan sulit dihilangkan dengan cara biasa.',
  },
  {
    icon: Droplets,
    title: 'Noda Minuman',
    desc: 'Tumpahan kopi, teh, atau minuman lain yang meninggalkan noda membandel.',
  },
  {
    icon: Frown,
    title: 'Alergi & Kusam',
    desc: 'Sofa kusam dan kotor memicu alergi, gatal-gatal, dan masalah pernapasan keluarga.',
  },
]

const WHY_US = [
  {
    icon: ShieldCheck,
    title: 'Teknisi Profesional',
    desc: 'Tim terbaik dengan pengalaman membersihkan semua jenis sofa, kasur, karpet, dan jok mobil.',
    tag: 'Profesional',
  },
  {
    icon: Search,
    title: 'Mesin Professional Extraction',
    desc: 'Mesin kami bekerja hingga lapisan terdalam untuk hasil bersih dan cepat kering.',
    tag: 'Extraction',
  },
  {
    icon: ShieldCheck,
    title: 'Chemical Aman',
    desc: 'Formula ramah keluarga dan hewan peliharaan, tanpa bahan berbahaya.',
    tag: 'Aman',
  },
  {
    icon: Award,
    title: 'Garansi Pengerjaan',
    desc: 'Garansi H+3 untuk memastikan hasil pembersihan maksimal.',
    tag: 'Garansi',
  },
  {
    icon: Truck,
    title: 'Datang ke Lokasi',
    desc: 'Layanan home service langsung ke rumah Anda di Purwakarta dan sekitarnya.',
    tag: 'Mobile',
  },
  {
    icon: Award,
    title: 'Harga Transparan',
    desc: 'Biaya jelas tanpa kejutan, hanya bayar sesuai layanan yang dipilih.',
    tag: 'Transparan',
  },
  {
    icon: Shield,
    title: 'Tanpa Biaya Tersembunyi',
    desc: 'Tidak ada biaya tambahan mendadak. Semua layanan terlihat sejak awal.',
    tag: 'Jelas',
  },
  {
    icon: Zap,
    title: 'Response Admin Cepat',
    desc: 'Admin siap merespon booking dan konsultasi dalam waktu singkat.',
    tag: 'Cepat',
  },
]

const BEFORE_AFTER = [
  {
    label: 'Sofa Fabric Putih',
    before: '/images/before-1.png',
    after: '/images/after-1.png',
  },
  {
    label: 'Sofa Velvet Hijau',
    before: '/images/before-2.png',
    after: '/images/after-2.png',
  },
  {
    label: 'Sofa Fabric Abu-abu',
    before: '/images/before-3.png',
    after: '/images/after-3.png',
  },
]

const PROCESS_STEPS = [
  {
    num: 1,
    icon: Search,
    title: 'Inspeksi Sofa',
    desc: 'Kami memeriksa jenis bahan, tingkat kekotoran, dan noda untuk menentukan metode pembersihan yang paling tepat.',
  },
  {
    num: 2,
    icon: Wind,
    title: 'Vacuum & Pre-Treatment',
    desc: 'Debu, pasir, dan kotoran diangkat terlebih dahulu, kemudian noda membandel diberi cairan khusus.',
  },
  {
    num: 3,
    icon: Droplets,
    title: 'Deep Cleaning',
    desc: 'Pembersihan menyeluruh menggunakan mesin profesional dan chemical yang aman untuk semua jenis sofa.',
  },
  {
    num: 4,
    icon: ArrowUpFromLine,
    title: 'Extraction',
    desc: 'Mengangkat kotoran, tungau, bakteri, serta sisa cairan pembersih sehingga sofa lebih bersih dan cepat kering.',
  },
  {
    num: 5,
    icon: CheckCircle,
    title: 'Finishing',
    desc: 'Pengecekan akhir, perapian, dan pemberian pengharum sehingga sofa bersih, segar, dan siap digunakan.',
  },
]

const PRICING = [
  {
    name: 'Cuci Sofa',
    desc: 'Jasa cuci sofa Purwakarta untuk sofa fabric, kulit, dan velvet yang kembali bersih, wangi, dan nyaman.',
    popular: true,
    badge: 'Best Seller',
    duration: '1-2 Jam',
    dryTime: '2-4 Jam',
    benefits: ['Sofa lebih bersih & higienis', 'Bebas debu, tungau & bau', 'Aman untuk berbagai bahan sofa'],
    includes: ['Vacuum debu', 'Pre-Treatment noda', 'Deep Cleaning', 'Extraction', 'Parfum khusus'],
  },
  {
    name: 'Cuci Kasur',
    desc: 'Jasa cuci kasur Purwakarta untuk kasur lebih higienis, segar, dan nyaman untuk kualitas tidur yang lebih baik.',
    popular: false,
    duration: '1-2 Jam',
    dryTime: '2-5 Jam',
    benefits: ['Kasur lebih higienis', 'Mengurangi tungau & bakteri', 'Tidur lebih nyaman'],
    includes: ['Vacuum', 'Wet Cleaning', 'Penghilangan noda', 'Extraction', 'Parfum khusus'],
  },
  {
    name: 'Cuci Karpet',
    desc: 'Jasa cuci karpet Purwakarta untuk karpet bersih, harum, dan bebas debu di rumah yang lebih sehat.',
    popular: false,
    duration: '1-2 Jam',
    dryTime: '3-6 Jam',
    benefits: ['Karpet lebih bersih', 'Bebas debu & bau', 'Warna tampak lebih segar'],
    includes: ['Vacuum', 'Deep Cleaning', 'Penghilangan noda', 'Extraction', 'Parfum khusus'],
  },
  {
    name: 'Cuci Kursi',
    desc: 'Jasa cuci kursi Purwakarta untuk kursi rumah maupun kantor yang kembali bersih, higienis, dan nyaman.',
    popular: false,
    duration: '45-90 Menit',
    dryTime: '2-4 Jam',
    benefits: ['Bersih & harum', 'Mengurangi debu & noda', 'Cocok untuk rumah maupun kantor'],
    includes: ['Vacuum', 'Deep Cleaning', 'Penghilangan noda', 'Extraction', 'Parfum khusus'],
  },
  {
    name: 'Cuci Jok Mobil',
    desc: 'Jasa cuci jok mobil Purwakarta untuk interior mobil lebih bersih, segar, dan nyaman untuk setiap perjalanan.',
    popular: false,
    duration: '1-1.5 Jam',
    dryTime: '2-3 Jam',
    benefits: ['Jok lebih higienis', 'Mengurangi debu & bau', 'Kabina lebih segar'],
    includes: ['Vacuum Interior', 'Deep Cleaning', 'Penghilangan noda', 'Extraction', 'Parfum khusus'],
  },
]

const TESTIMONIALS = [
  {
    name: 'Ibu Sari',
    loc: 'Purwakarta Kota',
    text: 'Sofa saya yang sudah lama kotor sekali, setelah dibersihkan MAKLIN jadi kayak baru lagi! Teknisinya juga ramah dan profesional.',
    source: 'Google Review',
  },
  {
    name: 'Pak Ahmad',
    loc: 'Bungursari',
    text: 'Pengerjaannya cepat, hasilnya memuaskan. Bau apek di sofa langsung hilang. Recommended banget!',
    source: 'WhatsApp',
  },
  {
    name: 'Ibu Rina',
    loc: 'Campaka',
    text: 'Sudah 3x pakai jasa MAKLIN. Selalu puas dengan hasilnya. Harganya juga terjangkau.',
    source: 'Google Review',
  },
  {
    name: 'Pak Budi',
    loc: 'Jatiluhur',
    text: 'Awalnya ragu karena sofa saya kulit, tapi hasilnya luar biasa. Chemical-nya aman dan tidak bikin kulit sofa rusak.',
    source: 'WhatsApp',
  },
  {
    name: 'Ibu Dewi',
    loc: 'Plered',
    text: 'Home service-nya sangat memudahkan. Tinggal hubungi lewat WhatsApp, teknisi langsung datang. Praktis!',
    source: 'Google Review',
  },
  {
    name: 'Ibu Fitri',
    loc: 'Pasawahan',
    text: 'Anak saya punya alergi debu, setelah cuci sofa di MAKLIN alerginya berkurang drastis. Terima kasih MAKLIN!',
    source: 'WhatsApp',
  },
]

const FAQS = [
  {
    q: 'Apakah sofa dibawa ke workshop MAKLIN?',
    a: 'Tidak, kami menggunakan sistem home service. Tim kami akan datang langsung ke lokasi Anda untuk melakukan pembersihan sofa. Jadi Anda tidak perlu repot membawa sofa ke mana-mana.',
  },
  {
    q: 'Apakah chemical yang digunakan aman?',
    a: 'Ya, semua chemical yang kami gunakan aman untuk anak-anak dan hewan peliharaan. Kami menggunakan produk berkualitas premium yang telah teruji dan ramah lingkungan.',
  },
  {
    q: 'Berapa lama proses pengerjaan cuci sofa?',
    a: 'Proses pengerjaan cuci sofa biasanya memakan waktu 1-2 jam tergantung pada ukuran sofa, jenis bahan, dan tingkat kekotoran.',
  },
  {
    q: 'Apakah bisa menghilangkan noda yang membandel?',
    a: 'Ya, dengan peralatan profesional dan chemical khusus, kami bisa menghilangkan berbagai jenis noda membandel termasuk noda minuman, makanan, dan noda organik lainnya.',
  },
  {
    q: 'Berapa lama sofa kering setelah dicuci?',
    a: 'Dengan teknologi extraction profesional, sofa Anda akan kering lebih cepat dibandingkan metode biasa. Biasanya sofa sudah cukup kering dalam 2-4 jam.',
  },
  {
    q: 'MAKLIN melayani area mana saja?',
    a: 'Kami melayani seluruh wilayah Purwakarta dan sekitarnya termasuk Purwakarta Kota, Bungursari, Campaka, Jatiluhur, Plered, Pasawahan, dan lainnya.',
  },
  {
    q: 'Bagaimana cara memesan jasa cuci sofa MAKLIN?',
    a: 'Anda bisa memesan melalui WhatsApp di nomor 0857-9367-6315 atau mengisi formulir booking di website ini. Tim kami akan segera menghubungi Anda untuk konfirmasi.',
  },
  {
    q: 'Apakah ada garansi hasil pengerjaan?',
    a: 'Ya, kami memberikan garansi H+3 (3 hari setelah pengerjaan). Jika ada bagian yang belum maksimal, kami akan melakukan touch-up tanpa biaya tambahan.',
  },
]

const BOOKING_INFO = [
  { icon: HomeIcon, text: 'Home Service Purwakarta' },
  { icon: Zap, text: 'Respon Cepat' },
  { icon: Clock, text: 'Estimasi 1-2 Jam' },
  { icon: Shield, text: 'Garansi H+3' },
  { icon: Award, text: 'Teknisi Berpengalaman' },
  { icon: Truck, text: 'Gratis Transport Maks. 5 KM' },
]

// ─── Form Schema ─────────────────────────────────────────────────────
const BOOKING_SERVICES = [
  'Cuci Sofa',
  'Cuci Kasur',
  'Cuci Karpet',
  'Cuci Kursi',
  'Cuci Jok Mobil',
  'Cuci Spring Bed',
]

const TERMS_SECTIONS = [
  {
    title: 'A. Langkah Pencucian',
    items: [
      'Vakum kering untuk menghilangkan debu dan kotoran.',
      'Cuci basah: dimulai dengan vakum, kemudian diberi cairan pembersih khusus, disikat, dibilas, lalu divakum kembali untuk pengeringan, dan diakhiri dengan pemberian parfum khusus.',
      'Pengeringan atau tingkat kekeringan sekitar 60% - 70%. Jika dijemur pada malam hari, sofa/bed dapat digunakan keesokan harinya. Jika di dalam ruangan, dapat menggunakan kipas atau AC, dan sofa/bed bisa digunakan minimal esok hari.',
      'Pengerjaan oleh teknisi kami dilakukan semaksimal mungkin sehingga terjamin kebersihan dan kehigienisannya serta noda bisa hilang. Tetapi ada beberapa noda yang mungkin tidak bisa hilang 100% sempurna, tergantung pada jenis dan kondisi noda serta sudah berapa lama noda tersebut.',
    ],
  },
  {
    title: 'B. Ketentuan Pengerjaan',
    items: [
      'Sofa/bed dicuci semua sisi: depan, belakang, atas, bawah, dan bagian samping.',
      'Cuci dan vacuum (Wet Clean) untuk menghilangkan noda, tungau, dan kutu kasur.',
      'Ada beberapa jenis dan kondisi noda yang perlu tambahan chemical khusus, maka akan dikenakan tambahan biaya Rp50.000/liter.',
      'Jenis kasur/bed putih atau berbahan latex ada tambahan biaya Rp50.000/bed.',
      'Gratis transportasi dengan jarak maksimal 5 KM dari kantor kami: Jl. Jend. Ahmad Yani No.113, Cipaisan, Kec. Purwakarta, Kabupaten Purwakarta, Jawa Barat.',
      'Pengerjaan kami adalah cleaning, jadi teknisi kami tidak wajib menunggu sampai kering.',
      'Minimal daya listrik 900 watt.',
      'Sebelum pengerjaan pencucian mohon dipastikan barang berharga disimpan terlebih dahulu. Jika ada kehilangan, hal tersebut di luar tanggung jawab kami.',
    ],
  },
  {
    title: 'C. Garansi Pengerjaan dan Pembatalan Order',
    items: [
      'Garansi jasa jika timbul bau/jamur setelah pencucian maksimal H+3 setelah pengerjaan dengan disertai bukti foto/video.',
      'Pembatalan/cancel dan reschedule wajib H-1.',
      'Pembatalan saat tanggal jadwal pengerjaan atau hari H dikenakan pembayaran order penuh atau minimal Rp250.000.',
    ],
  },
]

const bookingSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  whatsapp: z.string().min(10, 'Nomor WhatsApp tidak valid'),
  schedule: z.string().superRefine((value, ctx) => {
    const message = getBookingScheduleError(value)
    if (message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      })
    }
  }),
  address: z.string().min(5, 'Alamat terlalu singkat'),
  googleMapsLink: z.string().optional(),
  service: z.array(z.string()).min(1, 'Pilih minimal 1 layanan'),
  notes: z.string().optional(),
  agreedToTerms: z.literal(true, {
    message: 'Anda harus menyetujui syarat dan ketentuan',
  }),
})

type BookingFormValues = z.infer<typeof bookingSchema>

// ─── Animation Variants ──────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

// ─── Reusable Animated Section Wrapper ───────────────────────────────
function AnimatedSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Counter Component ───────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showDesktopStickyBooking, setShowDesktopStickyBooking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [scheduleTime, setScheduleTime] = useState('')
  const [schedulePopoverOpen, setSchedulePopoverOpen] = useState(false)

  // ── Scroll listener for navbar and progress ──
  useEffect(() => {
    const sectionIds = ['hero', 'harga', 'proses', 'portfolio', 'testimoni', 'faq', 'booking']

    const onScroll = () => {
        const y = window.scrollY
        setScrolled(y > 20)
        setShowDesktopStickyBooking(y > 520)

        const progress = Math.min(
          100,
          Math.max(0, (y / (document.body.scrollHeight - window.innerHeight)) * 100)
        )
        setScrollProgress(progress)

        const currentSection = sectionIds.reduce((active, id) => {
          const section = document.getElementById(id)
          if (!section) return active
          const top = section.getBoundingClientRect().top
          return top <= 120 ? id : active
        }, 'hero')
        setActiveSection(currentSection)
      }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Smooth scroll handler ──
  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleTermsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 8

    if (isAtBottom) {
      setHasReadTerms(true)
    }
  }

  // ── Form ──
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      schedule: '',
      address: '',
      googleMapsLink: '',
      service: [],
      notes: '',
      agreedToTerms: undefined as unknown as true,
    },
  })

  useEffect(() => {
    if (scheduleDate && scheduleTime) {
      setValue('schedule', formatBookingSchedule(scheduleDate, scheduleTime), {
        shouldValidate: true,
      })
    } else {
      setValue('schedule', '', { shouldValidate: true })
    }
  }, [scheduleDate, scheduleTime, setValue])

  const scheduleValue = watch('schedule')

  const handleScheduleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setScheduleDate(undefined)
      setScheduleTime('')
      setSchedulePopoverOpen(false)
      return
    }

    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)
    setScheduleDate(normalizedDate)
    if (!scheduleTime) {
      setScheduleTime(BOOKING_TIME_OPTIONS[0])
    }
    setSchedulePopoverOpen(false)
  }

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          name: data.name.trim(),
          whatsapp: data.whatsapp.trim(),
          address: data.address.trim(),
          googleMapsLink: data.googleMapsLink?.trim() ?? '',
          notes: data.notes?.trim() ?? '',
        }),
      })
      const json = await res.json()
      if (json.success && json.whatsappUrl) {
        setBookingSubmitted(true)
        toast.success('Booking anda sudah dikirim ke Admin, selanjutnya akan diatur untuk penjadwalannya.')

        const whatsappWindow = window.open(json.whatsappUrl, '_blank', 'noopener,noreferrer')
        if (!whatsappWindow) {
          window.location.assign(json.whatsappUrl)
        }

        setScheduleDate(undefined)
        setScheduleTime('')
        setSchedulePopoverOpen(false)
        setHasReadTerms(false)
        setValue('agreedToTerms', false as unknown as true, { shouldValidate: false })
        reset({
          name: '',
          whatsapp: '',
          schedule: '',
          address: '',
          googleMapsLink: '',
          service: [],
          notes: '',
          agreedToTerms: false as unknown as true,
        })
      } else {
        setBookingSubmitted(false)
        toast.error(json.error || 'Gagal menyimpan booking. Silakan coba kembali.')
        if (json.details) {
          console.error('Validation details:', json.details)
        }
      }
    } catch {
      setBookingSubmitted(false)
      toast.error('Gagal menyimpan booking. Silakan coba kembali.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ────────────────────────────────────────────────────────────
          1. NAVIGATION
      ──────────────────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-primary/20">
        <div
          className="h-full bg-primary transition-[width] duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-background shadow-sm border-b border-border/60 backdrop-blur-xl'
            : 'bg-background/95 border-b border-border/10 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="MAKLIN Home Cleaning">
            <Image
              src="/logo-maklin-2_New.png"
              alt="MAKLIN Home Cleaning"
              width={160}
              height={48}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === l.href.slice(1)
                    ? 'text-brand'
                    : 'text-muted-foreground hover:text-brand'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" className="rounded-full font-semibold">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                Booking Sekarang
              </a>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Buka menu navigasi">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Image
                      src="/logo-maklin-2_New.png"
                      alt="MAKLIN Home Cleaning"
                      width={160}
                      height={48}
                      className="h-12 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-4">
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.href}
                      onClick={() => scrollTo(l.href)}
                      className="text-left px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      {l.label}
                    </button>
                  ))}
                  <Separator className="my-2" />
                  <Button asChild className="mt-2 w-full font-semibold">
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                      Booking Sekarang
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* ────────────────────────────────────────────────────────────
          MAIN CONTENT
      ──────────────────────────────────────────────────────────── */}
      <main className="flex-1">

        {/* ──────────────────────────────────────────────────────────
            2. HERO SECTION
        ────────────────────────────────────────────────────────── */}
        <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-brand/20 via-brand/10 to-background py-24 md:py-28 text-foreground" aria-label="Hero">
          <div className="absolute inset-x-0 top-0 h-40 bg-brand/15" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(30rem,38%)]">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <span className="text-sm font-medium uppercase tracking-[0.28em] text-brand/95">
                    Home Cleaning Premium
                  </span>
                  <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-foreground">
                    Bersihkan Sofa, Kasur, Karpet, dan Jok Mobil Anda
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="mt-6 max-w-xl"
                >
                  <p className="text-lg font-semibold text-foreground">
                    Cuci Sofa, Kasur, Karpet,
                    <br /> Kursi &amp; Jok Mobil Profesional
                  </p>

                  <p className="mt-4 text-sm text-foreground/75">
                    Melayani Purwakarta dan sekitarnya dengan layanan cuci sofa dan home cleaning premium.
                  </p>

                  <p className="mt-3 text-sm font-medium text-brand">
                    Teknisi berpengalaman · chemical aman · bergaransi sampai H+3
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-8 flex flex-col sm:flex-row items-stretch gap-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-brand text-brand-foreground px-12 py-4 text-base font-extrabold shadow-xl shadow-brand/20"
                  >
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                      Booking Sekarang
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-full border-brand text-brand px-10 py-4 text-base font-semibold"
                  >
                    <button onClick={() => scrollTo('#harga')}>Lihat Layanan</button>
                  </Button>
                </motion.div>

                <div className="mt-8">
                  <ul className="space-y-2 text-sm text-brand/90 font-medium">
                    <li>✓ 1000+ Sofa Dibersihkan</li>
                    <li>✓ Rating 4.9</li>
                    <li>✓ Bergaransi</li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-10 hidden h-40 w-40 rounded-full bg-primary/10 blur-3xl lg:block" />
                <div className="overflow-hidden rounded-[20px] bg-brand/5 border border-brand/20 shadow-lg relative">
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3]">
                    <Image
                      src="/images/maklin-sofa.jpeg"
                      alt="Teknisi MAKLIN sedang bekerja"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                    />
                  </div>

                  {/* Floating stats card */}
                  <div className="absolute left-6 bottom-6 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-border/60">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">1000+ Sofa Dibersihkan</p>
                        <p className="text-xs text-muted-foreground">Pengalaman teruji</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">4.9</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                    <div className="border-t border-border/60 pt-3">
                      <div className="text-sm text-foreground font-medium">Bergaransi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand/10 py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-border/70 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 text-primary mb-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <stat.icon className="size-5" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.24em] font-semibold text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-3xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background/80 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[24px] border border-border/60 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="flex min-h-[7rem] items-center gap-4 overflow-x-auto px-4 py-6 sm:px-6 sm:py-8">
                {TRUST_BULLETS.map((item) => (
                  <div
                    key={item.title}
                    className="min-w-[16rem] rounded-3xl bg-background/90 p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-5">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. LAYANAN SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="harga" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Layanan Kami
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                Harga terjangkau dengan hasil maksimal. Konsultasi gratis!
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {PRICING.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="h-full"
                >
                  <Card
                    className={`h-full p-6 text-center relative ${
                      item.popular ? 'border-2 border-primary shadow-sm' : 'border-border/60 shadow-sm'
                    } rounded-[20px] transition-shadow duration-300`}
                  >
                    <div className="relative mb-5 h-44 overflow-hidden rounded-[20px] bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.18),transparent_45%)]" />
                      <div className="relative flex h-full items-end justify-end p-5">
                        <Sparkles className="size-14 text-primary/70" />
                      </div>
                    </div>
                    {item.badge && (
                      <Badge className="absolute right-3 top-3 bg-primary/10 text-primary border-0 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Award className="size-3" />
                        {item.badge}
                      </Badge>
                    )}
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-3 mt-1">
                      <Sparkles className="size-6" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="mb-4 grid grid-cols-2 gap-3 text-left text-[11px] uppercase tracking-[0.24em]">
                      <div className="rounded-2xl bg-primary/10 p-3">
                        <p className="text-[10px] text-muted-foreground">Durasi</p>
                        <p className="mt-1 font-semibold text-foreground">{item.duration}</p>
                      </div>
                      <div className="rounded-2xl bg-primary/10 p-3">
                        <p className="text-[10px] text-muted-foreground">Waktu Kering</p>
                        <p className="mt-1 font-semibold text-foreground">{item.dryTime}</p>
                      </div>
                    </div>

                    <div className="text-left space-y-3 mb-5">
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1.5">
                          Yang Anda Dapatkan
                        </p>
                        <ul className="space-y-1">
                          {item.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                              <span className="mt-0.5 text-primary">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1.5">
                          Termasuk
                        </p>
                        <ul className="space-y-1">
                          {item.includes.map((include) => (
                            <li key={include} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                              <CheckCircle className="mt-0.5 size-3.5 shrink-0 text-primary" />
                              <span>{include}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button
                        asChild
                        variant="default"
                        className="w-full text-sm font-semibold transition duration-300 hover:shadow-lg"
                        size="sm"
                      >
                        <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                          Booking
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full text-sm font-semibold transition duration-300 hover:shadow-lg"
                        size="sm"
                      >
                        <a href="#booking">Detail</a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            4. BOOKING SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="booking" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-6 md:p-8 border-border bg-white shadow-sm rounded-[28px]">
              <div className="mb-8 space-y-6">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-[0.32em]">
                    Booking Home Cleaning
                  </p>
                  <h3 className="mt-4 text-3xl font-extrabold text-foreground">
                    Isi Formulir dan Tim Kami Akan Segera Menghubungi
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Semua input form dirancang untuk memudahkan proses booking Anda tanpa repot.
                  </p>
                </div>

                <div className="rounded-[24px] border border-border/70 bg-primary/5 p-5">
                  <p className="text-sm font-semibold text-primary uppercase tracking-[0.24em]">
                    Progress Booking
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      { icon: User, label: 'Isi Data', desc: 'Masukkan informasi & layanan yang Anda butuhkan' },
                      { icon: MessageCircle, label: 'Admin Konfirmasi', desc: 'Admin MAKLIN akan menghubungi Anda melalui WhatsApp' },
                      { icon: Truck, label: 'Teknisi Datang', desc: 'Tim kami tiba di lokasi sesuai jadwal' },
                      { icon: CheckCircle, label: 'Selesai', desc: 'Sofa Anda kembali bersih dan nyaman' },
                    ].map((step) => (
                      <div key={step.label} className="flex items-start gap-3 rounded-3xl bg-white p-4 shadow-sm">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <step.icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{step.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border/60 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">Yang Anda Dapatkan</p>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {[
                      'Survey Gratis',
                      'Booking Mudah',
                      'Konfirmasi Admin',
                      'Teknisi Datang Sesuai Jadwal',
                      'Pembayaran Aman',
                      'Garansi Pengerjaan',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="mt-1 size-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="size-4 text-primary" />
                    <Label htmlFor="name">Nama Pelanggan</Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap Anda"
                    {...register('name')}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Phone className="size-4 text-primary" />
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    {...register('whatsapp')}
                    aria-invalid={!!errors.whatsapp}
                  />
                  {errors.whatsapp && (
                    <p className="text-destructive text-xs">{errors.whatsapp.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CalendarIcon className="size-4 text-primary" />
                    <Label htmlFor="schedule">Jadwal Booking</Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Controller
                    name="schedule"
                    control={control}
                    render={() => (
                      <Popover open={schedulePopoverOpen} onOpenChange={setSchedulePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="schedule"
                            type="button"
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                          >
                            <span className={scheduleValue ? 'text-foreground' : 'text-muted-foreground'}>
                              {scheduleValue || 'Pilih tanggal & waktu'}
                            </span>
                            <CalendarIcon className="ml-2 size-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3">
                            <Calendar
                              mode="single"
                              selected={scheduleDate}
                              onSelect={handleScheduleDateSelect}
                              disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return date < today
                              }}
                              initialFocus
                            />
                            <div className="mt-3">
                              <Label className="mb-2 block text-xs font-semibold">Waktu</Label>
                              <Select
                                value={scheduleTime}
                                onValueChange={(value) => setScheduleTime(value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pilih waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                  {BOOKING_TIME_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.schedule && (
                    <p className="text-destructive text-xs">{errors.schedule.message}</p>
                  )}
                  <div className="flex items-start gap-2 rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-[11px] sm:text-xs text-primary">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>
                      Jam pengerjaan akan disesuaikan dengan ketersediaan slot jadwal yang telah diterima Admin MAKLIN. Tim kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi jadwal.
                    </span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPin className="size-4 text-primary" />
                    <Label htmlFor="address">Alamat / Lokasi</Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap Anda di Purwakarta"
                    rows={3}
                    {...register('address')}
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && (
                    <p className="text-destructive text-xs">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Link2 className="size-4 text-primary" />
                    <Label htmlFor="googleMapsLink">Link Google Maps</Label>
                    <span className="text-muted-foreground font-normal">(opsional)</span>
                  </div>
                  <Input
                    id="googleMapsLink"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    {...register('googleMapsLink')}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <HomeIcon className="size-4 text-primary" />
                    <Label htmlFor="service">Pilih Layanan</Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field }) => (
                      <div
                        id="service"
                        className="flex flex-wrap gap-2 rounded-md border border-input bg-transparent p-3"
                        aria-invalid={!!errors.service}
                      >
                        {BOOKING_SERVICES.map((service) => {
                          const selectedServices = field.value ?? []
                          const isSelected = selectedServices.includes(service)

                          return (
                            <button
                              key={service}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => {
                                field.onChange(
                                  isSelected
                                    ? selectedServices.filter((item) => item !== service)
                                    : [...selectedServices, service]
                                )
                              }}
                              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                  : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                              }`}
                            >
                              {isSelected && <CheckCircle className="size-4 shrink-0" />}
                              <span>{service}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  />
                  {errors.service && (
                    <p className="text-destructive text-xs">{errors.service.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Info className="size-4 text-primary" />
                    <Label htmlFor="notes">Catatan</Label>
                    <span className="text-muted-foreground font-normal">(opsional)</span>
                  </div>
                  <Textarea
                    id="notes"
                    placeholder="Catatan tambahan, misalnya jenis sofa, ukuran, dll."
                    rows={3}
                    {...register('notes')}
                  />
                </div>

                <div className="grid gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Syarat dan Ketentuan Layanan
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Wajib dibaca sebelum menyetujui dan mengirim booking.
                    </p>
                  </div>
                  <div
                    className="h-72 overflow-y-auto rounded-md border border-border/70 bg-muted/30"
                    onScroll={handleTermsScroll}
                    tabIndex={0}
                  >
                    <div className="space-y-5 p-4 text-xs sm:text-sm leading-relaxed text-foreground">
                      {TERMS_SECTIONS.map((section) => (
                        <section key={section.title} className="space-y-2">
                          <h4 className="font-bold">{section.title}</h4>
                          <ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground">
                            {section.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ol>
                        </section>
                      ))}

                      <section className="space-y-2">
                        <h4 className="font-bold">D. Pembayaran</h4>
                        <div className="space-y-3 text-muted-foreground">
                          <p>Pembayaran dengan transfer ke:</p>
                          <div className="rounded-md border border-border/70 bg-background p-3">
                            <p className="font-semibold text-foreground">Bank Mandiri</p>
                            <p>A.n. ELA SARIFATULAELA</p>
                            <p>No. Rekening: 1730004377678</p>
                          </div>
                          <p>atau</p>
                          <div className="rounded-md border border-border/70 bg-background p-3">
                            <p className="font-semibold text-foreground">Bank BCA</p>
                            <p>A.n. MAKIN BERSIH KLIN PT</p>
                            <p>No. Rekening: 231-3014231</p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                  {!hasReadTerms && (
                    <p className="text-xs text-muted-foreground">
                      Scroll sampai bagian bawah Terms untuk mengaktifkan checkbox persetujuan.
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Controller
                    name="agreedToTerms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        disabled={!hasReadTerms}
                        onCheckedChange={(val) => field.onChange(hasReadTerms && val === true)}
                        aria-invalid={!!errors.agreedToTerms}
                      />
                    )}
                  />
                  <Label
                    htmlFor="terms"
                    className={`text-xs sm:text-sm leading-relaxed ${
                      hasReadTerms ? 'cursor-pointer' : 'cursor-not-allowed text-muted-foreground'
                    }`}
                  >
                    Saya telah membaca, memahami, dan menyetujui{' '}
                    <span className="font-semibold">Syarat &amp; Ketentuan Layanan MAKLIN</span>.
                  </Label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-destructive text-xs">{errors.agreedToTerms.message}</p>
                )}

                {bookingSubmitted && (
                  <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-3 text-sm text-primary">
                    Booking anda sudah dikirim ke Admin, selanjutnya akan diatur untuk penjadwalannya.
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full font-bold text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menyimpan Booking...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Booking Sekarang
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </AnimatedSection>

        {/* 5. WHY CHOOSE US */}
        <AnimatedSection className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Kenapa Memilih MAKLIN?
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Kami berkomitmen memberikan layanan terbaik untuk sofa Anda
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {WHY_US.map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 14px 40px rgba(0,0,0,0.08)' }}
                    className="h-full"
                  >
                    <Card className="h-full p-6 sm:p-8 border-border/60 shadow-sm hover:-translate-y-1 transition-transform">
                      <div className="flex items-center justify-center size-12 sm:size-14 rounded-full bg-primary/10 text-primary mb-3 mx-auto">
                        <item.icon className="size-6 sm:size-7" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="mb-2 text-[10px] sm:text-xs bg-primary/10 text-primary font-semibold"
                      >
                        {item.tag}
                      </Badge>
                      <h3 className="font-bold text-sm sm:text-base mb-1.5 text-center">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            6. PROCESS SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="proses" className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Proses Pengerjaan Kami
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                5 Langkah Profesional Menuju Sofa Bersih &amp; Higienis
              </p>
            </div>

            <div className="relative max-w-7xl mx-auto">
              {/* Horizontal line on desktop */}
              <div className="hidden md:block absolute inset-x-0 top-1/2 h-px bg-border" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {PROCESS_STEPS.map((step, idx) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex md:flex-1 flex-col items-start md:items-center gap-4 md:gap-2"
                  >
                    <div className="flex items-center md:flex-col gap-3 md:gap-2">
                      <div className="size-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">
                        {step.num}
                      </div>
                    </div>

                    <Card className="p-4 sm:p-6 border-border/60 shadow-sm md:mt-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary shrink-0">
                          <step.icon className="size-5" />
                        </div>
                        <h3 className="font-bold text-sm sm:text-base">{step.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            7. BEFORE / AFTER GALLERY
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="portfolio" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Bukti Hasil Kerja Kami
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Lihat sendiri perbedaan sofa sebelum dan sesudah dibersihkan
              </p>
            </div>

            <div className="grid gap-6 md:gap-8">
              {BEFORE_AFTER.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden border-border/60 shadow-sm hover:-translate-y-1 transition-transform">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg font-bold">
                        {item.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before */}
                      <div className="relative">
                        <span className="absolute top-3 left-3 z-10 rounded-md bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-1">
                          SEBELUM
                        </span>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <Image
                            src={item.before}
                            alt={`Sofa ${item.label} sebelum dibersihkan`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      {/* After */}
                      <div className="relative">
                        <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md">
                          SESUDAH
                        </span>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <Image
                            src={item.after}
                            alt={`Sofa ${item.label} sesudah dibersihkan`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            8. TESTIMONI
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="testimoni" className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Apa Kata Pelanggan Kami
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Lebih dari ratusan pelanggan puas dengan layanan MAKLIN
              </p>
            </div>

            {/* Desktop & Tablet Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {TESTIMONIALS.map((t) => (
                <motion.div key={t.name + t.loc} variants={fadeUp}>
                  <Card className="h-full p-5 sm:p-6 border-border/60 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-semibold">
                      {t.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.loc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-primary/85 text-primary/85"
                      />
                    ))}
                  </div>
                  <Quote className="size-5 text-primary/20 mb-2 rotate-180" />
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.loc}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {t.source}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel opts={{ align: 'start' }} className="w-full">
                <CarouselContent className="-ml-4">
                  {TESTIMONIALS.map((t) => (
                    <CarouselItem key={t.name + t.loc} className="pl-4 basis-[85%] sm:basis-[70%]">
                      <Card className="h-full p-5 border-border/60 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-semibold">
                          {t.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.loc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-4 fill-primary/85 text-primary/85"
                          />
                        ))}
                      </div>
                      <Quote className="size-5 text-primary/20 mb-2 rotate-180" />
                      <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic">
                          &ldquo;{t.text}&rdquo;
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.loc}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {t.source}
                          </Badge>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            9. FAQ SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="faq" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {FAQS.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border border-border/60 rounded-2xl px-6 py-4 sm:px-6 bg-card shadow-sm"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Masih punya pertanyaan?{' '}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Hubungi kami via WhatsApp <ChevronRight className="size-3.5" />
              </a>
            </p>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            10. CTA SECTION
        ────────────────────────────────────────────────────────── */}
        <section className="bg-primary py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                Saatnya Sofa Anda Kembali Bersih dan Nyaman
              </h2>
              <p className="mt-4 text-base sm:text-lg text-primary-foreground/90 max-w-xl mx-auto">
                Jangan biarkan debu, tungau, dan bakteri mengganggu kesehatan keluarga Anda.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold text-base px-8 shadow-lg"
                >
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                    Hubungi WhatsApp Sekarang
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-primary-foreground/70">
                Konsultasi gratis &bull; Tanpa komitmen
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ────────────────────────────────────────────────────────────
          13. FOOTER
      ──────────────────────────────────────────────────────────── */}
      <footer className="bg-brand text-brand-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
            {/* Brand */}
            <div>
              <span className="text-xl font-extrabold text-brand-foreground tracking-tight">
                MAKLIN
              </span>
              <p className="mt-1 text-xs text-brand-foreground/70 font-medium uppercase tracking-wider">
                Home Cleaning
              </p>
              <p className="mt-4 text-sm leading-relaxed text-brand-foreground/80">
                Jasa Cuci Sofa Purwakarta. Home service dengan peralatan modern dan chemical aman.
              </p>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="text-sm font-bold text-brand-foreground mb-4 uppercase tracking-wider">
                Layanan
              </h4>
              <ul className="space-y-2.5">
                {['Cuci Sofa', 'Cuci Kasur', 'Cuci Karpet', 'Cuci Kursi', 'Cuci Jok Mobil'].map(
                  (s) => (
                    <li key={s}>
                      <a
                        href={WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-foreground/80 hover:text-brand-foreground transition-colors"
                      >
                        {s}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-sm font-bold text-brand-foreground mb-4 uppercase tracking-wider">
                Kontak
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-brand-foreground/80">
                  <Phone className="size-4 shrink-0 mt-0.5" />
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-foreground transition-colors"
                  >
                    0857-9367-6315
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-background/70">
                  <Instagram className="size-4 shrink-0 mt-0.5" />
                  <span>@maklin_megacemerlang.purwakarta</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-background/70">
                  <MapPin className="size-4 shrink-0 mt-0.5" />
                  <span>Jl. Jend. A Yani 113, Purwakarta</span>
                </li>
              </ul>
            </div>

            {/* Jam Operasional */}
            <div>
              <h4 className="text-sm font-bold text-brand-foreground mb-4 uppercase tracking-wider">
                Jam Operasional
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-brand-foreground/80" />
                <span className="text-sm text-brand-foreground/80">Senin - Minggu</span>
              </div>
              <p className="text-sm font-semibold text-brand-foreground mb-1">07:30 - 16:30</p>
              <Badge
                variant="secondary"
                className="bg-brand-light/10 text-brand-foreground text-xs mt-1"
              >
                Setiap hari buka
              </Badge>
            </div>
          </div>

          <Separator className="my-8 bg-background/10" />

          <p className="text-center text-xs text-background/40">
            &copy; {CURRENT_YEAR} MAKLIN. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ────────────────────────────────────────────────────────────
          14. FLOATING BOOKING & WHATSAPP BUTTONS
      ──────────────────────────────────────────────────────────── */}
      <div
        className={`hidden lg:flex fixed right-6 bottom-32 z-50 flex-col gap-3 transition-all duration-300 ${
          showDesktopStickyBooking ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <Button
          size="sm"
          className="rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-lg"
          onClick={() => scrollTo('#booking')}
        >
          Booking Sekarang
        </Button>
        <Button asChild variant="outline" size="sm" className="rounded-full px-5 py-3 shadow-lg">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </Button>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden bg-background/95 border-t border-border/70 p-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm" className="min-h-[3rem] rounded-full px-4 py-3">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="secondary" size="sm" className="min-h-[3rem] rounded-full px-4 py-3">
              <a href="tel:085793676315">Telepon</a>
            </Button>
          </div>
          <Button
            size="sm"
            className="w-full rounded-full bg-primary text-primary-foreground font-semibold px-4 py-3"
            onClick={() => scrollTo('#booking')}
          >
            Booking Sekarang
          </Button>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  )
}
