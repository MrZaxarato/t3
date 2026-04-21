import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [name, setName] = useState('')
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fel vid hämtning av kontakter:', error)
      setLoading(false)
      return
    }

    const formattedContacts = (data || []).map((contact) => ({
      id: contact.id,
      name: contact.name,
      lastContactDate: contact.last_contact_date,
      createdAt: contact.created_at,
    }))

    setContacts(formattedContacts)
    setLoading(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  function getDaysSince(dateString) {
    const today = new Date()
    const pastDate = new Date(dateString)

    today.setHours(0, 0, 0, 0)
    pastDate.setHours(0, 0, 0, 0)

    const diffMs = today - pastDate
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }

  async function handleAddContact() {
    const trimmedName = name.trim()

    if (!trimmedName) return

    const { error } = await supabase.from('contacts').insert([
      {
        name: trimmedName,
      },
    ])

    if (error) {
      console.error('Fel vid skapande av kontakt:', error)
      return
    }

    setName('')
    loadContacts()
  }

  async function handleContactToday(id) {
    const { error } = await supabase
      .from('contacts')
      .update({ last_contact_date: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Fel vid uppdatering av kontakt:', error)
      return
    }

    loadContacts()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">T3</h1>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold text-slate-700">
            Lägg till kontakt
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Skriv namn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddContact}
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Lägg till
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold text-slate-700">
            Kontakter
          </h2>

          {loading ? (
            <p className="text-slate-500">Laddar...</p>
          ) : contacts.length === 0 ? (
            <p className="text-slate-500">Inga kontakter ännu.</p>
          ) : (
            <ul className="space-y-3">
              {contacts.map((contact) => {
                const daysSince = getDaysSince(contact.lastContactDate)

                let statusColor = 'text-green-600'
                if (daysSince >= 3) statusColor = 'text-yellow-600'
                if (daysSince >= 8) statusColor = 'text-red-600'

                return (
                  <li
                    key={contact.id}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="font-semibold text-slate-800">
                      {contact.name}
                    </div>

                    <div className={`mt-1 text-sm ${statusColor}`}>
                      Senaste kontakt: {daysSince} dagar sedan
                    </div>

                    <button
                      onClick={() => handleContactToday(contact.id)}
                      className="mt-3 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
                    >
                      Jag hade kontakt idag
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}