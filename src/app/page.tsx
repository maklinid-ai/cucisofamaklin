'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
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
  MapPin,
  Phone,
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
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────
const WA_NUMBER = '6285793676315'
const WA_MESSAGE = 'Halo MAKLIN, saya ingin konsultasi tentang jasa cuci sofa.'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`

const NAV_LINKS = [
  { label: 'Layanan', href: '#layanan' },
  { label: 'Proses', href: '#proses' },
  { label: 'Harga', href: '#harga' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'FAQ', href: '#faq' },
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
    icon: Sparkles,
    title: 'Angkat Debu, Tungau & Kuman',
    desc: 'Membersihkan sofa hingga ke akar kain, mengangkat debu, tungau, dan kuman secara tuntas.',
    tag: 'Ampuh',
  },
  {
    icon: Eraser,
    title: 'Hilangkan Noda',
    desc: 'Menghilangkan berbagai jenis noda membandel dengan teknik deep cleaning profesional.',
    tag: 'Deep Clean',
  },
  {
    icon: Flower2,
    title: 'Wangi Segar Tahan Lama',
    desc: 'Sofa kembali wangi segar dengan pengharum berkualitas yang tahan lama.',
    tag: 'Fresh',
  },
  {
    icon: ShieldCheck,
    title: 'Aman untuk Anak-anak',
    desc: 'Chemical yang kami gunakan aman dan ramah lingkungan, tidak berbahaya untuk keluarga.',
    tag: 'Safe',
  },
  {
    icon: Clock,
    title: 'Praktis & Cepat',
    desc: 'Home service langsung ke lokasi Anda. Pengerjaan cepat, sofa cepat kering dan siap pakai.',
    tag: 'Fast',
  },
  {
    icon: Award,
    title: 'Teknisi Profesional',
    desc: 'Tim teknisi berpengalaman dan terlatih yang mengutamakan kepuasan pelanggan.',
    tag: 'Expert',
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
    desc: 'Deep cleaning sofa fabric, kulit, dan velvet',
    popular: true,
  },
  {
    name: 'Cuci Kasur',
    desc: 'Bersihkan kasur dari tungau dan bakteri',
    popular: false,
  },
  {
    name: 'Cuci Karpet',
    desc: 'Karpet bersih dan wangi seperti baru',
    popular: false,
  },
  {
    name: 'Cuci Kursi',
    desc: 'Kursi kantor, makan, dan santai',
    popular: false,
  },
  {
    name: 'Cuci Jok Mobil',
    desc: 'Jok mobil fabric dan leather',
    popular: false,
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
const bookingSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  whatsapp: z.string().min(10, 'Nomor WhatsApp tidak valid'),
  schedule: z.string().min(1, 'Pilih jadwal'),
  address: z.string().min(5, 'Alamat terlalu singkat'),
  googleMapsLink: z.string().optional(),
  service: z.string().min(1, 'Pilih layanan'),
  notes: z.string().optional(),
  agreedToTerms: z.literal(true, {
    message: 'Anda harus menyetujui syarat dan ketentuan',
  }),
})

type BookingFormValues = z.infer<typeof bookingSchema>

// ─── Animation Variants ──────────────────────────────────────────────
const fadeUp = {
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Scroll listener for navbar ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
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

  // ── Form ──
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      schedule: '',
      address: '',
      googleMapsLink: '',
      service: '',
      notes: '',
      agreedToTerms: undefined as unknown as true,
    },
  })

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success && json.whatsappUrl) {
        toast.success('Booking berhasil! Mengarahkan ke WhatsApp...')
        window.open(json.whatsappUrl, '_blank', 'noopener,noreferrer')
        reset()
      } else {
        toast.error(json.error || 'Terjadi kesalahan. Silakan coba lagi.')
        if (json.details) {
          console.error('Validation details:', json.details)
        }
      }
    } catch {
      toast.error('Gagal menghubungi server. Periksa koneksi internet Anda.')
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
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-lg shadow-sm border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 group"
            aria-label="MAKLIN Home Cleaning"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary">
              MAKLIN
            </span>
            <span className="hidden sm:inline text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide uppercase ml-1">
              Home Cleaning
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" className="font-semibold">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                Hubungi WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Buka menu navigasi">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-bold text-primary">
                    MAKLIN
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
                      Hubungi WhatsApp
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
        <section
          className="relative w-full min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden"
          aria-label="Hero"
        >
          {/* Background image */}
          <Image
            src="/images/hero-sofa.png"
            alt="Sofa bersih oleh MAKLIN Home Cleaning Purwakarta"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance"
            >
              Jasa Cuci Sofa Purwakarta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 text-base sm:text-lg md:text-xl font-medium text-white/90 tracking-wide"
            >
              Bersih Maksimal &bull; Higienis &bull; Wangi &bull; Home Service
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
            >
              {[
                'Tim Profesional',
                'Peralatan Modern',
                'Chemical Aman',
                'Cepat Kering',
              ].map((b) => (
                <div
                  key={b}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="size-4 text-green-300 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button asChild size="lg" className="w-full sm:w-auto text-base font-bold px-8">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  Hubungi via WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold px-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <button onClick={() => scrollTo('#harga')}>Lihat Harga</button>
              </Button>
            </motion.div>

            {/* Rating */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-6 text-sm sm:text-base text-yellow-300 font-medium flex items-center justify-center gap-1.5"
            >
              {'★'.repeat(5)}{' '}
              <span className="text-white/80 ml-1">Dipercaya <Counter target={150} suffix="+" /> Pelanggan Purwakarta</span>
            </motion.p>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. SERVICE AREAS STRIP
        ────────────────────────────────────────────────────────── */}
        <section className="bg-primary py-3 overflow-hidden" aria-label="Area layanan">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-primary-foreground text-center text-sm font-semibold mb-2">
              <MapPin className="inline size-4 mr-1 -mt-0.5" />
              Melayani Purwakarta dan Sekitarnya
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {SERVICE_AREAS.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 text-xs"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            4. PROBLEMS SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="layanan" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Apakah Sofa Anda Mengalami Masalah Ini?
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Jangan biarkan sofa kotor mengancam kesehatan keluarga Anda
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {PROBLEMS.map((p) => (
                <motion.div key={p.title} variants={fadeUp}>
                  <Card className="h-full text-center p-5 sm:p-6 hover:shadow-md transition-shadow border-border/60">
                    <div className="mx-auto mb-3 flex items-center justify-center size-12 sm:size-14 rounded-full bg-red-50 text-red-500">
                      <p.icon className="size-6 sm:size-7" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base mb-1.5">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground text-sm sm:text-base mb-4">
                Sofa kotor bisa jadi sarang penyakit. Kami siap membantu!
              </p>
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  Konsultasi Gratis <ChevronRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            5. WHY CHOOSE US
        ────────────────────────────────────────────────────────── */}
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
                    whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                    className="h-full"
                  >
                    <Card className="h-full p-5 sm:p-6 border-border/60">
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
            6. BEFORE / AFTER GALLERY
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection className="py-16 md:py-24">
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
                  <Card className="overflow-hidden border-border/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg font-bold">
                        {item.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before */}
                      <div className="relative">
                        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
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
            7. PROCESS SECTION
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

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />

              {PROCESS_STEPS.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex items-start gap-4 md:gap-0 mb-10 last:mb-0 ${
                    idx % 2 === 0
                      ? 'md:flex-row'
                      : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Number badge on the line */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md">
                    {step.num}
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                      idx % 2 === 0 ? 'md:pr-0 md:mr-auto' : 'md:pl-0 md:ml-auto'
                    }`}
                  >
                    <Card className="p-4 sm:p-5 border-border/60">
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
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            8. PRICING SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="harga" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Daftar Harga Jasa Kami
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Harga terjangkau dengan hasil maksimal. Konsultasi gratis!
              </p>
            </div>

            {/* Desktop grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {PRICING.map((item) => (
                <motion.div key={item.name} variants={fadeUp}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`h-full ${
                      item.popular ? 'md:-mt-2' : ''
                    }`}
                  >
                    <Card
                      className={`h-full p-5 text-center relative ${
                        item.popular
                          ? 'border-2 border-primary shadow-lg shadow-primary/10'
                          : 'border-border/60'
                      }`}
                    >
                      {item.popular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3">
                          Paling Populer
                        </Badge>
                      )}
                      <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-3 mt-1">
                        <Sparkles className="size-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {item.desc}
                      </p>
                      <p className="text-sm font-semibold text-primary mb-4">
                        Harga mulai dari ...
                      </p>
                      <Button
                        asChild
                        variant={item.popular ? 'default' : 'outline'}
                        className="w-full text-sm font-semibold"
                        size="sm"
                      >
                        <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                          Konsultasi Gratis
                        </a>
                      </Button>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile horizontal scroll */}
            <div className="md:hidden">
              <Carousel opts={{ align: 'start' }} className="w-full">
                <CarouselContent className="-ml-4">
                  {PRICING.map((item) => (
                    <CarouselItem key={item.name} className="pl-4 basis-[75%] sm:basis-[60%]">
                      <Card
                        className={`h-full p-5 text-center relative ${
                          item.popular
                            ? 'border-2 border-primary shadow-lg shadow-primary/10'
                            : 'border-border/60'
                        }`}
                      >
                        {item.popular && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3">
                            Paling Populer
                          </Badge>
                        )}
                        <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-3 mt-1">
                          <Sparkles className="size-6" />
                        </div>
                        <h3 className="font-bold text-base mb-1">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {item.desc}
                        </p>
                        <p className="text-sm font-semibold text-primary mb-4">
                          Harga mulai dari ...
                        </p>
                        <Button
                          asChild
                          variant={item.popular ? 'default' : 'outline'}
                          className="w-full text-sm font-semibold"
                          size="sm"
                        >
                          <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                            Konsultasi Gratis
                          </a>
                        </Button>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </AnimatedSection>

        {/* ──────────────────────────────────────────────────────────
            9. TESTIMONIALS
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="testimoni" className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Apa Kata Pelanggan Kami
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Lebih dari 150 pelanggan puas dengan layanan MAKLIN
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
                  <Card className="h-full p-5 sm:p-6 border-border/60">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-yellow-400 text-yellow-400"
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
                      <Card className="h-full p-5 border-border/60">
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="size-4 fill-yellow-400 text-yellow-400"
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
            10. FAQ SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection id="faq" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border border-border/60 rounded-lg px-4 sm:px-5 bg-card"
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
            11. BOOKING SECTION
        ────────────────────────────────────────────────────────── */}
        <AnimatedSection className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Booking Jasa Home Cleaning MAKLIN
              </h2>
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                Isi formulir berikut. Tim MAKLIN akan segera menghubungi Anda melalui WhatsApp.
              </p>
            </div>

            {/* Info badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-8">
              {BOOKING_INFO.map((info) => (
                <div
                  key={info.text}
                  className="flex items-center gap-2 bg-card border border-border/60 rounded-lg px-3 py-2.5"
                >
                  <info.icon className="size-4 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">{info.text}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <Card className="p-5 sm:p-6 md:p-8 border-border/60">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Nama */}
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Nama Pelanggan <span className="text-destructive">*</span>
                  </Label>
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

                {/* WhatsApp */}
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp" className="text-sm font-semibold">
                    WhatsApp <span className="text-destructive">*</span>
                  </Label>
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

                {/* Jadwal */}
                <div className="grid gap-2">
                  <Label htmlFor="schedule" className="text-sm font-semibold">
                    Jadwal Booking <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="schedule"
                    {...register('schedule')}
                    className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="">Pilih jadwal...</option>
                    <option value="Hari Ini">Hari Ini</option>
                    <option value="Besok">Besok</option>
                    <option value="Pilih Tanggal Lain">Pilih Tanggal Lain</option>
                  </select>
                  {errors.schedule && (
                    <p className="text-destructive text-xs">{errors.schedule.message}</p>
                  )}
                </div>

                {/* Alamat */}
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Alamat / Lokasi <span className="text-destructive">*</span>
                  </Label>
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

                {/* Google Maps Link */}
                <div className="grid gap-2">
                  <Label htmlFor="googleMapsLink" className="text-sm font-semibold">
                    Link Google Maps{' '}
                    <span className="text-muted-foreground font-normal">(opsional)</span>
                  </Label>
                  <Input
                    id="googleMapsLink"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    {...register('googleMapsLink')}
                  />
                </div>

                {/* Pilih Layanan */}
                <div className="grid gap-2">
                  <Label htmlFor="service" className="text-sm font-semibold">
                    Pilih Layanan <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="service"
                    {...register('service')}
                    className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="">Pilih layanan...</option>
                    <option value="Cuci Sofa">Cuci Sofa</option>
                    <option value="Cuci Kasur">Cuci Kasur</option>
                    <option value="Cuci Karpet">Cuci Karpet</option>
                    <option value="Cuci Kursi">Cuci Kursi</option>
                    <option value="Cuci Jok Mobil">Cuci Jok Mobil</option>
                    <option value="Cuci Spring Bed">Cuci Spring Bed</option>
                  </select>
                  {errors.service && (
                    <p className="text-destructive text-xs">{errors.service.message}</p>
                  )}
                </div>

                {/* Catatan */}
                <div className="grid gap-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    Catatan{' '}
                    <span className="text-muted-foreground font-normal">(opsional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Catatan tambahan, misalnya jenis sofa, ukuran, dll."
                    rows={3}
                    {...register('notes')}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <Controller
                    name="agreedToTerms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={(val) => field.onChange(val === true)}
                        aria-invalid={!!errors.agreedToTerms}
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed cursor-pointer">
                    Saya telah membaca, memahami, dan menyetujui{' '}
                    <span className="font-semibold">Syarat &amp; Ketentuan Layanan MAKLIN</span>.
                  </Label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-destructive text-xs">{errors.agreedToTerms.message}</p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full font-bold text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Memproses...
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

        {/* ──────────────────────────────────────────────────────────
            12. CTA SECTION
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
      <footer className="bg-foreground text-background/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div>
              <span className="text-xl font-extrabold text-background tracking-tight">
                MAKLIN
              </span>
              <p className="mt-1 text-xs text-background/50 font-medium uppercase tracking-wider">
                Home Cleaning
              </p>
              <p className="mt-4 text-sm leading-relaxed text-background/70">
                Jasa Cuci Sofa Purwakarta. Home service dengan peralatan modern dan chemical aman.
              </p>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="text-sm font-bold text-background mb-4 uppercase tracking-wider">
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
                        className="text-sm text-background/70 hover:text-background transition-colors"
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
              <h4 className="text-sm font-bold text-background mb-4 uppercase tracking-wider">
                Kontak
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-background/70">
                  <Phone className="size-4 shrink-0 mt-0.5" />
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
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
              <h4 className="text-sm font-bold text-background mb-4 uppercase tracking-wider">
                Jam Operasional
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-background/70" />
                <span className="text-sm text-background/70">Senin - Minggu</span>
              </div>
              <p className="text-sm font-semibold text-background mb-1">07:30 - 16:30</p>
              <Badge
                variant="secondary"
                className="bg-background/10 text-background/80 text-xs mt-1"
              >
                Setiap hari buka
              </Badge>
            </div>
          </div>

          <Separator className="my-8 bg-background/10" />

          <p className="text-center text-xs text-background/40">
            &copy; 2025 MAKLIN. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ────────────────────────────────────────────────────────────
          14. WHATSAPP FLOATING BUTTON
      ──────────────────────────────────────────────────────────── */}
      <WhatsAppButton />
    </div>
  )
}