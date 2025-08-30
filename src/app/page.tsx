import { prisma } from '@/lib/prisma';
import GlassCard from '@/components/ui/GlassCard';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

async function getDashboardStats() {
  try {
    const [
      totalAthletes,
      totalClasses,
      totalMoves,
      recentAttendances,
      upcomingClasses
    ] = await Promise.all([
      prisma.athlete.count(),
      prisma.class.count(),
      prisma.move.count(),
      prisma.classAttendance.count({
        where: {
          attended: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      prisma.class.count({
        where: {
          startTime: {
            gte: new Date()
          }
        }
      })
    ]);

    return {
      totalAthletes,
      totalClasses,
      totalMoves,
      recentAttendances,
      upcomingClasses
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalAthletes: 0,
      totalClasses: 0,
      totalMoves: 0,
      recentAttendances: 0,
      upcomingClasses: 0
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats();

  const kpiCards = [
    {
      title: 'Total Athletes',
      value: stats.totalAthletes,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Classes Scheduled',
      value: stats.totalClasses,
      icon: CalendarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Moves in Library',
      value: stats.totalMoves,
      icon: BookOpenIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Recent Attendances',
      value: stats.recentAttendances,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Raidical BJJ
        </h1>
        <p className="text-lg text-gray-600">
          Your comprehensive Brazilian Jiu-Jitsu training management system
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <GlassCard key={kpi.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Add New Athlete</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Schedule Class</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <BookOpenIcon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Add Move to Library</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">View Progress Reports</span>
              </div>
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {stats.recentAttendances} classes attended this week
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {stats.upcomingClasses} upcoming classes scheduled
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {stats.totalMoves} moves available in curriculum
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Training Progress */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Training Progress Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Belt Progression</h3>
            <p className="text-sm text-gray-600">Track your journey to the next belt</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Move Mastery</h3>
            <p className="text-sm text-gray-600">Learn and master new techniques</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Performance Analytics</h3>
            <p className="text-sm text-gray-600">Analyze your training patterns</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}