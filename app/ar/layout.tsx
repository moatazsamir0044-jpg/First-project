export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="ar" style={{ fontFamily: "'Cairo', 'Gilroy', system-ui, sans-serif" }}>
      {children}
    </div>
  )
}
