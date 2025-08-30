'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { BeltColor } from '@prisma/client';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const beltOptions = [
  { value: 'WHITE', label: 'White Belt', color: 'bg-belt-white text-gray-800' },
  { value: 'BLUE', label: 'Blue Belt', color: 'bg-belt-blue text-white' },
  { value: 'PURPLE', label: 'Purple Belt', color: 'bg-belt-purple text-white' },
  { value: 'BROWN', label: 'Brown Belt', color: 'bg-belt-brown text-white' },
  { value: 'BLACK', label: 'Black Belt', color: 'bg-belt-black text-white' },
];

export default function NewAthletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    belt: 'WHITE' as BeltColor,
    weight: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/athletes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        }),
      });

      if (response.ok) {
        router.push('/athletes');
      } else {
        console.error('Failed to create athlete');
      }
    } catch (error) {
      console.error('Error creating athlete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/athletes">
          <Button variant="secondary" className="flex items-center space-x-2">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Athlete</h1>
          <p className="text-gray-600 mt-1">
            Create a new student profile for your BJJ academy
          </p>
        </div>
      </div>

      {/* Form */}
      <GlassCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Athlete Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter athlete's full name"
            />

            <Input
              label="Email (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="athlete@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belt Rank
              </label>
              <select
                name="belt"
                value={formData.belt}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
              >
                {beltOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Weight (lbs)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              placeholder="150"
              min="0"
              step="0.1"
            />
          </div>

          {/* Belt Preview */}
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Belt Preview:</p>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                beltOptions.find(b => b.value === formData.belt)?.color
              }`}>
                <span className="text-xs font-bold">
                  {beltOptions.find(b => b.value === formData.belt)?.label.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {beltOptions.find(b => b.value === formData.belt)?.label}
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
            <Link href="/athletes">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={loading}>
              Create Athlete
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
