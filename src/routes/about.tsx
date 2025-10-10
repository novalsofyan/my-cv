import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
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
        title: 'Tentang MyCV - CV Builder Online',
      },
      {
        name: 'description',
        content:
          'MyCV adalah aplikasi pembuat CV online yang cepat, aman, dan open-source. Data pengguna tidak disimpan sama sekali.',
      },
      {
        name: 'keywords',
        content: 'MyCV, CV Builder, Resume Online, Open Source, Privacy',
      },
      {
        name: 'author',
        content: 'Lucid Dreamworks Dev',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),
})

function AboutPage() {
  return (
    <main className="flex flex-col justify-center max-w-4xl mx-auto py-4 px-2 grow text-lg md:text-2xl mt-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Tentang MyCV</h1>

      <p className="mb-4">
        MyCV adalah aplikasi <strong>pembuat CV online</strong> yang memudahkan kamu membuat Curriculum Vitae
        profesional dengan cepat dan mudah. Semua proses berlangsung langsung di browser tanpa perlu instalasi tambahan.
      </p>
      <p className="mb-4">
        <strong>Privasi terjamin:</strong> Website ini{' '}
        <span className="font-semibold">tidak menyimpan data pengguna sama sekali</span>. Semua data yang kamu masukkan
        hanya digunakan sementara untuk menampilkan preview CV.
      </p>
      <p className="mb-4">
        MyCV juga bersifat <strong>open-source</strong>. Sumber code bisa dilihat di{' '}
        <a
          className="text-red-500 hover:text-red-700 transition-colors duration-300"
          href="https://github.com/novalsofyan/my-cv"
          target="_blank"
          rel="noopener noreferrer"
        >
          sini
        </a>
        .
      </p>
      <p>
        Tujuan saya membuat website ini adalah membuat proses membuat CV menjadi mudah, cepat, dan aman untuk semua
        pengguna.
      </p>
    </main>
  )
}
