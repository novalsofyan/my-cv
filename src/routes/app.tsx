import { useState, ChangeEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import CVPreview from '../components/CV-preview'

export const Route = createFileRoute('/app')({
  component: CVBuilder,

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
        title: 'MyCV - CV Builder Online',
      },
      {
        name: 'description',
        content:
          'Buat CV profesional langsung dari browser dengan MyCV. Masukkan data kamu dan lihat hasilnya secara real-time.',
      },
      {
        name: 'keywords',
        content:
          'CV Builder, Online CV, Resume, Curriculum Vitae, Profesional CV',
      },
      {
        name: 'author',
        content: 'Lucid Dreamworks Dev',
      },
    ],
  }),
})

interface Poin {
  id: number
  poin: string
}

interface Entry {
  id: number
  item: string
  year?: string
  poinList: Poin[]
}

interface Section {
  id: number
  title: string
  entries: Entry[]
}

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  summary: string
}

function CVBuilder() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
  })

  const [sections, setSections] = useState<Section[]>([])

  // ==============================
  // Section & Entry & Poin Handlers
  // ==============================
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: '',
        entries: [{ id: Date.now() + 1, item: '', year: '', poinList: [] }],
      },
    ])
  }

  const removeSection = (id: number) =>
    setSections(sections.filter((s) => s.id !== id))

  const addEntry = (sectionId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: [
                ...s.entries,
                { id: Date.now(), item: '', year: '', poinList: [] },
              ],
            }
          : s,
      ),
    )
  }

  const removeEntry = (sectionId: number, entryId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) }
          : s,
      ),
    )
  }

  const addPoin = (sectionId: number, entryId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId
                  ? {
                      ...e,
                      poinList: [...e.poinList, { id: Date.now(), poin: '' }],
                    }
                  : e,
              ),
            }
          : s,
      ),
    )
  }

  const removePoin = (sectionId: number, entryId: number, poinId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId
                  ? {
                      ...e,
                      poinList: e.poinList.filter((p) => p.id !== poinId),
                    }
                  : e,
              ),
            }
          : s,
      ),
    )
  }

  // ==============================
  // Input Change Handlers
  // ==============================
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSectionTitleChange = (sectionId: number, value: string) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, title: value } : s)),
    )
  }

  const handleEntryChange = (
    sectionId: number,
    entryId: number,
    value: string,
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId ? { ...e, item: value } : e,
              ),
            }
          : s,
      ),
    )
  }

  const handleYearChange = (
    sectionId: number,
    entryId: number,
    value: string,
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId ? { ...e, year: value } : e,
              ),
            }
          : s,
      ),
    )
  }

  const handlePoinChange = (
    sectionId: number,
    entryId: number,
    poinId: number,
    value: string,
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId
                  ? {
                      ...e,
                      poinList: e.poinList.map((p) =>
                        p.id === poinId ? { ...p, poin: value } : p,
                      ),
                    }
                  : e,
              ),
            }
          : s,
      ),
    )
  }

  // ==============================
  // Map sections untuk CVPreview
  // ==============================
  const mappedSections = sections.map((s) => ({
    id: s.id,
    title: s.title,
    entries: s.entries.flatMap((e) => {
      const entriesArray: { id: number; content: string; year?: string }[] = []

      if (e.item.trim()) {
        entriesArray.push({
          id: e.id,
          content: e.item, // item tetap utuh (boleh ada kurung)
          year: e.year?.trim() ? e.year : undefined, // year dari input Year
        })
      }

      e.poinList.forEach((p) => {
        if (p.poin.trim()) {
          entriesArray.push({
            id: p.id,
            content: `• ${p.poin}`,
          })
        }
      })

      return entriesArray
    }),
  }))

  // ==============================
  // Render
  // ==============================
  return (
    <main className="max-w-4xl mx-auto mt-12 px-4 py-8 grow">
      <h1 className="text-3xl font-bold text-center mb-6">Buat CV</h1>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* User Info */}
        <input
          name="name"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={handleFormChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 mb-2"
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleFormChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 mb-2"
        />
        <input
          name="phone"
          placeholder="Telepon"
          value={formData.phone}
          onChange={handleFormChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 mb-2"
        />
        <input
          name="address"
          placeholder="Alamat"
          value={formData.address}
          onChange={handleFormChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 mb-2"
        />
        <textarea
          name="summary"
          placeholder="Ringkasan Diri"
          value={formData.summary}
          onChange={handleFormChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400 mb-2"
          rows={3}
        />

        <hr className="my-4" />

        {/* Sections */}
        {sections.map((section) => (
          <div
            key={section.id}
            className="border p-3 rounded-lg mb-2 bg-gray-50"
          >
            <input
              type="text"
              placeholder="Judul Section"
              value={section.title}
              onChange={(e) =>
                handleSectionTitleChange(section.id, e.target.value)
              }
              className="w-full border px-2 py-1 rounded mb-2"
            />

            {section.entries.map((entry) => (
              <div
                key={entry.id}
                className="border p-2 rounded-lg mb-2 bg-white"
              >
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Item"
                    value={entry.item}
                    onChange={(e) =>
                      handleEntryChange(section.id, entry.id, e.target.value)
                    }
                    className="w-2/3 border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Tahun (opsional)"
                    value={entry.year || ''}
                    onChange={(e) =>
                      handleYearChange(section.id, entry.id, e.target.value)
                    }
                    className="w-1/3 border px-2 py-1 rounded"
                  />
                </div>

                {entry.poinList.map((p) => (
                  <div key={p.id} className="flex gap-2 mb-1 items-center">
                    <input
                      type="text"
                      placeholder="Poin"
                      value={p.poin}
                      onChange={(e) =>
                        handlePoinChange(
                          section.id,
                          entry.id,
                          p.id,
                          e.target.value,
                        )
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => removePoin(section.id, entry.id, p.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addPoin(section.id, entry.id)}
                  className="flex items-center gap-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Poin
                </button>

                <button
                  onClick={() => removeEntry(section.id, entry.id)}
                  className="flex items-center gap-1 text-red-500 mt-2 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" /> Hapus Item
                </button>
              </div>
            ))}

            <button
              onClick={() => addEntry(section.id)}
              className="flex items-center gap-1 mx-auto text-sm bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500 mt-1"
            >
              <Plus className="w-3 h-3" /> Tambah Item
            </button>

            <button
              onClick={() => removeSection(section.id)}
              className="flex items-center gap-1 text-red-500 mt-2 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" /> Hapus Section
            </button>
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <button
            onClick={addSection}
            className="flex items-center gap-1 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Section
          </button>
        </div>
      </div>

      <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Preview CV
          <br />
          <section className="text-sm">
            (pengguna mobile gunakan Firefox untuk melihat preview)
          </section>
        </h2>
        <CVPreview formData={formData} sections={mappedSections} />
      </div>
    </main>
  )
}
