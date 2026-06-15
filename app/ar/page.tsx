import { redirect } from 'next/navigation'

// Arabic homepage — redirects to English homepage with RTL applied via Header
// Full Arabic pages can be expanded here
export default function ArabicHomePage() {
  // For now redirect to homepage — the Header will detect /ar and show Arabic nav
  redirect('/')
}
