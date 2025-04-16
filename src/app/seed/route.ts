import { Sprint, User, TaskTime } from '@/payload-types'
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
  await createTaskTimes(payload)

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
      name: 'Sprint #1 - Past sprint',
      startDate: '2025-03-17T00:00:00.000Z',
      endDate: '2025-03-21T00:00:00.000Z',
      velocity: 3,
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

async function createTaskTimes(payload: Payload) {
  const taskTimes: Omit<TaskTime, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>[] = [
    {
      user: 1,
      task: '1',
      start: '2025-04-05T08:02:00.000Z',
      end: '2025-04-05T12:59:00.000Z',
    },
    {
      user: 1,
      task: '2',
      start: '2025-04-21T00:00:00.000Z',
      end: '2025-04-13T12:00:00.000Z',
    },
    {
      user: 1,
      task: '1',
      start: '2025-04-03T09:00:00.000Z',
      end: '2025-04-03T10:02:00.000Z',
    },
    {
      user: 1,
      task: '1',
      start: '2025-04-03T11:00:00.000Z',
      customHMS: '2h 32m 40s',
    },
    {
      user: 1,
      task: '1',
      start: '2025-04-03T11:00:03.000Z',
      customHMS: '- 1h 2m 0s',
    },
    {
      user: 1,
      task: '1',
      start: '2025-04-05T14:10:00.000Z',
    },
  ]

  for (let i = 0; i < taskTimes.length; i++) {
    await payload
      .create({
        collection: 'taskTimes',
        data: taskTimes[i],
      })
      .catch((error) => {
        // Gracefully fail, if the sprint already exists
        console.error(error)
      })
  }
}
