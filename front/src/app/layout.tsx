import './globals.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { PrimeReactProvider } from 'primereact/api'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soul Connection - Dashboard',
  description: 'A 3rd year students Epitech project',
  authors: [
    {
      name: 'Gianni Henriques',
      url: 'https://github.com/capuchegianni'
    },
    {
      name: 'Sacha Polerowicz',
      url: 'https://github.com/Sachaplr'
    },
    {
      name: 'Augustin Piffeteau',
      url: 'https://github.com/AugustinPif'
    },
    {
      name: 'Elouan Rigomont',
      url: 'https://github.com/ElouanR'
    }
  ],
  keywords: ['Epitech', 'Survivor', 'NextJs', 'React', 'Fullstack']
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  )
}
