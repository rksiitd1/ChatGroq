import './globals.css'

export const metadata = {
  title: 'ChatGroq',
  description: 'Chat with Groq AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <base href={process.env.NEXT_PUBLIC_BASE_PATH || '/'} />
      </head>
      <body className="bg-gray-100">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}