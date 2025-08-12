import './globals.css'

export const metadata = {
  title: 'JobSite SaaS Management',
  description: 'Central management system for JobSite SaaS installations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}