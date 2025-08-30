import { prisma } from '@/lib/prisma';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon, 
  PlusIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  DownloadIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';

async function getClasses() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        attendances: {
          include: { athlete: true }
        }
      },
      orderBy: { startTime: 'asc' }
    });
    return classes;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}

export default async function ClassesPage() {
  const classes = await getClasses();
  const now = new Date();
  const upcomingClasses = classes.filter(c => c.startTime > now);
  const pastClasses = classes.filter(c => c.startTime <= now);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
          <p className="text-gray-600 mt-1">
            Manage your BJJ classes and track attendance
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <DownloadIcon className="w-5 h-5" />
            <span>Export</span>
          </Button>
          <Link href="/classes/new">
            <Button className="flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Add Class</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.reduce((sum, c) => sum + c.attendances.filter(a => a.attended).length, 0)}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPinIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(classes.map(c => c.location).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Upcoming Classes */}
      {upcomingClasses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.slice(0, 6).map((classItem) => (
              <GlassCard key={classItem.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {classItem.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      with {classItem.instructor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(classItem.startTime), 'MMM d')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(classItem.startTime), 'h:mm a')} - {format(new Date(classItem.endTime), 'h:mm a')}
                    </p>
                  </div>
                </div>

                {classItem.location && (
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{classItem.location}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {classItem.attendances.filter(a => a.attended).length} attended
                  </span>
                  {classItem.maxStudents && (
                    <span className="text-gray-600">
                      Max: {classItem.maxStudents}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <Link href={`/classes/${classItem.id}`}>
                    <Button variant="glass" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Past Classes */}
      {pastClasses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Classes</h2>
          <div className="space-y-4">
            {pastClasses.slice(0, 5).map((classItem) => (
              <GlassCard key={classItem.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{classItem.title}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(classItem.startTime), 'MMM d, yyyy • h:mm a')} • {classItem.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {classItem.attendances.filter(a => a.attended).length} attended
                    </p>
                    <Link href={`/classes/${classItem.id}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {classes.length === 0 && (
        <GlassCard className="p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No classes scheduled
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your class schedule by adding your first BJJ class.
          </p>
          <Link href="/classes/new">
            <Button className="flex items-center space-x-2 mx-auto">
              <PlusIcon className="w-5 h-5" />
              <span>Add First Class</span>
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
