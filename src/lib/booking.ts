import { format, isBefore, isValid, parse, startOfDay } from 'date-fns'
import { id } from 'date-fns/locale'

export const MAKLIN_WA_NUMBER = '6285793676315'
export const BOOKING_TIME_OPTIONS = [
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
]

export type BookingSubmissionPayload = {
  nama: string
  whatsapp: string
  alamat: string
  googleMap: string
  jadwal: string
  layanan: string
  catatan: string
  tanggalSubmit: string
  orderNumber?: string
}

export function getIndonesianTimestamp(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`
}

export function getBookingScheduleError(value: string) {
  const normalizedValue = value?.trim() ?? ''

  if (!normalizedValue) {
    return 'Silakan pilih jadwal booking.'
  }

  const parsedDate = parse(normalizedValue, 'dd-MMM-yyyy HH:mm', new Date())

  if (!isValid(parsedDate)) {
    return 'Silakan pilih jadwal booking.'
  }

  const [datePart, timePart] = normalizedValue.split(' ')
  if (!datePart || !timePart || !BOOKING_TIME_OPTIONS.includes(timePart)) {
    return 'Jam booking tersedia mulai pukul 07.30 sampai 16.30.'
  }

  const today = startOfDay(new Date())
  if (isBefore(startOfDay(parsedDate), today)) {
    return 'Tanggal booking tidak boleh sebelum hari ini.'
  }

  return ''
}

export function formatBookingSchedule(date: Date, time: string) {
  return `${format(date, 'dd-MMM-yyyy')} ${time}`
}

export function formatWhatsAppSchedule(value: string) {
  const parsed = parse(value, 'dd-MMM-yyyy HH:mm', new Date())

  if (!isValid(parsed)) {
    return value
  }

  return format(parsed, "EEEE, dd MMM yyyy 'Pkl.' HH:mm", { locale: id })
}

const usedOrderNumbers = new Set<string>()

function generateUniqueRandomSegment() {
  if (usedOrderNumbers.size >= 1000000) {
    usedOrderNumbers.clear()
  }

  let candidate = ''
  do {
    candidate = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  } while (usedOrderNumbers.has(candidate))

  usedOrderNumbers.add(candidate)
  return candidate
}

export function buildTemporaryOrderNumber(date = new Date()) {
  const jakartaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  const day = String(jakartaDate.getDate()).padStart(2, '0')
  const month = String(jakartaDate.getMonth() + 1).padStart(2, '0')
  const year = String(jakartaDate.getFullYear()).slice(-2)
  const randomSegment = generateUniqueRandomSegment()

  return `${day}${month}${year}/HCS/${randomSegment}`
}

export function buildWhatsAppMessage({
  orderNumber,
  nama,
  whatsapp,
  alamat,
  googleMap,
  jadwal,
  layanan,
  catatan,
}: {
  orderNumber: string
  nama: string
  whatsapp: string
  alamat: string
  googleMap: string
  jadwal: string
  layanan: string
  catatan: string
}) {
  return [
    '*Form Order MAKLIN Home Service*',
    'No. Order:',
    orderNumber,
    '',
    '*A. Detail Pemesan*',
    'Nama Pelanggan/ Pemesan (Klien):',
    nama,
    '',
    'No. Kontak:',
    whatsapp,
    '',
    'Alamat/ Lokasi :',
    alamat,
    '',
    'Google Map (link):',
    googleMap || '_Tidak ada data._',
    '',
    '*B. Detail Pesanan*',
    'Pilihan Layanan:',
    layanan,
    '',
    'Catatan Khusus untuk Teknisi:',
    catatan || 'Tidak ada.',
    '',
    '*C. Jadwal dan Metode Pembayaran*',
    'Jadwal Pengerjaan:',
    formatWhatsAppSchedule(jadwal),
    '',
    'Metode Pembayaran (Transfer) : Transfer ke Rek. Bank Mandiri No. 1730004377678   a.n. Ela Sarifatulaela',
    '',
    '*D. Ketentuan Langkah Pencucian & Ketentuan Pengerjaan*',
    'Pernyataan Pelanggan:',
    '_Pelanggan Sudah Membaca dan Menerima Ketentuan Langkah Pencucian._',
  ].join('\n')
}

export function buildWhatsAppUrl(booking: {
  orderNumber: string
  nama: string
  whatsapp: string
  alamat: string
  googleMap: string
  jadwal: string
  layanan: string
  catatan: string
}) {
  const message = buildWhatsAppMessage(booking)
  return `https://wa.me/${MAKLIN_WA_NUMBER}?text=${encodeURIComponent(message)}`
}
