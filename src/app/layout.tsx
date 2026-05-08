import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NEXOVIA — Agence IA Automatisation Instagram & WhatsApp | Esthétique Premium',
  description: 'Transformez votre Instagram en machine à rendez-vous. Automatisation IA pour instituts de beauté, médecine esthétique, spas et cliniques haut de gamme.',
  keywords: 'automatisation instagram, chatbot esthétique, IA beauté, marketing esthétique, rendez-vous automatique',
  openGraph: {
    title: 'NEXOVIA — Automatisation IA pour l\'Esthétique Premium',
    description: 'Plus de rendez-vous. Moins de messages perdus. Automatisation premium.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
