import './style.css'

const eventContainer = document.querySelector('#events-container')

const getRandomNumberBetween = (min, max) =>
  Math.ceil(Math.random() * (max - min)) + min

const getMonth = month =>
  [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ][month]

const getDayOfWeek = day =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'][day]

const isAM = hour => hour < 12

const getHour = hour => hour % 12 || 12

const getMinute = minute => (minute === 0 ? '00' : minute)

function processDate(date) {
  const hour = getHour(date.getHours()) || false
  const minute = getMinute(date.getMinutes()) || false
  const ampm = isAM(date.getHours()) ? 'am' : 'pm' || false

  const time = hour && hour + ':' + minute + ampm

  return {
    month: getMonth(date.getMonth()),
    weekday: getDayOfWeek(date.getDay()),
    day: date.getDate(),
    time
  }
}

function mapEventObject(event) {
  const startDate = event.start.dateTime
    ? processDate(new Date(event.start.dateTime))
    : processDate(new Date(`${event.start.date}T00:00:00`))

  const endDate = event.end.dateTime
    ? processDate(new Date(event.end.dateTime))
    : processDate(new Date(`${event.end.date}T00:00:00`))

  let dateRange
  if (startDate.date !== endDate.date) {
    dateRange = `${startDate.month} ${startDate.day} - ${endDate.month} ${endDate.day}`
  } else if (!startDate.time) {
    dateRange = `${startDate.month} ${startDate.day}`
  } else {
    dateRange = `${startDate.weekday}, ${startDate.time} - ${endDate.time}`
  }

  function getStatus(event) {
    if (event.description?.match(/cancelled/i)) {
      event.description = ''
      return 'cancelled'
    } else if (event.description?.match(/tentative/i)) {
      event.description = ''
      return 'tentative'
    } else {
      return 'confirmed'
    }
  }

  return {
    title: event.summary,
    dateRange,
    start: startDate,
    end: endDate,
    location: event.location,
    link: event.htmlLink,
    status: getStatus(event),
    description: event.description?.match(/tentative/i) ? '' : event.description
  }
}

function createEvent(e, i) {
  const colors = ['blue', 'amber', 'rose', 'indigo', 'pink']
  const colorScheme = colors[getRandomNumberBetween(0, colors.length - 1)]
  return `
  <article class="bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-800 rounded-lg">
                <div class="p-3 shadow bg-${colorScheme}-500 text-${colorScheme}-50 uppercase grid place-items-center rounded-t-lg">
                    <p class="text-sm">${e.start.month}</p>
                    <p class="text-3xl font-bold">${e.start.day}</p>
                </div>
                <div class="p-4 md:p-6 lg:p-8 grid gap-4 md:gap-6">
                    <div class="grid gap-1">
                        <p class="text-slate-300 text-sm">${e.dateRange}</p>
                        ${
                          e.status === 'tentative'
                            ? `<p class="text-orange-500 text-sm">To Be Confirmed</p>`
                            : ''
                        }
                        ${
                          e.status === 'cancelled'
                            ? `<p class="text-red-500 text-sm">CANCELLED</p>`
                            : ''
                        }
                        <h2 class="font-bold text-2xl">
                        <a class="capitalize" href="${e.link}">${e.title}</a>
                        </h2>
                        ${
                          e.location
                            ? `<p class="text-slate-300 text-sm">${e.location
                                .split(',')
                                .join(',<br />')}</p>`
                            : ''
                        }
                        ${
                          e.description
                            ? `<div class="grid gap-1">
                            <button class="text-slate-400 flex gap-1 items-center cursor-pointer" aria-expanded="false" aria-controls="details-${i}" id="btn-${i}">
                                <p class="pointer-events-none">See details</p>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 pointer-events-none transition-transform"
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div class="grid gap-1 text-slate-300 px-2 hidden" id="details-${i}" arial-labelledby="btn-${i}">
                                <p>${e.description}</p>
                            </div>
                        </div>`
                            : ''
                        }

                    </div>
                    <a href="${
                      e.link
                    }#" class="bg-${colorScheme}-500 rounded-sm px-4 py-2 text-${colorScheme}-50 shadow-2xl shadow-${colorScheme}-200 capitalize dark:shadow-none text-center font-bold hover:shadow-none ring ring-offset-0 ring-${colorScheme}-500 focus:outline-none focus:ring-offset-2 transition-all">View
            event</a>
                </div>
            </article>
  `
}

async function loadEvents(max = 8) {
  try {
    const endpoint = await fetch(
      `./.netlify/functions/calFetch?maxResults=${max}`
    )
    const data = await endpoint.json()
    const processedEvents = data.map(map => mapEventObject(map))

    eventContainer.innerHTML = processedEvents
      .map((event, i) => createEvent(event, i))
      .join('')
  } catch (e) {
    eventContainer.innerHTML = `<p class="text-center text-3xl">Error loading events</p>`
    console.log(e)
  }
}
loadEvents()

eventContainer.addEventListener('click', e => {
  if (e.target.hasAttribute('aria-expanded')) {
    e.target.setAttribute(
      'aria-expanded',
      e.target.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
    )
    e.target.querySelector('svg').classList.toggle('rotate-180')
    e.target.nextElementSibling.classList.toggle('hidden')
  }
})

const eventAmt = document.getElementById('eventAmt')
const eventsNumDisplay = document.getElementById('eventsNumDisplay')
eventAmt.addEventListener('input', e => {
  eventsNumDisplay.textContent = e.target.value
})
eventAmt.addEventListener('change', e => {
  loadEvents(e.target.value)
})
