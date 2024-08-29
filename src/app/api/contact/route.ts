import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json()

        // Here you would typically send an email or save to a database
        // For this example, we'll just log the data
        console.log('Contact form submission:', { name, email, message })

        // In a real application, you might use a service like SendGrid to send emails:
        // await sendEmail({ name, email, message })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error processing contact form:', error)
        return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 })
    }
}