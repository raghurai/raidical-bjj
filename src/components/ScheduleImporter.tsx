'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import Input from './ui/Input';
import { 
  CloudArrowDownIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface ImportedClass {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  endTime: string;
  location: string;
  maxStudents: number;
}

interface ImportResult {
  success: boolean;
  imported: number;
  total: number;
  classes: ImportedClass[];
}

export default function ScheduleImporter() {
  const [url, setUrl] = useState('https://bjjsanjose.com/schedule/');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/import-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to import schedule');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CloudArrowDownIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Import Class Schedule
            </h2>
            <p className="text-gray-600">
              Automatically fetch and import class schedules from external websites
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://bjjsanjose.com/schedule/"
            icon={<CloudArrowDownIcon className="w-5 h-5" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date (Optional)"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date (Optional)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleImport}
              loading={loading}
              className="flex items-center space-x-2"
            >
              <CloudArrowDownIcon className="w-5 h-5" />
              <span>Import Schedule</span>
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Import Successful
                  </h3>
                  <p className="text-gray-600">
                    {result.imported} of {result.total} classes imported
                  </p>
                </div>
              </div>

              {result.classes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Imported Classes:</h4>
                  <div className="space-y-2">
                    {result.classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {classItem.title}
                            </h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{classItem.instructor}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatDateTime(classItem.startTime)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>{classItem.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            Max: {classItem.maxStudents}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6 border-red-200 bg-red-50/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    Import Failed
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          How it works
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Enter the URL of the website containing the class schedule</p>
          <p>• Optionally specify a date range to import only specific dates</p>
          <p>• The system will automatically parse and import class information</p>
          <p>• Duplicate classes (same title, instructor, and time) will be skipped</p>
        </div>
      </GlassCard>
    </div>
  );
}
