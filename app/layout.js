import './globals.css'
import QueryProvider from './components/QueryProvider'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata = {
  title: 'JobSite SaaS Management',
  description: 'Central management system for JobSite SaaS installations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}