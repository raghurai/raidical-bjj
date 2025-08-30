import { prisma } from '@/lib/prisma';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { 
  BookOpenIcon, 
  PlusIcon, 
  FunnelIcon,
  PlayIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MoveCategory, Difficulty } from '@prisma/client';

async function getMoves() {
  try {
    const moves = await prisma.move.findMany({
      include: {
        progress: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return moves;
  } catch (error) {
    console.error('Error fetching moves:', error);
    return [];
  }
}

const categoryColors = {
  GUARD: 'bg-blue-100 text-blue-800',
  PASSING: 'bg-green-100 text-green-800',
  MOUNT: 'bg-purple-100 text-purple-800',
  SIDE_CONTROL: 'bg-orange-100 text-orange-800',
  BACK_CONTROL: 'bg-red-100 text-red-800',
  SUBMISSIONS: 'bg-pink-100 text-pink-800',
  ESCAPES: 'bg-yellow-100 text-yellow-800',
  TAKEDOWNS: 'bg-indigo-100 text-indigo-800',
  SWEEPS: 'bg-teal-100 text-teal-800',
  TRANSITIONS: 'bg-gray-100 text-gray-800',
};

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-orange-100 text-orange-800',
  EXPERT: 'bg-red-100 text-red-800',
};

export default async function CurriculumPage() {
  const moves = await getMoves();

  const categoryStats = Object.values(MoveCategory).map(category => ({
    category,
    count: moves.filter(m => m.category === category).length,
    color: categoryColors[category]
  }));

  const difficultyStats = Object.values(Difficulty).map(difficulty => ({
    difficulty,
    count: moves.filter(m => m.difficulty === difficulty).length,
    color: difficultyColors[difficulty]
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your BJJ techniques and track learning progress
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5" />
            <span>Filter</span>
          </Button>
          <Link href="/curriculum/new">
            <Button className="flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Add Move</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Moves</p>
              <p className="text-2xl font-bold text-gray-900">{moves.length}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <StarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mastered</p>
              <p className="text-2xl font-bold text-gray-900">
                {moves.reduce((sum, m) => sum + m.progress.filter(p => p.status === 'MASTERED').length, 0)}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PlayIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {moves.reduce((sum, m) => sum + m.progress.filter(p => p.status === 'LEARNING').length, 0)}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Drill Sessions</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">By Category</h2>
          <div className="space-y-3">
            {categoryStats.map(({ category, count, color }) => (
              <div key={category} className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                  {category.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">By Difficulty</h2>
          <div className="space-y-3">
            {difficultyStats.map(({ difficulty, count, color }) => (
              <div key={difficulty} className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                  {difficulty}
                </span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Moves Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Moves</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moves.map((move) => (
            <GlassCard key={move.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {move.name}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[move.category]}`}>
                      {move.category.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[move.difficulty]}`}>
                      {move.difficulty}
                    </span>
                  </div>
                </div>
                <Button variant="glass" size="sm" className="flex items-center space-x-1">
                  <PlayIcon className="w-4 h-4" />
                  <span>Drill</span>
                </Button>
              </div>

              {move.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {move.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Learning Progress:</span>
                  <span className="font-medium">
                    {move.progress.filter(p => p.status === 'LEARNED' || p.status === 'MASTERED').length} / {move.progress.length}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mastered:</span>
                  <span className="font-medium text-green-600">
                    {move.progress.filter(p => p.status === 'MASTERED').length}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <Link href={`/curriculum/${move.id}`}>
                  <Button variant="glass" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {moves.length === 0 && (
        <GlassCard className="p-12 text-center">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No moves in library
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your BJJ curriculum by adding your first technique.
          </p>
          <Link href="/curriculum/new">
            <Button className="flex items-center space-x-2 mx-auto">
              <PlusIcon className="w-5 h-5" />
              <span>Add First Move</span>
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
