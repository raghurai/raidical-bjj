import { prisma } from '@/lib/prisma';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { 
  MapIcon, 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

async function getMindMaps() {
  try {
    const mindMaps = await prisma.mindMap.findMany({
      include: {
        athlete: true,
        nodes: {
          include: { move: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return mindMaps;
  } catch (error) {
    console.error('Error fetching mind maps:', error);
    return [];
  }
}

export default async function MindMapsPage() {
  const mindMaps = await getMindMaps();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mind Maps</h1>
          <p className="text-gray-600 mt-1">
            Create visual strategy maps to connect BJJ techniques and game plans
          </p>
        </div>
        <Link href="/mind-maps/new">
          <Button className="flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Create Mind Map</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mind Maps</p>
              <p className="text-2xl font-bold text-gray-900">{mindMaps.length}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 bg-belt-blue rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Nodes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mindMaps.reduce((sum, mm) => sum + mm.nodes.length, 0)}
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
              <p className="text-sm text-gray-600">Connected Moves</p>
              <p className="text-2xl font-bold text-gray-900">
                {mindMaps.reduce((sum, mm) => sum + mm.nodes.filter(n => n.moveId).length, 0)}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Mind Maps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mindMaps.map((mindMap) => (
          <GlassCard key={mindMap.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {mindMap.name}
                </h3>
                <p className="text-sm text-gray-600">
                  by {mindMap.athlete.name}
                </p>
              </div>
              <div className="flex space-x-1">
                <Link href={`/mind-maps/${mindMap.id}`}>
                  <Button variant="glass" size="sm" className="p-2">
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/mind-maps/${mindMap.id}/edit`}>
                  <Button variant="glass" size="sm" className="p-2">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="glass" size="sm" className="p-2 text-red-600 hover:text-red-700">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nodes:</span>
                <span className="font-medium">{mindMap.nodes.length}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Connected Moves:</span>
                <span className="font-medium">
                  {mindMap.nodes.filter(n => n.moveId).length}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {new Date(mindMap.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Preview of nodes */}
            {mindMap.nodes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs text-gray-600 mb-2">Recent Nodes:</p>
                <div className="flex flex-wrap gap-1">
                  {mindMap.nodes.slice(0, 3).map((node) => (
                    <span
                      key={node.id}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-gray-700"
                    >
                      {node.title}
                    </span>
                  ))}
                  {mindMap.nodes.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-700">
                      +{mindMap.nodes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/20">
              <Link href={`/mind-maps/${mindMap.id}`}>
                <Button variant="glass" className="w-full">
                  Open Mind Map
                </Button>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {mindMaps.length === 0 && (
        <GlassCard className="p-12 text-center">
          <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No mind maps created
          </h3>
          <p className="text-gray-600 mb-6">
            Start visualizing your BJJ strategies by creating your first mind map.
          </p>
          <Link href="/mind-maps/new">
            <Button className="flex items-center space-x-2 mx-auto">
              <PlusIcon className="w-5 h-5" />
              <span>Create First Mind Map</span>
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
