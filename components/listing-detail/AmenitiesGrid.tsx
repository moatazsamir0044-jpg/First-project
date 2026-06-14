import { Wifi, Car, Dumbbell, Waves, Utensils, Tv, Wind, WashingMachine, Briefcase, Flame, Trees, Shield } from 'lucide-react'

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Gym': <Dumbbell className="w-5 h-5" />,
  'Pool': <Waves className="w-5 h-5" />,
  'Beach Access': <Waves className="w-5 h-5" />,
  'Kitchen': <Utensils className="w-5 h-5" />,
  'Smart TV': <Tv className="w-5 h-5" />,
  'AC': <Wind className="w-5 h-5" />,
  'Washer': <WashingMachine className="w-5 h-5" />,
  'Workspace': <Briefcase className="w-5 h-5" />,
  'BBQ': <Flame className="w-5 h-5" />,
  'Garden': <Trees className="w-5 h-5" />,
  'Security': <Shield className="w-5 h-5" />,
}

interface AmenitiesGridProps {
  amenities: string[]
}

export default function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-ink mb-5">What's Included</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {amenities.map(amenity => (
          <div key={amenity} className="flex items-center gap-3 p-3 bg-cream rounded-card">
            <span className="text-green">
              {AMENITY_ICONS[amenity] || <Shield className="w-5 h-5" />}
            </span>
            <span className="text-sm font-medium text-ink">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
