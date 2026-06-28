import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { buildWhatsAppUrl, getIndonesianTimestamp } from '@/lib/booking'

const bookingSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  whatsapp: z.string().min(10, 'Nomor WhatsApp tidak valid'),
  schedule: z.string().min(1, 'Pilih jadwal'),
  address: z.string().min(5, 'Alamat terlalu singkat'),
  googleMapsLink: z.string().optional(),
  service: z.array(z.string()).min(1, 'Pilih minimal 1 layanan'),
  notes: z.string().optional(),
  agreedToTerms: z.literal(true, {
    message: 'Anda harus menyetujui syarat dan ketentuan',
  }),
})

function getGoogleScriptUrl() {
  return process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim()
}

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
    const selectedServices = data.service.join(', ')
    const tanggalSubmit = getIndonesianTimestamp()

    const submissionFields = {
      'Nama Pelanggan': data.name,
      WhatsApp: data.whatsapp,
      'Alamat / Lokasi': data.address,
      'Google Map': data.googleMapsLink ?? '',
      'Jadwal Booking': data.schedule,
      'Pilih Layanan': selectedServices,
      'Catatan / Keterangan': data.notes ?? '',
      'Tanggal Submit': tanggalSubmit,
      nama: data.name,
      whatsapp: data.whatsapp,
      alamat: data.address,
      googleMap: data.googleMapsLink ?? '',
      jadwal: data.schedule,
      jadwalBooking: data.schedule,
      layanan: selectedServices,
      catatan: data.notes ?? '',
      tanggalSubmit,
      payload_json: JSON.stringify({
        'Nama Pelanggan': data.name,
        WhatsApp: data.whatsapp,
        'Alamat / Lokasi': data.address,
        'Google Map': data.googleMapsLink ?? '',
        'Jadwal Booking': data.schedule,
        'Pilih Layanan': selectedServices,
        'Catatan / Keterangan': data.notes ?? '',
        'Tanggal Submit': tanggalSubmit,
      }),
    }

    const googleScriptUrl = getGoogleScriptUrl()

    let orderNumber = ''
    let spreadsheetSaved = false

    if (googleScriptUrl) {
      try {
        const searchParams = new URLSearchParams()
        Object.entries(submissionFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })

        const scriptUrl = new URL(googleScriptUrl)
        searchParams.forEach((value, key) => {
          scriptUrl.searchParams.append(key, value)
        })

        const scriptResponse = await fetch(scriptUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: searchParams.toString(),
        })

        const responseText = await scriptResponse.text().catch(() => '')
        let scriptJson: { success?: boolean; orderNumber?: string | null; status?: string } | null = null

        try {
          scriptJson = responseText ? JSON.parse(responseText) : null
        } catch {
          scriptJson = null
        }

        if (scriptResponse.ok && scriptJson?.success === true && scriptJson?.orderNumber) {
          orderNumber = scriptJson.orderNumber
          spreadsheetSaved = true
        } else {
          console.error('Google Apps Script response was not accepted:', {
            status: scriptResponse.status,
            body: responseText,
          })
        }
      } catch (error) {
        console.error('Google Apps Script submission failed:', error)
      }
    }

    if (!spreadsheetSaved || !orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal menyimpan booking. Silakan coba kembali.',
        },
        { status: 502 }
      )
    }

    const whatsappUrl = buildWhatsAppUrl({
      orderNumber,
      nama: submissionFields.nama,
      whatsapp: submissionFields.whatsapp,
      alamat: submissionFields.alamat,
      googleMap: submissionFields.googleMap,
      jadwal: submissionFields.jadwal,
      layanan: submissionFields.layanan,
      catatan: submissionFields.catatan,
    })

    return NextResponse.json({
      success: true,
      whatsappUrl,
      orderNumber,
      message: 'Booking berhasil disimpan.',
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan booking. Silakan coba kembali.',
      },
      { status: 500 }
    )
  }
}
