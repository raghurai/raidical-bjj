import { prisma } from '@/lib/prisma';
import GlassCard from '@/components/ui/GlassCard';
import BeltBadge from '@/components/ui/BeltBadge';
import Button from '@/components/ui/Button';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

async function getAthletes() {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        attendances: {
          where: { attended: true },
          include: { class: true }
        },
        progress: {
          include: { move: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return athletes;
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return [];
  }
}

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Athletes</h1>
          <p className="text-gray-600 mt-1">
            Manage your BJJ students and track their progress
          </p>
        </div>
        <Link href="/athletes/new">
          <Button className="flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Add Athlete</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Athletes</p>
              <p className="text-2xl font-bold text-gray-900">{athletes.length}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 bg-belt-blue rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Blue Belts</p>
              <p className="text-2xl font-bold text-gray-900">
                {athletes.filter(a => a.belt === 'BLUE').length}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <div className="w-6 h-6 bg-belt-purple rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Purple Belts</p>
              <p className="text-2xl font-bold text-gray-900">
                {athletes.filter(a => a.belt === 'PURPLE').length}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <div className="w-6 h-6 bg-belt-black rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Black Belts</p>
              <p className="text-2xl font-bold text-gray-900">
                {athletes.filter(a => a.belt === 'BLACK').length}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Athletes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete) => (
          <GlassCard key={athlete.id} className="p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {athlete.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{athlete.name}</h3>
                  <p className="text-sm text-gray-600">
                    Joined {new Date(athlete.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <BeltBadge belt={athlete.belt} size="sm" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">
                  {athlete.weight ? `${athlete.weight} lbs` : 'Not set'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Classes Attended:</span>
                <span className="font-medium">{athlete.attendances.length}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Moves Learned:</span>
                <span className="font-medium">
                  {athlete.progress.filter(p => p.status === 'LEARNED' || p.status === 'MASTERED').length}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <Link href={`/athletes/${athlete.id}`}>
                <Button variant="glass" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {athletes.length === 0 && (
        <GlassCard className="p-12 text-center">
          <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No athletes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first BJJ student to the system.
          </p>
          <Link href="/athletes/new">
            <Button className="flex items-center space-x-2 mx-auto">
              <PlusIcon className="w-5 h-5" />
              <span>Add First Athlete</span>
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
