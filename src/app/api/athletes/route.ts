import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BeltColor } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, belt, weight } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate belt color
    const validBelts: BeltColor[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];
    if (belt && !validBelts.includes(belt)) {
      return NextResponse.json(
        { error: 'Invalid belt color' },
        { status: 400 }
      );
    }

    // Create athlete
    const athlete = await prisma.athlete.create({
      data: {
        name,
        email: email || null,
        belt: belt || 'WHITE',
        weight: weight || null,
      },
    });

    return NextResponse.json(athlete, { status: 201 });
  } catch (error) {
    console.error('Error creating athlete:', error);
    return NextResponse.json(
      { error: 'Failed to create athlete' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        attendances: {
          where: { attended: true },
        },
        progress: {
          include: { move: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(athletes);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
}
