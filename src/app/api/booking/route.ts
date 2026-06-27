import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = bookingSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data tidak valid',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = result.data

    const message = `*BOOKING HOME CLEANING MAKLIN*%0A%0A` +
      `📋 *Detail Booking*%0A` +
      `━━━━━━━━━━━━━━━%0A` +
      `👤 Nama: ${data.name}%0A` +
      `📱 WhatsApp: ${data.whatsapp}%0A` +
      `📅 Jadwal: ${data.schedule}%0A` +
      `📍 Alamat: ${data.address}%0A` +
      (data.googleMapsLink ? `🔗 Maps: ${data.googleMapsLink}%0A` : '') +
      `🧹 Layanan: ${data.service}%0A` +
      (data.notes ? `📝 Catatan: ${data.notes}%0A` : '') +
      `%0A━━━━━━━━━━━━━━━%0A` +
      `Dikirim melalui website cucisofa.maklin.id`

    const whatsappUrl = `https://wa.me/6285793676315?text=${message}`

    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: 'Booking berhasil! Anda akan diarahkan ke WhatsApp.',
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan server. Silakan coba lagi.',
      },
      { status: 500 }
    )
  }
}