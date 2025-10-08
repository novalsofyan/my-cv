import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'MyCV - Buat CV Profesional dengan Cepat',
      },
      {
        name: 'description',
        content: 'Buat CV profesional dengan cepat dan mudah. Masukkan data kamu dan lihat hasil CV secara langsung.',
      },
      {
        name: 'keywords',
        content: 'CV, Curriculum Vitae, Resume, Buat CV, Profesional, Online CV',
      },
      {
        name: 'author',
        content: 'Lucid Dreamworks Dev',
      },
    ],
  }),
})

function HomePage() {
  return (
    <main className="flex flex-col justify-center items-center max-w-4xl mx-auto py-4 px-2 text-center grow">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Buat CV Profesional dengan Cepat</h1>
      <p className="text-gray-600 mb-6">Masukkan data kamu dan lihat hasil CV secara langsung.</p>
      <Link to="/app" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Mulai Buat CV
      </Link>
    </main>
  )
}
