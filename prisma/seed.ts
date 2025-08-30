import { PrismaClient, BeltColor, MoveCategory, Difficulty, ProgressStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample athletes
  const athletes = await Promise.all([
    prisma.athlete.create({
      data: {
        name: 'John Silva',
        email: 'john@example.com',
        belt: BeltColor.BLUE,
        weight: 180,
      },
    }),
    prisma.athlete.create({
      data: {
        name: 'Maria Rodriguez',
        email: 'maria@example.com',
        belt: BeltColor.PURPLE,
        weight: 140,
      },
    }),
    prisma.athlete.create({
      data: {
        name: 'Carlos Martinez',
        email: 'carlos@example.com',
        belt: BeltColor.WHITE,
        weight: 200,
      },
    }),
    prisma.athlete.create({
      data: {
        name: 'Ana Santos',
        email: 'ana@example.com',
        belt: BeltColor.BROWN,
        weight: 130,
      },
    }),
  ]);

  console.log(`✅ Created ${athletes.length} athletes`);

  // Create sample classes
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        title: 'Fundamentals Class',
        description: 'Basic BJJ techniques for beginners',
        instructor: 'Professor Silva',
        startTime: new Date('2024-01-15T18:00:00'),
        endTime: new Date('2024-01-15T19:00:00'),
        location: 'Main Mat',
        maxStudents: 20,
      },
    }),
    prisma.class.create({
      data: {
        title: 'Advanced Techniques',
        description: 'Advanced submissions and transitions',
        instructor: 'Coach Rodriguez',
        startTime: new Date('2024-01-15T19:30:00'),
        endTime: new Date('2024-01-15T20:30:00'),
        location: 'Main Mat',
        maxStudents: 15,
      },
    }),
    prisma.class.create({
      data: {
        title: 'No-Gi Training',
        description: 'No-gi grappling and submissions',
        instructor: 'Professor Silva',
        startTime: new Date('2024-01-16T18:00:00'),
        endTime: new Date('2024-01-16T19:30:00'),
        location: 'Main Mat',
        maxStudents: 25,
      },
    }),
    prisma.class.create({
      data: {
        title: 'Competition Prep',
        description: 'Competition-focused training',
        instructor: 'Coach Martinez',
        startTime: new Date('2024-01-17T19:00:00'),
        endTime: new Date('2024-01-17T20:30:00'),
        location: 'Main Mat',
        maxStudents: 12,
      },
    }),
  ]);

  console.log(`✅ Created ${classes.length} classes`);

  // Create sample moves
  const moves = await Promise.all([
    prisma.move.create({
      data: {
        name: 'Armbar from Guard',
        description: 'Classic armbar submission from closed guard',
        category: MoveCategory.SUBMISSIONS,
        difficulty: Difficulty.BEGINNER,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Triangle Choke',
        description: 'Triangle choke from guard or mount',
        category: MoveCategory.SUBMISSIONS,
        difficulty: Difficulty.INTERMEDIATE,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Hip Escape',
        description: 'Fundamental movement to create space',
        category: MoveCategory.ESCAPES,
        difficulty: Difficulty.BEGINNER,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Knee Shield Pass',
        description: 'Passing the guard using knee shield',
        category: MoveCategory.PASSING,
        difficulty: Difficulty.INTERMEDIATE,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Scissor Sweep',
        description: 'Sweep from closed guard using scissor motion',
        category: MoveCategory.SWEEPS,
        difficulty: Difficulty.BEGINNER,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Rear Naked Choke',
        description: 'Choke from back control',
        category: MoveCategory.SUBMISSIONS,
        difficulty: Difficulty.INTERMEDIATE,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Single Leg Takedown',
        description: 'Basic wrestling takedown',
        category: MoveCategory.TAKEDOWNS,
        difficulty: Difficulty.BEGINNER,
      },
    }),
    prisma.move.create({
      data: {
        name: 'Berimbolo',
        description: 'Advanced guard technique to take the back',
        category: MoveCategory.GUARD,
        difficulty: Difficulty.EXPERT,
      },
    }),
  ]);

  console.log(`✅ Created ${moves.length} moves`);

  // Create sample attendance records
  const attendances = [];
  for (const athlete of athletes) {
    for (const classItem of classes) {
      const attended = Math.random() > 0.3; // 70% attendance rate
      if (attended) {
        attendances.push(
          prisma.classAttendance.create({
            data: {
              athleteId: athlete.id,
              classId: classItem.id,
              attended: true,
              notes: attended ? 'Great class!' : null,
            },
          })
        );
      }
    }
  }

  await Promise.all(attendances);
  console.log(`✅ Created ${attendances.length} attendance records`);

  // Create sample move progress
  const progressRecords = [];
  for (const athlete of athletes) {
    for (const move of moves) {
      const statuses = [ProgressStatus.NOT_LEARNED, ProgressStatus.LEARNING, ProgressStatus.LEARNED, ProgressStatus.MASTERED];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      if (status !== ProgressStatus.NOT_LEARNED) {
        progressRecords.push(
          prisma.moveProgress.create({
            data: {
              athleteId: athlete.id,
              moveId: move.id,
              status,
              notes: status === ProgressStatus.MASTERED ? 'Mastered this technique!' : null,
              lastPracticed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            },
          })
        );
      }
    }
  }

  await Promise.all(progressRecords);
  console.log(`✅ Created ${progressRecords.length} progress records`);

  // Create sample mind maps
  const mindMaps = await Promise.all([
    prisma.mindMap.create({
      data: {
        name: 'Guard Game Plan',
        athleteId: athletes[0].id,
      },
    }),
    prisma.mindMap.create({
      data: {
        name: 'Submission Chain',
        athleteId: athletes[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${mindMaps.length} mind maps`);

  // Create sample mind map nodes
  const nodes = await Promise.all([
    prisma.mindMapNode.create({
      data: {
        mindMapId: mindMaps[0].id,
        moveId: moves[0].id, // Armbar from Guard
        title: 'Armbar Setup',
        x: 100,
        y: 100,
      },
    }),
    prisma.mindMapNode.create({
      data: {
        mindMapId: mindMaps[0].id,
        moveId: moves[1].id, // Triangle Choke
        title: 'Triangle Transition',
        x: 300,
        y: 100,
      },
    }),
    prisma.mindMapNode.create({
      data: {
        mindMapId: mindMaps[0].id,
        title: 'Guard Retention',
        x: 200,
        y: 200,
      },
    }),
  ]);

  console.log(`✅ Created ${nodes.length} mind map nodes`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
