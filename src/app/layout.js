import './globals.css'

export const metadata = {
  title: 'ChatGroq',
  description: 'Chat with Groq AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <base href="/ChatGroq/" />
      </head>
      <body className="bg-gray-100">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}