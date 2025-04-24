import { Sprint, User, TaskTime, Story } from '@/payload-types'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'
import { defaultDocumentation } from './default_documentation'

// Seed the databse with test data
export async function GET() {
  const payload = await getPayload({ config })

  await createAdmin(payload)
  await createTestUsers(payload)
  await createProjects(payload)
  await createSprints(payload)
  await createStories(payload)

  return NextResponse.json({ success: true })
}

// Funkcije za pridobivanje slovenskih imen in priimkov
function getIme(index: number) {
  const imenaM = ['Luka', 'Marko', 'Janez', 'Matej', 'Andrej']
  const imenaZ = ['Maja', 'Nina', 'Ana', 'Mojca', 'Barbara']

  return index % 2 === 0
    ? imenaM[Math.floor(index / 2) % imenaM.length]
    : imenaZ[Math.floor(index / 2) % imenaZ.length]
}

function getPriimek(index: number) {
  const priimki = [
    'Novak',
    'Kovačič',
    'Horvat',
    'Kranjc',
    'Zupančič',
    'Košir',
    'Potočnik',
    'Vidmar',
    'Krajnc',
    'Golob',
  ]

  return priimki[index % priimki.length]
}

function getUsername(index: number) {
  // Kreiraj uporabniško ime iz imena in priimka
  const ime = getIme(index).toLowerCase()
  const priimek = getPriimek(index).toLowerCase()

  // Različne variante uporabniških imen
  const variants = [
    `${ime}.${priimek}`,
    `${ime}${priimek[0]}`,
    `${ime[0]}${priimek}`,
    `${priimek}${ime[0]}`,
    `${ime}123`,
  ]

  return variants[index % variants.length]
}

function generateEmail(index: number) {
  const ime = getIme(index).toLowerCase()
  const priimek = getPriimek(index).toLowerCase()
  const domains = ['gmail.com', 'siol.net', 'outlook.com', 'arnes.si', 'yahoo.com']

  return `${ime}.${priimek}@${domains[index % domains.length]}`
}

async function createTestUsers(payload: Payload) {
  for (let i = 0; i < 10; i++) {
    const user: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
      username: getUsername(i),
      surname: getPriimek(i),
      name: getIme(i),
      password: `test`,
      email: generateEmail(i),
      role: 'user',
    }

    await payload.create({
      collection: 'users',
      data: user,
    })
  }
}

async function createAdmin(payload: Payload) {
  const admin: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
    username: 'admin',
    surname: 'Surname',
    name: 'Name',
    password: 'admin',
    email: 'admin@example.com',
    role: 'admin',
  }

  await payload
    .create({
      collection: 'users',
      data: admin,
    })
    .catch((error) => {
      // Gracefully fail, if admin already exists
      console.error(error)
    })
}

async function createProjects(payload: Payload) {
  const names = [
    {
      name: 'Prenova spletne trgovine',
    },
    {
      name: 'Digitalizacija arhiva',
    },
    {
      name: 'Razvoj mobilne aplikacije Zdravko',
    },
    {
      name: 'Implementacija CRM sistema',
    },
  ]

  for (let i = 0; i < names.length; i++) {
    await payload
      .create({
        collection: 'projects',
        data: {
          name: names[i].name,
          members: [
            {
              user: i + 1,
              role: 'scrum_master',
            },
            {
              user: i + 2,
              role: 'product_owner',
            },
            {
              user: i + 3,
              role: 'developer',
            },
          ],
          documentation: defaultDocumentation,
        },
      })
      .catch((error) => {
        console.error(error)
      })

    await payload
      .create({
        collection: 'wall-messages',
        data: {
          project: i,
          message:
            'Dragi sodelavci, včeraj sem zaključil integracijo novega CRM sistema z našo obstoječo bazo strank. Vse deluje kot načrtovano, a prosim, da vsi preverite dostope do svojih računov in mi sporočite morebitne težave. Za naslednji teden načrtujem še izobraževanje za celotno prodajno ekipo. Pripravil bom kratek priročnik z najpogostejšimi vprašanji. Lep pozdrav, Marko',
          username: 'Name (methodology manager)',
          createdAt: new Date().toDateString(),
        },
      })
      .catch((error) => {
        console.error(error)
      })

    await payload
      .create({
        collection: 'wall-messages',
        data: {
          project: i,
          message:
            'Pozdravljeni! Ravnokar sem dodala najnovejše oblikovne predloge za mobilno aplikacijo Zdravko v skupno mapo na Drivu. Upoštevala sem vse prejšnje komentarje glede barvne sheme in postavitve navigacijskih gumbov. Prosim za povratne informacije do petka, da lahko do konca meseca zaključimo z oblikovanjem in začnemo z implementacijo. Hvala vsem za sodelovanje! Nina',
          username: 'another (developer)',
          createdAt: new Date().toDateString(),
        },
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

async function createSprints(payload: Payload) {
  const sprints: Omit<Sprint, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>[] = [
    {
      name: 'P1: Sprint #1 - Past sprint',
      startDate: '2025-04-21T00:00:00.000Z',
      endDate: '2025-04-21T00:00:00.000Z',
      velocity: 4,
      project: 1,
    },
    {
      name: 'P1: Sprint #2 - Current sprint',
      startDate: '2025-04-21T00:00:00.000Z',
      endDate: '2025-05-21T00:00:00.000Z',
      velocity: 4,
      project: 1,
    },
    {
      name: 'P1: Sprint #3 - Future sprint',
      startDate: '2025-05-21T00:00:00.000Z',
      endDate: '2025-06-21T00:00:00.000Z',
      velocity: 4,
      project: 1,
    },
    {
      name: 'Sprint #2 - Current sprint',
      startDate: '2025-03-21T00:00:00.000Z',
      endDate: '2025-06-13T12:00:00.000Z',
      velocity: 6,
      project: 2,
    },
    {
      name: 'Sprint #3 - Future sprint',
      startDate: '2025-07-23T00:00:00.000Z',
      endDate: '2025-07-27T00:00:00.000Z',
      velocity: 4,
      project: 3,
    },
    {
      name: 'Sprint #4',
      startDate: '2025-06-16T00:00:00.000Z',
      endDate: '2025-06-20T00:00:00.000Z',
      velocity: 5,
      project: 2,
    },
  ]

  for (let i = 0; i < sprints.length; i++) {
    await payload
      .create({
        collection: 'sprints',
        data: sprints[i],
      })
      .catch((error) => {
        // Gracefully fail, if the sprint already exists
        console.error(error)
      })
  }
}

async function createStories(payload: Payload) {
  const stories: Omit<Story, 'createdAt' | 'updatedAt'>[] = [
    // Sprint 1 Stories
    {
      id: 1,
      title: 'P1: Story #1',
      titleLowerCase: 'p1: story #1',
      description: 'Implement the login functionality for the application.',
      acceptanceTests: [{ test: 'User can log in with valid credentials.', id: '1' }],
      priority: 'must have',
      businessValue: 10,
      project: 1,
      sprint: 1,
      timeEstimate: 3,
    },
    {
      id: 2,
      title: 'P1: Story #2',
      titleLowerCase: 'p1: story #2',
      description: 'Design the homepage layout with responsive design.',
      acceptanceTests: [{ test: 'Homepage adjusts correctly on mobile and desktop.', id: '2' }],
      priority: 'should have',
      businessValue: 8,
      project: 1,
      sprint: null,
      timeEstimate: null,
    },
    {
      id: 3,
      title: 'P1: Story #3',
      titleLowerCase: 'p1: story #3',
      description: 'Set up the database schema for user accounts.',
      acceptanceTests: [{ test: 'Database schema supports all required user fields.', id: '3' }],
      priority: 'must have',
      businessValue: 9,
      project: 1,
      sprint: 1,
      timeEstimate: 4,
    },

    // Sprint 2 Stories
    {
      id: 4,
      title: 'P1: Story #4',
      titleLowerCase: 'p1: story #4',
      description: 'Integrate payment gateway for online transactions.',
      acceptanceTests: [{ test: 'Users can complete payments successfully.', id: '4' }],
      priority: 'must have',
      businessValue: 12,
      project: 1,
      sprint: 2,
      timeEstimate: 0,
    },
    {
      id: 5,
      title: 'P1: Story #5',
      titleLowerCase: 'p1: story #5',
      description: 'Create a user profile page with editable fields.',
      acceptanceTests: [{ test: 'Users can update their profile information.', id: '5' }],
      priority: 'should have',
      businessValue: 7,
      project: 1,
      sprint: 2,
      timeEstimate: 4,
    },
    {
      id: 6,
      title: 'P1: Story #6',
      titleLowerCase: 'p1: story #6',
      description: 'Implement email notifications for account activities.',
      acceptanceTests: [{ test: 'Users receive email notifications for updates.', id: '6' }],
      priority: 'could have',
      businessValue: 5,
      project: 1,
      sprint: null,
      timeEstimate: 3,
    },

    // Sprint 3 Stories
    {
      id: 7,
      title: 'P1: Story #7',
      titleLowerCase: 'p1: story #7',
      description: 'Develop the admin dashboard for managing users.',
      acceptanceTests: [{ test: 'Admin can view and manage user accounts.', id: '7' }],
      priority: 'must have',
      businessValue: 15,
      project: 1,
      sprint: 3,
      timeEstimate: 8,
    },
    {
      id: 8,
      title: 'P1: Story #8',
      titleLowerCase: 'p1: story #8',
      description: 'Optimize the application for faster load times.',
      acceptanceTests: [{ test: 'Page load times are under 2 seconds.', id: '8' }],
      priority: 'should have',
      businessValue: 10,
      project: 1,
      sprint: null,
      timeEstimate: 0,
    },
    {
      id: 9,
      title: 'P1: Story #9',
      titleLowerCase: 'p1: story #9',
      description: 'Add multi-language support for the application.',
      acceptanceTests: [{ test: 'Users can switch between supported languages.', id: '9' }],
      priority: 'could have',
      businessValue: 6,
      project: 1,
      sprint: 3,
      timeEstimate: 0,
    },
  ];

  for (let i = 0; i < stories.length; i++) {
    await payload
      .create({
        collection: 'stories',
        data: stories[i],
      })
      .catch((error) => {
        // Gracefully fail, if the story already exists
        console.error(error);
      });
  }
}
