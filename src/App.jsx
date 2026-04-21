import { useState } from 'react'

export default function App() {
  const [name, setName] = useState('')
  const [contacts, setContacts] = useState([])

  function handleAddContact() {
    const trimmedName = name.trim()

    if (!trimmedName) return

    const newContact = {
      id: Date.now(),
      name: trimmedName,
      lastContact: 'Idag',
    }

    setContacts([newContact, ...contacts])
    setName('')
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

          {contacts.length === 0 ? (
            <p className="text-slate-500">Inga kontakter ännu.</p>
          ) : (
            <ul className="space-y-3">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="font-semibold text-slate-800">
                    {contact.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Senaste kontakt: {contact.lastContact}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}