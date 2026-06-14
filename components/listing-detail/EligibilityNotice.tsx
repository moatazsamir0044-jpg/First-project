interface EligibilityNoticeProps {
  eligibility: string
}

const ELIGIBILITY_TEXT: Record<string, { title: string; description: string; color: string }> = {
  all: {
    title: 'Open to Everyone',
    description: 'This property welcomes all guests — individuals, couples, families, and groups.',
    color: 'bg-green/10 border-green/20 text-green',
  },
  families: {
    title: 'Families & Couples Only',
    description: 'This property is reserved for families and couples only. ID verification may be required at check-in.',
    color: 'bg-sky border-sky text-ink',
  },
  couples: {
    title: 'Couples Only',
    description: 'This property is reserved for couples only. A marriage certificate may be required.',
    color: 'bg-orange/10 border-orange/20 text-orange',
  },
}

export default function EligibilityNotice({ eligibility }: EligibilityNoticeProps) {
  const config = ELIGIBILITY_TEXT[eligibility] || ELIGIBILITY_TEXT.all

  return (
    <div className={`flex gap-3 p-4 rounded-card border ${config.color}`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
      </svg>
      <div>
        <p className="font-semibold text-sm mb-0.5">{config.title}</p>
        <p className="text-sm opacity-80">{config.description}</p>
      </div>
    </div>
  )
}
