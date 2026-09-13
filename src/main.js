import './style.css'
import './responsive.css'
import './light-theme.css'
import './rtl.css'

import { CALENDARS } from './data/calendars'
import { createCanonicalDate, convertAllCalendars } from './engine/calendar-engine'
import { getDateFacts } from './engine/date-facts'
import { getAstronomyData } from './engine/astronomy-engine'
import { getCulturalData } from './engine/cultural-engine'
import { getFictionResults } from './engine/fiction-engine'
import { FICTION_GROUP_ORDER } from './data/fiction-registry'
import { getChronologyData } from './engine/chronology-engine'
import { getRegionalCalendarData } from './engine/regional-calendar-engine'
import { getAncientCalendarData } from './engine/ancient-calendar-engine'
import { getHeritageCalendarData, getTonalpohualliData } from './engine/heritage-calendar-engine'
import { getZoroastrianDate } from './engine/zoroastrian-calendar'
import {
  bahrainHijriToIso,
  getBahrainHijriDate,
  getBahrainHijriMonthLength,
} from './engine/bahrain-calendar'
import { getSymbol, symbolBadge } from './ui/symbols'
import { mountRotatingSigil } from './ui/rotating-sigil'
import { localizeDocument } from './i18n'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="page-shell">
  <main class="site">
    <header class="atlas-header">
      <div class="header-utilities">
        <a class="tool-badge" href="https://kooheji.dev" target="_blank" rel="noopener">a kooheji.dev tool</a>
        <div class="header-switches" aria-label="Display preferences">
          <div class="compact-switch" aria-label="Colour theme">
            <button class="compact-switch-button is-active" type="button" data-theme-value="dark" aria-label="Dark view" aria-pressed="true" title="Dark view">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.7 8.7 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z"></path></svg>
            </button>
            <button class="compact-switch-button" type="button" data-theme-value="light" aria-label="Light view" aria-pressed="false" title="Light view">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>
            </button>
          </div>
          <div class="compact-switch compact-switch--language" aria-label="Language">
            <button class="compact-switch-button is-active" type="button" data-language-value="en" aria-label="English" aria-pressed="true">EN</button>
            <button class="compact-switch-button" type="button" data-language-value="ar" aria-label="Arabic" aria-pressed="false">AR</button>
          </div>
        </div>
      </div>
      <div class="hero">
        <p class="eyebrow">UNIVERSAL CHRONOLOGY ATLAS</p>
        <h1>One date. <span>Every system.</span></h1>
        <p class="hero-description">Explore a single day across calendars, chronologies, astronomy, culture, history and fiction.</p>

        <section class="date-search" aria-label="Date explorer">
          <form id="date-form">
            <fieldset class="calendar-choice">
              <legend>Date system</legend>
              <label><input type="radio" name="date-system" value="gregorian" checked><span>CE</span></label>
              <label><input type="radio" name="date-system" value="hijri"><span>AH</span></label>
            </fieldset>
            <div class="date-controls">
              <label class="date-field date-field--year"><span>Year <span class="required-marker" aria-hidden="true">*</span></span><input id="year-input" type="number" min="1" max="9999" inputmode="numeric" required></label>
              <label class="date-field date-field--month"><span>Month <span class="required-marker" aria-hidden="true">*</span></span><select id="month-input" required></select></label>
              <label class="date-field date-field--day"><span>Day <span class="required-marker" aria-hidden="true">*</span></span><select id="day-input" required></select></label>
              <label class="date-field date-field--time date-field--hour"><span>Hour</span><input id="hour-input" type="number" min="0" max="23" list="hour-options" inputmode="numeric" placeholder="—"></label>
              <label class="date-field date-field--time date-field--minute"><span>Minute</span><input id="minute-input" type="number" min="0" max="59" list="minute-options" inputmode="numeric" placeholder="—"></label>
              <div class="date-field date-field--location"><label for="location-input">Location</label><span class="location-control"><input id="location-input" type="text" autocomplete="off" placeholder="City or coordinates"><button id="use-location" class="location-button" type="button" aria-label="Use current location" title="Use current location"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path></svg></button></span><span id="location-status" class="visually-hidden" aria-live="polite"></span></div>
              <button type="submit">Explore Date</button>
            </div>
            <datalist id="hour-options">${Array.from({ length: 24 }, (_, hour) => `<option value="${hour}"></option>`).join('')}</datalist>
            <datalist id="minute-options">${Array.from({ length: 60 }, (_, minute) => `<option value="${minute}"></option>`).join('')}</datalist>
          </form>
        </section>
      </div>
    </header>

    <nav class="atlas-tabs" aria-label="Atlas sections" role="tablist">
      <button id="tab-overview" class="atlas-tab" type="button" role="tab" aria-selected="true" aria-controls="overview" data-panel="overview">Overview</button>
      <button id="tab-calendars" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="calendar-section" data-panel="calendar-section" tabindex="-1">Calendars</button>
      <button id="tab-chronology" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="chronology-section" data-panel="chronology-section" tabindex="-1">Chronology</button>
      <button id="tab-sky" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="astronomy-section" data-panel="astronomy-section" tabindex="-1">Sky</button>
      <button id="tab-traditions" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="culture-section" data-panel="culture-section" tabindex="-1">Traditions</button>
      <button id="tab-fiction" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="fiction-section" data-panel="fiction-section" tabindex="-1">Fiction</button>
    </nav>

    <div class="atlas-workspace">
<section
  id="overview"
  class="atlas-panel overview"
  role="tabpanel"
  aria-labelledby="tab-overview"
  tabindex="0"
>

  <!-- =====================================
       GREGORIAN HALF
  ====================================== -->

  <article class="date-profile date-profile--gregorian">

    <div
      class="sigil-stage"
      data-sigil="gregorian-armillary"
      aria-hidden="true"
    ></div>

    <div class="date-profile-main">

      <div class="date-profile-copy">

        <span class="section-label">
          GREGORIAN
        </span>

        <h2 id="hero-date"></h2>

      </div>

    </div>


    <div class="profile-facts">

      <div class="profile-fact">
        <span>Weekday</span>
        <strong id="hero-weekday"></strong>
      </div>

      <div class="profile-fact">
        <span>Day of year</span>
        <strong id="gregorian-day-of-year"></strong>
      </div>

      <div class="profile-fact">
        <span>Days remaining</span>
        <strong id="gregorian-days-remaining"></strong>
      </div>

      <div class="profile-fact">
        <span>Leap year</span>
        <strong id="gregorian-leap-year"></strong>
      </div>

    </div>


    <div class="overview-month">

      <div class="month-card">

        <div class="month-card-header">

          <div>

            <span class="month-card-kicker">
              MONTH
            </span>

            <h3
              id="gregorian-month-title"
              class="month-card-title"
            ></h3>

            <p
              id="gregorian-month-subtitle"
              class="month-card-subtitle"
            ></p>

          </div>

        </div>


        <div
          id="gregorian-month-grid"
          class="month-grid"
        ></div>

      </div>

    </div>

  </article>


  <!-- =====================================
       BAHRAIN HIJRI HALF
  ====================================== -->

  <article class="date-profile date-profile--hijri">

    <div
      class="sigil-stage"
      data-sigil="hijri-medina"
      aria-hidden="true"
    ></div>

    <div class="date-profile-main">

      <div class="date-profile-copy">

        <span class="section-label">
          AL ZUBARAH & BAHRAIN
        </span>

        <h2 id="hero-bahrain-hijri"></h2>

      </div>

    </div>


    <div class="profile-facts">

      <div class="profile-fact">
        <span>Day of month</span>
        <strong id="hijri-day-of-month"></strong>
      </div>

      <div class="profile-fact">
        <span>Days remaining</span>
        <strong id="hijri-days-remaining"></strong>
      </div>

      <div class="profile-fact">
        <span>Moon phase</span>
        <strong id="hijri-moon-phase"></strong>
      </div>

    </div>


    <div class="overview-month">

      <div class="month-card">

        <div class="month-card-header">

          <div>

            <span class="month-card-kicker">
              LUNAR MONTH
            </span>

            <h3
              id="hijri-month-title"
              class="month-card-title"
            ></h3>

            <p
              id="hijri-month-subtitle"
              class="month-card-subtitle"
            ></p>

          </div>

        </div>


        <div
          id="hijri-month-grid"
          class="month-grid"
        ></div>

      </div>

    </div>

  </article>

</section>

      <section id="calendar-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-calendars" tabindex="0" hidden>
        <div class="section-heading"><div><span class="section-label">CALENDARS</span><h2>Same day. Different systems.</h2><p class="section-description">Each result identifies whether it is a standard conversion, calculated model, era, cycle, reconstruction or reference.</p></div><div id="calendar-count" class="count"></div></div>
        <div id="calendar-grid" class="calendar-grid"></div>
      </section>

      <section id="chronology-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-chronology" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">CHRONOLOGY</span><h2>Different ways of numbering time.</h2><p class="section-description">Era systems, continuous day counts, scientific dating systems and historical ways of numbering time.</p></div>
          <div id="chronology-count" class="count"></div>
        </div>
        <div id="chronology-grid" class="calendar-grid"></div>
      </section>

      <section id="astronomy-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-sky" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">SKY</span><h2>The sky on this date.</h2><p id="astronomy-note" class="section-description"></p></div>
          <div class="count">5 groups · 33 properties</div>
        </div>
        <div id="astronomy-grid" class="sky-groups"></div>
      </section>

      <section id="culture-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-traditions" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">TRADITIONS</span><h2>How traditions describe this date.</h2><p class="section-description">Astrological, historical, religious, folkloric and modern-esoteric systems are identified explicitly and kept separate from astronomical observations.</p></div>
          <div id="culture-count" class="count"></div>
        </div>
        <div id="culture-grid" class="culture-grid"></div>
        <div class="culture-note"><strong>About these results</strong><p>Astrology, zodiac traditions and symbolic date systems are cultural frameworks rather than astronomical measurements. Astronomy results elsewhere in this atlas describe calculated physical positions.</p></div>
      </section>

      <section id="fiction-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-fiction" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">FICTIONAL CHRONOLOGIES</span><h2>Across imagined histories and worlds.</h2><p class="section-description">Systems are grouped by universe. Canonical conversions, approximations and unresolved real-world mappings are identified separately.</p></div>
          <div id="fiction-count" class="count"></div>
        </div>
        <div id="fiction-grid" class="culture-grid fiction-grid"></div>
      </section>
    </div>

  </main>

    <footer class="atlas-footer" aria-label="Project links">
      <div class="footer-group">
        <span class="github-mark" aria-hidden="true">
          <svg viewBox="0 0 19 19"><use href="/icons.svg#github-icon"></use></svg>
        </span>
        <span class="footer-context">Open source:</span>
        <a href="https://github.com/kooheji/universal-date-atlas" target="_blank" rel="noopener noreferrer">View this project on GitHub</a>
      </div>
      <div class="footer-group footer-support">
        <span class="footer-context">Like the tool?</span>
        <a class="support-link" href="https://ko-fi.com/kooheji" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a>
      </div>
    </footer>
  </div>
`

const $ = (selector) => document.querySelector(selector)
const themeButtons = [...document.querySelectorAll('[data-theme-value]')]
const languageButtons = [...document.querySelectorAll('[data-language-value]')]

function setTheme(theme, persist = true) {
  const selectedTheme = theme === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.theme = selectedTheme
  themeButtons.forEach((button) => {
    const isActive = button.dataset.themeValue === selectedTheme
    button.classList.toggle('is-active', isActive)
    button.setAttribute('aria-pressed', String(isActive))
  })

  if (persist) {
    try {
      localStorage.setItem('atlas-theme', selectedTheme)
    } catch {
      // The theme still works when storage is unavailable.
    }
  }
}

let initialTheme = 'dark'
try {
  initialTheme = localStorage.getItem('atlas-theme') === 'light' ? 'light' : 'dark'
} catch {
  // Keep the original dark appearance when storage is unavailable.
}
setTheme(initialTheme, false)
themeButtons.forEach((button) => button.addEventListener('click', () => {
  setTheme(button.dataset.themeValue)
  if (currentIso) exploreDate(currentIso)
}))

let currentLanguage = 'en'
try {
  currentLanguage = localStorage.getItem('atlas-language') === 'ar' ? 'ar' : 'en'
} catch {
  // Keep English when storage is unavailable.
}

function setLanguage(language, persist = true) {
  currentLanguage = language === 'ar' ? 'ar' : 'en'
  document.documentElement.lang = currentLanguage
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr'
  languageButtons.forEach((button) => {
    const isActive = button.dataset.languageValue === currentLanguage
    button.classList.toggle('is-active', isActive)
    button.setAttribute('aria-pressed', String(isActive))
  })
  localizeDocument(document, currentLanguage)

  if (persist) {
    try {
      localStorage.setItem('atlas-language', currentLanguage)
    } catch {
      // Language switching still works when storage is unavailable.
    }
  }
}

setLanguage(currentLanguage, false)
languageButtons.forEach((button) => button.addEventListener('click', () => {
  setLanguage(button.dataset.languageValue)
  if (currentIso) exploreDate(currentIso)
}))

const form = $('#date-form')
const yearInput = $('#year-input')
const monthInput = $('#month-input')
const dayInput = $('#day-input')
const hourInput = $('#hour-input')
const minuteInput = $('#minute-input')
const locationInput = $('#location-input')
const locationButton = $('#use-location')
const locationStatus = $('#location-status')
const systemInputs = [...document.querySelectorAll('input[name="date-system"]')]
const calendarGrid = $('#calendar-grid')
const chronologyGrid = $('#chronology-grid')
const astronomyGrid = $('#astronomy-grid')
const cultureGrid = $('#culture-grid')
const fictionGrid = $('#fiction-grid')
let disposeSkyMoon = () => {}
let disposeSkySun = () => {}
let disposeSkyEarth = () => {}
let disposeSkySeasons = () => {}
const heroDate =
  $('#hero-date')

const heroWeekday =
  $('#hero-weekday')

const heroBahrainHijri =
  $('#hero-bahrain-hijri')

function fitDateHeadline(element) {
  element.style.removeProperty('font-size')

  const availableWidth = element.clientWidth
  const renderedWidth = element.scrollWidth
  const baseSize = Number.parseFloat(getComputedStyle(element).fontSize)

  if (availableWidth > 0 && renderedWidth > availableWidth) {
    const fittedSize = Math.max(16, baseSize * (availableWidth / renderedWidth) * 0.98)
    element.style.fontSize = `${fittedSize}px`
  }
}

function fitOverviewDateHeadlines() {
  fitDateHeadline(heroDate)
  fitDateHeadline(heroBahrainHijri)
}


const gregorianDayOfYear =
  $('#gregorian-day-of-year')

const gregorianDaysRemaining =
  $('#gregorian-days-remaining')

const gregorianLeapYear =
  $('#gregorian-leap-year')


const hijriDayOfMonth =
  $('#hijri-day-of-month')

const hijriDaysRemaining =
  $('#hijri-days-remaining')

const hijriMoonPhase =
  $('#hijri-moon-phase')


const gregorianMonthGrid =
  $('#gregorian-month-grid')

const gregorianMonthTitle =
  $('#gregorian-month-title')

const gregorianMonthSubtitle =
  $('#gregorian-month-subtitle')


const hijriMonthGrid =
  $('#hijri-month-grid')

const hijriMonthTitle =
  $('#hijri-month-title')

const hijriMonthSubtitle =
  $('#hijri-month-subtitle')
const tabs = [...document.querySelectorAll('.atlas-tab:not(:disabled)')]
const panels = [...document.querySelectorAll('.atlas-panel')]

document.querySelectorAll('[data-sigil]').forEach((element) => {
  mountRotatingSigil(element, element.dataset.sigil)
})

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II', 'Jumada I', 'Jumada II',
  'Rajab', 'Shaʻban', 'Ramadan', 'Shawwal', 'Dhuʻl-Qiʻdah', 'Dhuʻl-Hijjah',
]

const WEEKDAY_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

let currentIso

function selectedSystem() {
  return systemInputs.find((input) => input.checked)?.value ?? 'gregorian'
}

function gregorianMonthLength(year, month) {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
}

function buildMonthCells({
  firstWeekday,
  daysInMonth,
  daysInPreviousMonth,
  selectedDay,
}) {

  const cells = []


  /*
    Previous month overflow.
  */

  for (
    let index = 0;
    index < firstWeekday;
    index += 1
  ) {

    cells.push({

      day:
        daysInPreviousMonth -
        firstWeekday +
        index +
        1,

      adjacent:
        'previous',

      selected:
        false,

    })

  }


  /*
    Current month.
  */

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {

    cells.push({

      day,

      adjacent:
        null,

      selected:
        day === selectedDay,

    })

  }


  /*
    Always finish a full calendar grid.

    Usually this produces either
    five or six visual rows.
  */

  const minimumCells =
    cells.length > 35
      ? 42
      : 35


  let nextDay =
    1


  while (
    cells.length <
    minimumCells
  ) {

    cells.push({

      day:
        nextDay,

      adjacent:
        'next',

      selected:
        false,

    })


    nextDay += 1

  }


  return cells
}

function renderMonthGrid(
  container,
  cells,
) {

  container.innerHTML = `

    ${WEEKDAY_SHORT
      .map(
        (weekday, weekdayIndex) => `
          <div class="month-weekday ${weekdayIndex >= 5 ? 'month-weekday--weekend' : ''}">
            ${weekday}
          </div>
        `,
      )
      .join('')}


    ${cells
      .map((cell, cellIndex) => {

        const classes = [
          'month-day',

          cell.adjacent
            ? 'month-day--adjacent'
            : '',

          cell.selected
            ? 'month-day--selected'
            : '',

          cellIndex % 7 >= 5
            ? 'month-day--weekend'
            : '',

        ]
          .filter(Boolean)
          .join(' ')


        return `

          <div class="${classes}">

            <span class="month-day-number">
              ${cell.day}
            </span>

          </div>

        `

      })
      .join('')}

  `
}

function renderGregorianMonth({
  year,
  month,
  day,
}) {

  const firstWeekday =
    new Date(
      Date.UTC(
        year,
        month - 1,
        1,
      ),
    )
      .getUTCDay()


  const daysInMonth =
    gregorianMonthLength(
      year,
      month,
    )


  let previousMonth =
    month - 1


  let previousYear =
    year


  if (
    previousMonth < 1
  ) {

    previousMonth =
      12

    previousYear -=
      1

  }


  const daysInPreviousMonth =
    gregorianMonthLength(
      previousYear,
      previousMonth,
    )


  const cells =
    buildMonthCells({

      firstWeekday,

      daysInMonth,

      daysInPreviousMonth,

      selectedDay:
        day,

    })


  renderMonthGrid(
    gregorianMonthGrid,
    cells,
  )


  gregorianMonthTitle.textContent =
    `${GREGORIAN_MONTHS[
      month - 1
    ]} ${year}`


  gregorianMonthSubtitle.textContent =
    'Gregorian civil calendar'
}

function previousHijriMonth(
  year,
  month,
) {

  if (
    month === 1
  ) {

    return {
      year:
        year - 1,

      month:
        12,
    }

  }


  return {
    year,

    month:
      month - 1,
  }
}


function renderBahrainHijriMonth(
  hijri,
) {

  const {
    year,
    month,
    day,
  } =
    hijri


  /*
    Convert the first day of the selected
    Bahrain Hijri month back to Gregorian.

    We only need this to discover which
    weekday column the lunar month starts on.
  */

  const firstDayIso =
    bahrainHijriToIso(
      year,
      month,
      1,
    )


  const [
    firstYear,
    firstMonth,
    firstDay,
  ] =
    firstDayIso
      .split('-')
      .map(Number)


  const firstWeekday =
    new Date(
      Date.UTC(
        firstYear,
        firstMonth - 1,
        firstDay,
      ),
    )
      .getUTCDay()


  const daysInMonth =
    getBahrainHijriMonthLength(
      year,
      month,
    )


  const previous =
    previousHijriMonth(
      year,
      month,
    )


  const daysInPreviousMonth =
    getBahrainHijriMonthLength(
      previous.year,
      previous.month,
    )


  const cells =
    buildMonthCells({

      firstWeekday,

      daysInMonth,

      daysInPreviousMonth,

      selectedDay:
        day,

    })


  renderMonthGrid(
    hijriMonthGrid,
    cells,
  )


hijriMonthTitle.textContent =
  `${HIJRI_MONTHS[
    month - 1
  ]} ${year}`


  hijriMonthSubtitle.textContent =
    'Al Zubarah & Bahrain calculated lunar month'
}

function populateMonths(system, selectedMonth) {
  const names = system === 'hijri' ? HIJRI_MONTHS : GREGORIAN_MONTHS
  monthInput.innerHTML = names.map((name, index) => `<option value="${index + 1}">${name}</option>`).join('')
  monthInput.value = String(selectedMonth)
}

function populateDays(selectedDay = Number(dayInput.value) || 1) {
  const year = Number(yearInput.value)
  const month = Number(monthInput.value)
  if (!Number.isInteger(year) || year < 1 || !month) return

  const length = selectedSystem() === 'hijri'
    ? getBahrainHijriMonthLength(year, month)
    : gregorianMonthLength(year, month)

  dayInput.innerHTML = Array.from({ length }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join('')
  dayInput.value = String(Math.min(selectedDay, length))
}

function syncPickerFromIso(isoDate) {
  if (selectedSystem() === 'hijri') {
    try {
      const hijri = getBahrainHijriDate(isoDate)
      yearInput.value = hijri.year
      populateMonths('hijri', hijri.month)
      populateDays(hijri.day)
      return
    } catch {
      const gregorianInput = systemInputs.find((input) => input.value === 'gregorian')
      if (gregorianInput) gregorianInput.checked = true
    }
  }

  const [year, month, day] = isoDate.split('-').map(Number)
  yearInput.value = year
  populateMonths('gregorian', month)
  populateDays(day)
}

function pickerValueToIso() {
  const year = Number(yearInput.value)
  const month = Number(monthInput.value)
  const day = Number(dayInput.value)

  if (selectedSystem() === 'hijri') return bahrainHijriToIso(year, month, day)

  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-')
}

function selectPanel(panelId, { focus = false } = {}) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.panel === panelId
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
    if (selected && focus) tab.focus()
  })

  panels.forEach((panel) => {
    panel.hidden = panel.id !== panelId
    if (!panel.hidden) panel.scrollTop = 0
  })

}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPanel(tab.dataset.panel))
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    selectPanel(tabs[nextIndex].dataset.panel, { focus: true })
  })
})

function formatGregorianDate(year, month, day) {
  return `${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)))} AD`
}

function formatAstronomyEvent(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hourCycle: 'h23' }).format(date)
}

function formatUtcTime(date) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hourCycle: 'h23' }).format(date)
}

function parseObserverCoordinates(value) {
  const match = value.match(/^\s*([+-]?\d+(?:\.\d+)?)\s*[,،]\s*([+-]?\d+(?:\.\d+)?)\s*$/)
  if (!match) return null

  const latitude = Number(match[1])
  const longitude = Number(match[2])
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null

  return { latitude, longitude, height: 0 }
}

function formatNumber(value, decimals = 1) {
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function cardHeader(symbol, badge, family = '') {
  return `<div class="card-header">${symbolBadge(symbol)}<div class="card-meta"><span class="badge">${badge}</span>${family ? `<span class="family">${family}</span>` : ''}</div></div>`
}

const CALENDAR_GROUPS = [
  {
    id: 'western-solar',
    title: 'Gregorian & Western Solar',
    calendars: [
      'gregory',
      'julian-calendar',
      'international-fixed',
      'french-republican',
    ],
  },
  {
    id: 'hijri-islamic',
    title: 'Hijri / Islamic',
    calendars: [
      'islamic-bahrain',
      'islamic-umalqura',
      'islamic-civil',
    ],
    note: 'Additional regional and observational Hijri methods will be added after further research.',
  },
  {
    id: 'iranian-zoroastrian',
    title: 'Iranian & Zoroastrian',
    calendars: ['persian', 'zoroastrian'],
  },
  {
    id: 'hebrew-jewish',
    title: 'Hebrew & Jewish',
    calendars: ['hebrew'],
  },
  {
    id: 'east-asian',
    title: 'East Asian',
    calendars: ['chinese', 'dangi', 'japanese', 'roc'],
  },
  {
    id: 'indian-south-asian',
    title: 'Indian & South Asian',
    calendars: [
      'indian',
      'vikram-samvat',
      'nepali-bikram-sambat',
      'bengali',
      'tamil',
      'malayalam',
      'jain',
      'nanakshahi',
    ],
  },
  {
    id: 'buddhist-southeast-asian',
    title: 'Buddhist & Southeast Asian',
    calendars: ['buddhist', 'thai-lunar', 'burmese', 'khmer'],
  },
  {
    id: 'indonesian',
    title: 'Indonesian',
    calendars: ['balinese-pawukon', 'javanese'],
  },
  {
    id: 'christian-liturgical',
    title: 'Christian & Liturgical',
    calendars: ['coptic', 'ethiopic', 'ethioaa', 'armenian', 'bahai'],
  },
  {
    id: 'ancient-egyptian-north-african',
    title: 'Ancient Egyptian & North African',
    calendars: ['ancient-egyptian', 'berber'],
  },
  {
    id: 'mesopotamian',
    title: 'Mesopotamian',
    calendars: ['babylonian', 'assyrian'],
  },
  {
    id: 'ancient-greek',
    title: 'Ancient Greek',
    calendars: ['attic'],
  },
  {
    id: 'roman',
    title: 'Roman',
    calendars: ['roman-republican'],
  },
  {
    id: 'mesoamerican-maya',
    title: 'Mesoamerican — Maya',
    calendars: ['maya-tzolkin', 'maya-haab', 'maya-calendar-round'],
  },
  {
    id: 'mesoamerican-aztec',
    title: 'Mesoamerican — Aztec',
    calendars: ['aztec-xiuhpohualli', 'aztec-tonalpohualli'],
  },
  {
    id: 'andean',
    title: 'Andean',
    calendars: ['inca'],
  },
  {
    id: 'african-traditional',
    title: 'African Traditional',
    calendars: ['igbo'],
  },
  {
    id: 'alternative-modern',
    title: 'Alternative / Modern',
    calendars: ['discordian'],
  },
]

const CALENDAR_METHODS = {
  gregory: 'Standard',
  'julian-calendar': 'Standard',
  'international-fixed': 'Modern proposal',
  'french-republican': 'Reconstruction',
  'islamic-bahrain': 'Calculated model',
  'islamic-umalqura': 'Calculated calendar',
  'islamic-civil': 'Tabular',
  persian: 'Standard conversion',
  zoroastrian: 'Calculated variant',
  hebrew: 'Standard conversion',
  chinese: 'Standard conversion',
  dangi: 'Standard conversion',
  japanese: 'Era calendar',
  roc: 'Era calendar',
  indian: 'Civil calendar',
  'vikram-samvat': 'Reference variant',
  'nepali-bikram-sambat': 'Published conversion',
  bengali: 'Civil calendar',
  tamil: 'Calculated reference',
  malayalam: 'Calculated reference',
  jain: 'Reference variant',
  nanakshahi: 'Calculated calendar',
  buddhist: 'Era calendar',
  'thai-lunar': 'Calculated reference',
  burmese: 'Calculated reference',
  khmer: 'Calculated reference',
  'balinese-pawukon': 'Cycle',
  javanese: 'Tabular cycle',
  coptic: 'Standard conversion',
  ethiopic: 'Standard conversion',
  ethioaa: 'Era calendar',
  armenian: 'Calculated calendar',
  bahai: 'Calculated calendar',
  'ancient-egyptian': 'Reconstruction',
  berber: 'Proleptic reference',
  babylonian: 'Reconstruction',
  assyrian: 'Modern calendar',
  attic: 'Reconstruction',
  'roman-republican': 'Reconstruction',
  'maya-tzolkin': 'Cycle',
  'maya-haab': 'Cycle',
  'maya-calendar-round': 'Cycle',
  'aztec-xiuhpohualli': 'Reference alignment',
  'aztec-tonalpohualli': 'Correlation',
  inca: 'Seasonal reference',
  igbo: 'Anchored cycle',
  discordian: 'Alternative calendar',
}

const CALENDAR_GROUP_SYMBOLS = {
  'western-solar': 'gregory',
  'hijri-islamic': 'islamic-bahrain',
  'iranian-zoroastrian': 'zoroastrian',
  'hebrew-jewish': 'hebrew',
  'east-asian': 'chinese',
  'indian-south-asian': 'indian',
  'buddhist-southeast-asian': 'buddhist',
  indonesian: 'javanese',
  'christian-liturgical': 'ethiopic',
  'ancient-egyptian-north-african': 'ancient-egyptian',
  mesopotamian: 'babylonian',
  'ancient-greek': 'attic',
  roman: 'roman-republican',
  'mesoamerican-maya': 'maya-calendar-round',
  'mesoamerican-aztec': 'aztec-tonalpohualli',
  andean: 'inca',
  'african-traditional': 'igbo',
  'alternative-modern': 'discordian',
}

const CHRONOLOGY_GROUP_SYMBOLS = {
  iso: 'iso-week-date',
  'astronomical-day-counts': 'julian-day',
  'mathematical-day-counts': 'rata-die',
  computing: 'unix-time',
  navigation: 'gps-week',
  'roman-era': 'roman-auc',
  byzantine: 'byzantine-am',
  hellenistic: 'seleucid-era',
  'ancient-greek': 'olympiad-dating',
  'amazigh-era': 'amazigh-era',
  'human-era': 'holocene',
  maya: 'maya-long-count',
  'historical-era-systems': 'alexandrian-era',
}

const FICTION_GROUP_META = {
  'Star Trek': { id: 'star-trek', symbol: 'star-trek-tng' },
  'Tolkien / Middle-earth': { id: 'middle-earth', symbol: 'tolkien-stewards' },
  'The Elder Scrolls': { id: 'elder-scrolls', symbol: 'elder-scrolls-era' },
  'Warhammer 40,000': { id: 'warhammer-40000', symbol: 'warhammer-40k-imperial' },
  'Star Wars': { id: 'star-wars', symbol: 'star-wars-bby-aby' },
  'NINXA Impratoria': { id: 'ninxa', symbol: 'ninxa-ahdm' },
  'Battlestar Galactica': { id: 'battlestar-galactica', symbol: 'bsg-caprican' },
  'Warhammer Fantasy': { id: 'warhammer-fantasy', symbol: 'whf-imperial' },
  Warcraft: { id: 'warcraft', symbol: 'warcraft-adp' },
  'Final Fantasy XIV': { id: 'final-fantasy-xiv', symbol: 'ffxiv-eorzean' },
  'The Witcher': { id: 'witcher', symbol: 'witcher-elven' },
  'Dragon Age': { id: 'dragon-age', symbol: 'dragon-age-chantry' },
  'A Song of Ice and Fire / Game of Thrones': { id: 'asoiaf', symbol: 'asoiaf-westerosi' },
  'EVE Online': { id: 'eve-online', symbol: 'eve-yc' },
}

const TRADITION_GROUP_META = {
  'Western Astrology': { id: 'western-astrology', symbol: 'Western Tropical Zodiac' },
  'Sidereal / Vedic': { id: 'sidereal-vedic', symbol: 'Nakshatra — 27 Lunar Mansions' },
  'Arabic Astronomical Tradition': { id: 'arabic-astronomical', symbol: 'Manāzil al-Qamar' },
  'Chinese Zodiac & Sexagenary Cycle': { id: 'chinese-zodiac', symbol: 'Chinese Zodiac Animal' },
  'Four Pillars / BaZi': { id: 'four-pillars', symbol: 'Year Pillar' },
  'Maya Cultural Cycle': { id: 'maya-cultural-cycle', symbol: 'Calendar Round Association' },
  'Aztec Tradition': { id: 'aztec-tradition', symbol: 'Tonalpohualli Day Sign' },
  'Seasonal / European Folk Systems': { id: 'seasonal-european', symbol: 'Wheel of the Year' },
  'Celtic / Tree Systems': { id: 'celtic-tree', symbol: 'Celtic Tree Calendar / Tree Zodiac' },
  'Planetary Traditions': { id: 'planetary-traditions', symbol: 'Day Planet' },
  Numerological: { id: 'numerological', symbol: 'Digital Root of Date' },
}

function renderCalendars(results) {
  const resultsById = new Map(results.map((result) => [result.id, result]))

  const populatedGroups = CALENDAR_GROUPS
    .map((group) => ({
      ...group,
      results: group.calendars.map((id) => resultsById.get(id)).filter(Boolean),
    }))
    .filter((group) => group.results.length)

  calendarGrid.innerHTML = `
    <nav class="calendar-family-index" aria-label="Calendar groups">
      ${populatedGroups.map((group) => `
        <a href="#calendar-family-${group.id}" aria-label="${group.title}" data-label="${group.title}" title="${group.title}">
          <span aria-hidden="true">${getSymbol('calendar', CALENDAR_GROUP_SYMBOLS[group.id])}</span>
        </a>
      `).join('')}
    </nav>
  ` + populatedGroups
    .map((group) => {
      const calendars = group.results

      return `
      <section id="calendar-family-${group.id}" class="calendar-family" aria-labelledby="calendar-family-${group.id}-title">
        <div class="calendar-family-heading">
          <h3 id="calendar-family-${group.id}-title">${group.title}</h3>
          <span>${calendars.length} ${calendars.length === 1 ? 'system' : 'systems'}</span>
        </div>
        <div class="calendar-family-grid">
          ${calendars.map((result) => `
            <article class="result-card calendar-card calendar-result-card ${result.id === 'islamic-bahrain' ? 'calendar-card--featured' : ''} ${result.status !== 'ok' ? 'calendar-card--disabled' : ''}">
              <span class="calendar-card-symbol" aria-hidden="true">${getSymbol('calendar', result.id)}</span>
              <div class="calendar-card-content">
                <span class="calendar-method">${result.status === 'ok' ? (CALENDAR_METHODS[result.id] ?? 'Calculated') : 'Unavailable'}</span>
                <h4>${result.name}</h4>
                <p class="converted-date">${result.formatted}</p>
                <p class="card-description">${result.description}</p>
              </div>
            </article>
          `).join('')}
        </div>
        ${group.note ? `<p class="calendar-family-note">${group.note}</p>` : ''}
      </section>
    `
    })
    .join('')

  const visibleCount = CALENDAR_GROUPS.reduce(
    (total, group) => total + group.calendars.filter((id) => resultsById.has(id)).length,
    0,
  )
  $('#calendar-count').textContent = `${visibleCount} systems`
}

function unavailableCalendar(id, name, family, description, error) {
  return {
    id,
    name,
    family,
    description,
    formatted: 'Unavailable for this date',
    status: 'unsupported',
    error: error instanceof Error ? error.message : String(error),
  }
}

function renderChronologies(results, facts) {
  const chronologyResults = [
    ...results,
    {
      id: 'julian-day', badge: 'DAY COUNT', family: 'Astronomical', name: 'Julian Day',
      value: facts.julianDay.toFixed(1), meta: 'Continuous astronomical day count',
      description: 'Sequential day number used to compare dates and astronomical observations.',
    },
    {
      id: 'modified-julian-day', badge: 'DAY COUNT', family: 'Scientific', name: 'Modified Julian Day',
      value: facts.modifiedJulianDay.toFixed(1), meta: 'Julian Day − 2,400,000.5',
      description: 'Compact Julian day count commonly used in scientific and technical systems.',
    },
  ]
  const resultsById = new Map(chronologyResults.map((result) => [result.id, result]))
  const groups = [
    ['iso', 'ISO', ['iso-week-date', 'iso-ordinal-date']],
    ['astronomical-day-counts', 'Astronomical Day Counts', ['julian-day', 'modified-julian-day']],
    ['mathematical-day-counts', 'Mathematical / Computational Day Counts', ['rata-die', 'lilian-day']],
    ['computing', 'Computing', ['unix-time', 'unix-day-number']],
    ['navigation', 'Navigation & Satellite', ['gps-week', 'gps-day']],
    ['roman-era', 'Roman Era Dating', ['roman-auc']],
    ['byzantine', 'Byzantine', ['byzantine-am']],
    ['hellenistic', 'Hellenistic', ['seleucid-era']],
    ['ancient-greek', 'Ancient Greek', ['olympiad-dating']],
    ['amazigh-era', 'North African / Amazigh', ['amazigh-era']],
    ['human-era', 'Human-Era Systems', ['holocene']],
    ['maya', 'Maya', ['maya-long-count']],
    [
      'historical-era-systems',
      'Historical Era Systems',
      [
        'alexandrian-era',
        'indiction-cycle',
        'era-of-martyrs',
        'spanish-era',
      ],
    ],
  ]

  const populatedGroups = groups.map(([id, title, resultIds]) => ({
    id,
    title,
    results: resultIds.map((resultId) => resultsById.get(resultId)).filter(Boolean),
  })).filter((group) => group.results.length)

  chronologyGrid.innerHTML = `
    <nav class="calendar-family-index chronology-family-index" aria-label="Chronology groups">
      ${populatedGroups.map((group) => `
        <a href="#chronology-family-${group.id}" aria-label="${group.title}" data-label="${group.title}" title="${group.title}">
          <span aria-hidden="true">${getSymbol('chronology', CHRONOLOGY_GROUP_SYMBOLS[group.id])}</span>
        </a>
      `).join('')}
    </nav>
  ` + populatedGroups.map(({ id, title, results: groupResults }) => {
    return `
      <section id="chronology-family-${id}" class="calendar-family" aria-labelledby="chronology-family-${id}-title">
        <div class="calendar-family-heading">
          <h3 id="chronology-family-${id}-title">${title}</h3>
          <span>${groupResults.length} ${groupResults.length === 1 ? 'system' : 'systems'}</span>
        </div>
        <div class="calendar-family-grid">
          ${groupResults.map((result) => `
            <article class="result-card calendar-card calendar-result-card chronology-card">
              <span class="calendar-card-symbol" aria-hidden="true">${getSymbol('chronology', result.id)}</span>
              <div class="calendar-card-content">
                <h4>${result.name}</h4>
                <p class="converted-date">${result.value}</p>
                <p class="card-description">${result.description}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `
  }).join('')
  const visibleCount = populatedGroups.reduce(
    (total, group) => total + group.results.length,
    0,
  )
  $('#chronology-count').textContent = `${visibleCount} systems`
}

function signedDegrees(value, decimals = 2) {
  return `${value >= 0 ? '+' : '−'}${formatNumber(Math.abs(value), decimals)}°`
}

function skyMetric(label, value, detail = '', symbol = '') {
  return `
    <div class="sky-metric">
      ${symbol ? `<span class="sky-metric-symbol" aria-hidden="true">${symbol}</span>` : ''}
      <div><span>${label}</span><strong>${value}</strong>${detail ? `<small>${detail}</small>` : ''}</div>
    </div>
  `
}

function skyGroup({ id, title, description, symbol, metrics, visual = '', wide = false }) {
  const titleSymbol = ['moon', 'sun', 'planets', 'earth-time', 'seasons'].includes(id) ? '' : `<span class="sky-title-symbol" aria-hidden="true">${symbol}</span>`
  return `
    <article class="sky-group ${wide ? 'sky-group--wide' : ''}" data-sky-group="${id}">
      <header><div class="sky-group-title">${titleSymbol}<h3>${title}</h3></div><p>${description}</p></header>
      <div class="sky-metrics">${metrics.join('')}</div>
      ${visual}
    </article>
  `
}

function renderAstronomy(data, location = '') {
  const locationContext = data.observer
    ? ` Observer coordinates: ${formatNumber(data.observer.latitude, 4)}°, ${formatNumber(data.observer.longitude, 4)}°.`
    : location
      ? ' The location could not be resolved; enter latitude and longitude as coordinates for observer-based calculations.'
      : ''
  $('#astronomy-note').textContent = `Geocentric calculations evaluated at ${data.calculationTime}.${locationContext} Coordinates use the true ecliptic of date and J2000 constellation boundaries.`

  const event = (value) => value ? formatAstronomyEvent(value) : 'Unavailable'
  const moonMetrics = [
    skyMetric('Moon Phase', data.moonPhase.name, '', getSymbol('astronomy', 'Moon Phase')),
    skyMetric('Moon Illumination', `${formatNumber(data.moonPhase.illumination, 1)}%`, 'Visible disc', getSymbol('astronomy', 'Moon Illumination')),
    skyMetric('Moon Age', `${formatNumber(data.moonPhase.ageDays, 2)} days`, 'Since previous new moon', getSymbol('astronomy', 'Moon Age')),
    skyMetric('Moon Phase Angle', `${formatNumber(data.moonPhase.angle, 2)}°`, 'Moon–Sun elongation', getSymbol('astronomy', 'Moon Phase Angle')),
    skyMetric('Earth–Moon Distance', `${formatNumber(data.moonPhase.distanceKm, 0)} km`, 'Geocentric', getSymbol('astronomy', 'Earth–Moon Distance')),
    skyMetric('Moon Ecliptic Longitude', `${formatNumber(data.moonPosition.longitude, 2)}°`, '', getSymbol('astronomy', 'Moon Ecliptic Longitude')),
    skyMetric('Moon Ecliptic Latitude', signedDegrees(data.moonPosition.latitude), '', getSymbol('astronomy', 'Moon Ecliptic Latitude')),
    skyMetric('Moon Declination', signedDegrees(data.moonPhase.declination), 'J2000 equatorial', getSymbol('astronomy', 'Moon Declination')),
    skyMetric('Moon Astronomical Constellation', data.moonPhase.constellation, 'IAU boundary', getSymbol('astronomy', 'Moon Astronomical Constellation')),
  ]

  const sunMetrics = [
    skyMetric('Sun Ecliptic Longitude', `${formatNumber(data.sunPosition.longitude, 2)}°`, '', 'λ'),
    skyMetric('Sun Ecliptic Latitude', signedDegrees(data.sunPosition.latitude, 4), '', 'β'),
    skyMetric('Solar Declination', signedDegrees(data.sunPosition.declination), 'J2000 equatorial', 'δ'),
    skyMetric('Earth–Sun Distance', `${formatNumber(data.sunPosition.distanceAu, 6)} AU`, `${formatNumber(data.sunPosition.distanceAu * 149597870.7, 0)} km`, '↔'),
    skyMetric('Sun Astronomical Constellation', data.sunPosition.constellation, 'IAU boundary', '✦'),
  ]

  const planetMetrics = data.planets.map((planet) => skyMetric(
    planet.name,
    `${planet.constellation}<br>${formatNumber(planet.longitude, 2)}°`,
    `${formatNumber(planet.distanceAu, 3)} AU<br>magnitude ${formatNumber(planet.magnitude, 2)}`,
    getSymbol('astronomy', planet.name),
  ))

  const earthMetrics = [
    skyMetric('Greenwich Sidereal Time', `${formatNumber(data.siderealTime, 4)} h`, 'At calculation instant', getSymbol('astronomy', 'Greenwich sidereal time')),
    skyMetric('Julian Astronomical Instant', `JD ${formatNumber(data.julianInstant, 5)}`, data.calculationTime, 'JD'),
    skyMetric('Solar Longitude', `${formatNumber(data.sunPosition.longitude, 2)}°`, 'Apparent geocentric', 'λ'),
    skyMetric('Seasonal Position Through Earth’s Orbit', `${formatNumber(data.orbitalProgress, 2)}%`, 'Measured from March equinox', '⊕'),
  ]

  const seasonMetrics = [
    skyMetric('Northern Hemisphere Season', data.seasons.northern, '', 'N'),
    skyMetric('Southern Hemisphere Season', data.seasons.southern, '', 'S'),
    skyMetric('March Equinox', event(data.seasons.marchEquinox), 'UTC', getSymbol('astronomy', 'March Equinox')),
    skyMetric('June Solstice', event(data.seasons.juneSolstice), 'UTC', getSymbol('astronomy', 'June Solstice')),
    skyMetric('September Equinox', event(data.seasons.septemberEquinox), 'UTC', getSymbol('astronomy', 'September Equinox')),
    skyMetric('December Solstice', event(data.seasons.decemberSolstice), 'UTC', getSymbol('astronomy', 'December Solstice')),
    skyMetric('Nearest Equinox', data.seasons.nearestEquinox.name, event(data.seasons.nearestEquinox.date), '◇'),
    skyMetric('Nearest Solstice', data.seasons.nearestSolstice.name, event(data.seasons.nearestSolstice.date), '☉'),
  ]

  astronomyGrid.innerHTML = [
    skyGroup({ id: 'moon', title: 'Moon', description: 'Phase, illumination and geocentric position at the selected instant.', symbol: getSymbol('astronomy', 'Moon'), metrics: moonMetrics, visual: '<div class="sky-moon-stage" data-sky-moon aria-hidden="true"></div>', wide: true }),
    skyGroup({ id: 'sun', title: 'Sun', description: 'Apparent solar position and Earth–Sun geometry at the selected instant.', symbol: getSymbol('astronomy', 'Sun'), metrics: sunMetrics, visual: '<div class="sky-sun-stage" data-sky-sun aria-hidden="true"></div>', wide: true }),
    skyGroup({ id: 'planets', title: 'Planets', description: 'Geocentric position, constellation, distance and brightness.', symbol: getSymbol('astronomy', 'Planets'), metrics: planetMetrics, wide: true }),
    skyGroup({ id: 'earth-time', title: 'Earth & Time', description: 'Astronomical time and Earth’s progress through the seasonal year.', symbol: getSymbol('astronomy', 'Earth & Time'), metrics: earthMetrics, visual: '<div class="sky-earth-stage" data-sky-earth aria-hidden="true"></div>', wide: true }),
    skyGroup({ id: 'seasons', title: 'Seasons', description: 'Hemisphere seasons and the year’s equinoxes and solstices.', symbol: getSymbol('astronomy', 'Seasons'), metrics: seasonMetrics, visual: '<div class="sky-seasons-stage" data-sky-seasons aria-hidden="true"></div>', wide: true }),
  ].join('')

  disposeSkyMoon()
  const moonStage = astronomyGrid.querySelector('[data-sky-moon]')
  disposeSkyMoon = moonStage ? mountRotatingSigil(moonStage, 'moon-globe') : () => {}
  disposeSkySun()
  const sunStage = astronomyGrid.querySelector('[data-sky-sun]')
  disposeSkySun = sunStage ? mountRotatingSigil(sunStage, 'sun-surface') : () => {}
  disposeSkyEarth()
  const earthStage = astronomyGrid.querySelector('[data-sky-earth]')
  disposeSkyEarth = earthStage ? mountRotatingSigil(earthStage, 'earth-globe') : () => {}
  disposeSkySeasons()
  const seasonsStage = astronomyGrid.querySelector('[data-sky-seasons]')
  disposeSkySeasons = seasonsStage ? mountRotatingSigil(seasonsStage, 'storm-cloud') : () => {}

}

function cultureCard({ kind, name, value, meta = '', description, symbol, pending = false }) {
  const textValue = String(value).replace(/[☀-♧]/gu, '$&\uFE0E')
  const resolvedSymbol = getSymbol('culture', name, textValue)
  const cardSymbol = resolvedSymbol.includes('tradition-symbol-svg') ? resolvedSymbol : (symbol ?? resolvedSymbol)
  return `
    <article class="result-card calendar-card tradition-card ${pending ? 'tradition-card--pending' : ''}">
      <div class="calendar-card-content">
        <span class="tradition-kind">${kind}</span>
        <h4>${name}</h4>
        <strong class="culture-value">${textValue}</strong>
        <p class="tradition-meta">${meta || '&nbsp;'}</p>
        <p class="card-description">${description}</p>
      </div>
      <span class="calendar-card-symbol" aria-hidden="true">${cardSymbol}</span>
    </article>
  `
}

function traditionGroup({ id, title, classification, cards, note = '' }) {
  return `
    <section id="tradition-family-${id}" class="calendar-family tradition-family" aria-labelledby="tradition-family-${id}-title">
      <div class="calendar-family-heading tradition-family-heading">
        <h3 id="tradition-family-${id}-title">${title}</h3>
        <span>${classification}</span>
      </div>
      <div class="calendar-family-grid">${cards.map(cultureCard).join('')}</div>
      ${note ? `<p class="calendar-family-note">${note}</p>` : ''}
    </section>
  `
}

function renderCulture(data, julianDay) {
  const unavailable = 'Unavailable for this date'
  const chinese = data.chinese
  const cycles = data.chineseCycles
  const ruler = data.planetaryRuler
  const mansion = data.arabicMansion
  const sidereal = data.sidereal
  const seasonal = data.seasonal
  const numerology = data.numerology
  const hourPillar = data.hourPillar
  const planetaryHour = data.planetaryHour
  const tonalpohualli = getTonalpohualliData(julianDay)

  const groups = [
    {
      title: 'Western Astrology', classification: 'ASTROLOGICAL',
      cards: [
        { kind: 'ASTROLOGICAL', name: 'Western Tropical Zodiac', value: data.westernZodiac.formatted, meta: `${formatNumber(data.westernZodiac.degree, 2)}° into sign`, description: 'Sun sign in the tropical zodiac, measured from the March equinox.' },
        { kind: 'ASTROLOGICAL', name: 'Moon Tropical Zodiac', value: data.moonZodiac.formatted, meta: `${formatNumber(data.moonZodiac.degree, 2)}° into sign`, description: 'Moon sign in the tropical zodiac at the calculation instant.' },
        { kind: 'ASTROLOGICAL', name: 'Zodiac Degree', value: `${formatNumber(data.westernZodiac.degree, 2)}° ${data.westernZodiac.name}`, meta: `${formatNumber(data.westernZodiac.longitude, 2)}° tropical longitude`, description: 'The Sun’s degree within its current tropical zodiac sign.', symbol: '°' },
        { kind: 'HISTORICAL ASTROLOGY', name: 'Planetary Weekday Ruler', value: ruler ? `${ruler.symbol} ${ruler.body}` : unavailable, meta: heroWeekday.textContent, description: 'Classical planet traditionally assigned to this weekday.' },
      ],
    },
    {
      title: 'Sidereal / Vedic', classification: 'ASTROLOGICAL',
      cards: [
        { kind: 'SIDEREAL ASTROLOGY', name: 'Sidereal Zodiac', value: `${sidereal.sun.symbol} ${sidereal.sun.name}`, meta: `Approx. Lahiri ayanāṃśa ${formatNumber(sidereal.ayanamsha, 2)}°`, description: 'Sun sign after applying an approximate Lahiri sidereal offset.' },
        { kind: 'VEDIC ASTROLOGY', name: 'Vedic Rāśi', value: `${sidereal.sun.name} (Sun)`, meta: `${formatNumber(sidereal.sun.degree, 2)}° into rāśi`, description: 'Solar rāśi shown using the same stated sidereal reference.' },
        { kind: 'VEDIC ASTROLOGY', name: 'Nakshatra — 27 Lunar Mansions', value: `${sidereal.nakshatraIndex}. ${sidereal.nakshatra}`, meta: 'Moon-based · 27 equal sectors', description: 'Lunar mansion calculated from the sidereal longitude of the Moon.', symbol: '✦' },
        { kind: 'VEDIC ASTROLOGY', name: 'Nakshatra Pada', value: `Pada ${sidereal.pada}`, meta: `Within ${sidereal.nakshatra}`, description: 'Quarter division of the current nakshatra.', symbol: '¼' },
        { kind: 'VEDIC ASTROLOGY', name: 'Vedic Moon Sign', value: `${sidereal.moon.symbol} ${sidereal.moon.name}`, meta: `${formatNumber(sidereal.moon.degree, 2)}° into rāśi`, description: 'Moon rāśi calculated with the stated approximate sidereal offset.' },
      ],
    },
    {
      title: 'Arabic Astronomical Tradition', classification: 'HISTORICAL ASTRONOMICAL TRADITION',
      cards: [
        { kind: 'CALCULATED HISTORICAL TRADITION', name: 'Manāzil al-Qamar', value: `${mansion.number}. ${mansion.name}`, meta: `${formatNumber(mansion.longitudeWithin, 2)}° into equal sector`, description: 'Calculated mansion for this date using an equal-sector approximation; historical observation used stellar markers.', symbol: '☾' },
        { kind: 'HISTORICAL ASSOCIATION', name: 'Traditional Arabic Star Association', value: mansion.stars, meta: mansion.name, description: 'Representative stars historically associated with the selected mansion.', symbol: '✧' },
      ],
    },
    {
      title: 'Chinese Zodiac & Sexagenary Cycle', classification: 'TRADITIONAL CALENDRICAL',
      cards: [
        { kind: 'TRADITIONAL', name: 'Chinese Zodiac Animal', value: chinese?.animal ?? unavailable, meta: chinese?.yearName ?? '', description: 'Animal associated with the year’s Earthly Branch.', symbol: '生肖' },
        { kind: 'TRADITIONAL', name: 'Chinese Element', value: chinese?.element ?? unavailable, meta: chinese?.yearName ?? '', description: 'Five-phase element associated with the year’s Heavenly Stem.', symbol: '五' },
        { kind: 'TRADITIONAL', name: 'Yin / Yang', value: chinese?.polarity ?? unavailable, meta: chinese?.yearName ?? '', description: 'Polarity associated with the year’s Heavenly Stem.', symbol: '☯' },
        { kind: 'SEXAGENARY CYCLE', name: 'Chinese Sexagenary Year', value: cycles?.year.formatted ?? chinese?.yearName ?? unavailable, meta: '60-term cycle', description: 'Heavenly Stem and Earthly Branch combination for the year.', symbol: '年' },
        { kind: 'SEXAGENARY CYCLE', name: 'Chinese Sexagenary Month', value: cycles?.month.formatted ?? unavailable, meta: 'Solar-term month approximation', description: 'Month pillar estimated from the Sun’s longitude and year stem.', symbol: '月' },
        { kind: 'SEXAGENARY CYCLE', name: 'Chinese Sexagenary Day', value: cycles?.day.formatted ?? unavailable, meta: 'Continuous 60-day cycle', description: 'Stem-branch day calculated from the Julian day number.', symbol: '日' },
        { kind: 'TRADITIONAL', name: 'Heavenly Stem', value: cycles?.year.stem ?? unavailable, meta: 'Year stem', description: 'The ten-part celestial component of the sexagenary year.', symbol: '干' },
        { kind: 'TRADITIONAL', name: 'Earthly Branch', value: cycles?.year.branch ?? unavailable, meta: 'Year branch', description: 'The twelve-part terrestrial component of the sexagenary year.', symbol: '支' },
      ],
    },
    {
      title: 'Four Pillars / BaZi', classification: 'ASTROLOGICAL',
      cards: [
        { kind: 'BAZI', name: 'Year Pillar', value: cycles?.year.formatted ?? unavailable, description: 'Year stem and branch used in Four Pillars practice.', symbol: '年' },
        { kind: 'BAZI', name: 'Month Pillar', value: cycles?.month.formatted ?? unavailable, meta: 'Solar-term approximation', description: 'Month stem and branch based on the seasonal solar sector.', symbol: '月' },
        { kind: 'BAZI', name: 'Day Pillar', value: cycles?.day.formatted ?? unavailable, description: 'Day stem and branch in the continuous sexagenary cycle.', symbol: '日' },
        { kind: hourPillar ? 'BAZI' : 'INPUT REQUIRED', name: 'Hour Pillar', value: hourPillar?.formatted ?? 'Time required', meta: hourPillar ? `${hourPillar.time} entered time · civil-day convention` : 'Enter an hour above', description: hourPillar ? 'Hour stem and branch calculated from the day stem and traditional two-hour branch.' : 'The hour pillar cannot be calculated from a date alone.', symbol: '時', pending: !hourPillar },
      ],
    },
    {
      title: 'Maya Cultural Cycle', classification: 'HISTORICAL CALENDRICAL',
      cards: [
        { kind: 'RITUAL CYCLE', name: 'Tzolkʼin Day Number', value: data.maya.tzolkin.number, meta: '13-number cycle', description: 'Number paired with the current Tzolkʼin day name.', symbol: '13' },
        { kind: 'RITUAL CYCLE', name: 'Tzolkʼin Day Name', value: data.maya.tzolkin.name, meta: '20 day names', description: 'Named position in the traditional 260-day ritual cycle.', symbol: '◆' },
        { kind: 'SOLAR CYCLE', name: 'Haabʼ Position', value: data.maya.haab.formatted, meta: '365-day cycle', description: 'Position within the eighteen months and Wayebʼ period.', symbol: '⊙' },
        { kind: 'COMBINED CYCLE', name: 'Calendar Round Association', value: data.maya.calendarRound, meta: 'Tzolkʼin + Haabʼ', description: 'Combined ritual and solar date recurring every 52 Haabʼ years.', symbol: '◎' },
      ],
    },
    {
      title: 'Aztec Tradition', classification: 'HISTORICAL CALENDRICAL',
      cards: [
        { kind: 'CALCULATED CORRELATION', name: 'Tonalpohualli Day Number', value: tonalpohualli.number, meta: 'Caso–Nicholson correlation', description: 'The numeral in the repeating sequence from 1 through 13.', symbol: '13' },
        { kind: 'CALCULATED CORRELATION', name: 'Tonalpohualli Day Sign', value: tonalpohualli.sign, meta: 'Caso–Nicholson correlation', description: 'The current sign in the repeating sequence of twenty named day signs.', symbol: '◇' },
        { kind: 'CALCULATED CORRELATION', name: 'Associated Trecena', value: tonalpohualli.trecena, meta: 'Caso–Nicholson correlation', description: 'The current thirteen-day period, named for its opening 1-day sign.', symbol: 'ⅩⅢ' },
      ],
    },
    {
      title: 'Seasonal / European Folk Systems', classification: 'FOLKLORIC / MODERN',
      cards: [
        { kind: 'MODERN PAGAN', name: 'Wheel of the Year', value: seasonal.wheel, meta: 'Approximate civil-date sectors', description: 'Modern eight-festival seasonal framework; observance dates vary.', symbol: '◉' },
        { kind: 'SEASONAL TRADITION', name: 'Seasonal Festivals', value: seasonal.currentFestival, meta: `Next: ${seasonal.nextFestival}`, description: 'Nearest preceding festival in the selected modern framework.', symbol: '✹' },
        { kind: 'HISTORICAL / SEASONAL', name: 'Quarter Days', value: seasonal.quarterDays, description: 'Equinox and solstice anchors; historical civil observances varied.', symbol: '✚' },
        { kind: 'FOLKLORIC / MODERN', name: 'Cross-Quarter Days', value: seasonal.crossQuarterDays, description: 'Mid-season festival names commonly used in modern practice.', symbol: '✧' },
      ],
    },
    {
      title: 'Celtic / Tree Systems', classification: 'MODERN / POPULAR TRADITION',
      note: 'The claimed ancient origin of modern tree-zodiac mappings is not historically established.',
      cards: [
        { kind: 'MODERN / POPULAR', name: 'Celtic Tree Calendar / Tree Zodiac', value: data.celticTree.tree, meta: `${data.celticTree.ogham} · modern fixed-date mapping`, description: 'Tree sign for the selected month and day using a stated modern popular mapping.', symbol: '♧' },
      ],
    },
    {
      title: 'Planetary Traditions', classification: 'ASTROLOGICAL / HISTORICAL',
      cards: [
        { kind: 'HISTORICAL ASTROLOGY', name: 'Day Planet', value: ruler ? `${ruler.symbol} ${ruler.body}` : unavailable, meta: heroWeekday.textContent, description: 'Planet traditionally governing the weekday.' },
        { kind: planetaryHour ? 'HISTORICAL ASTROLOGY' : 'INPUT REQUIRED', name: 'Traditional Planetary Hour', value: planetaryHour ? `${planetaryHour.symbol} ${planetaryHour.body}` : 'Time and coordinates required', meta: planetaryHour ? `${planetaryHour.period === 'day' ? 'Day' : 'Night'} hour ${planetaryHour.number} · ${formatUtcTime(planetaryHour.start)}–${formatUtcTime(planetaryHour.end)} UTC` : 'Enter time plus latitude, longitude', description: planetaryHour ? 'Unequal planetary hour calculated by dividing the local daylight or night interval into twelve parts.' : 'Planetary hours depend on local sunrise, sunset and clock time.', symbol: '◷', pending: !planetaryHour },
        { kind: 'HISTORICAL ASTROLOGY', name: 'Classical Planet Association', value: ruler ? `${ruler.body} — ${data.classicalPlanetAssociation}` : unavailable, description: 'Condensed traditional association; meanings vary across sources.' },
      ],
    },
    {
      title: 'Numerological', classification: 'MODERN ESOTERIC',
      cards: [
        { kind: 'NUMEROLOGICAL', name: 'Digital Root of Date', value: numerology.digitalRoot, meta: 'Repeated digit sum', description: 'All digits of the selected date reduced to a single digit.', symbol: '#' },
        { kind: 'NUMEROLOGICAL', name: 'Date Number', value: numerology.dateNumber, meta: 'Unreduced digit sum', description: 'Sum of the digits in the selected Gregorian date.', symbol: 'Σ' },
        { kind: 'NUMEROLOGICAL', name: 'Life-Path-Style Calculation', value: numerology.lifePath, meta: 'Selected date treated as birth date', description: 'Date digits reduced while retaining the commonly used master numbers 11, 22 and 33.', symbol: '∞' },
      ],
    },
  ]

  const indexedGroups = groups.map((group) => ({
    ...group,
    ...TRADITION_GROUP_META[group.title],
  }))

  cultureGrid.innerHTML = `
    <nav class="calendar-family-index tradition-family-index" aria-label="Tradition groups">
      ${indexedGroups.map(({ title, id, symbol }) => `
        <a href="#tradition-family-${id}" aria-label="${title}" data-label="${title}" title="${title}">
          <span aria-hidden="true">${getSymbol('culture', symbol)}</span>
        </a>
      `).join('')}
    </nav>
    ${indexedGroups.map(traditionGroup).join('')}`

  const cardCount = groups.reduce((total, group) => total + group.cards.length, 0)
  $('#culture-count').textContent = `${groups.length} groups · ${cardCount} entries`
}

function fictionCard(result) {
  const continuity = [result.family, result.continuity]
    .filter(Boolean)
    .map((label) => `<span>${label}</span>`)
    .join(' · ')
  const resolvedSymbol = getSymbol('fiction', result.id)
  const cardSymbol = resolvedSymbol.includes('fiction-symbol-svg') ? resolvedSymbol : (result.symbol ?? resolvedSymbol)
  return `
    <article class="result-card calendar-card fiction-card">
      <div class="calendar-card-content">
        ${continuity ? `<span class="fiction-family">${continuity}</span>` : ''}
        <h4>${result.name}</h4>
        <strong class="fiction-value">${String(result.value).replace('\n', '<br>')}</strong>
        <p class="fiction-description">${result.description}</p>
        <div class="fiction-provenance">
          <span>${result.statusLabels.join(' · ')}</span>
          ${result.secondary ? `<small>${result.secondary}</small>` : ''}
        </div>
      </div>
      <span class="calendar-card-symbol fiction-card-symbol" aria-hidden="true">${cardSymbol}</span>
    </article>
  `
}

function renderFiction(results) {
  const groups = FICTION_GROUP_ORDER
    .map((universe) => ({
      universe,
      ...FICTION_GROUP_META[universe],
      results: results.filter((result) => result.universe === universe),
    }))
    .filter((group) => group.results.length)

  fictionGrid.innerHTML = `
    <nav class="calendar-family-index fiction-family-index" aria-label="Fiction universe groups">
      ${groups.map(({ universe, id, symbol }) => `
        <a href="#fiction-family-${id}" aria-label="${universe}" data-label="${universe}" title="${universe}">
          <span aria-hidden="true">${getSymbol('fiction', symbol)}</span>
        </a>
      `).join('')}
    </nav>
  ` + groups.map(({ universe, id, results: groupResults }) => `
    <section id="fiction-family-${id}" class="calendar-family fiction-family-group" aria-labelledby="fiction-family-${id}-title">
      <div class="calendar-family-heading">
        <h3 id="fiction-family-${id}-title">${universe}</h3>
        <span>${groupResults.length} ${groupResults.length === 1 ? 'system' : 'systems'}</span>
      </div>
      <div class="calendar-family-grid">${groupResults.map(fictionCard).join('')}</div>
    </section>
  `).join('')

  const implemented = results.filter((result) => result.status === 'implemented').length
  $('#fiction-count').textContent = `${implemented} systems`
}

function exploreDate(value) {
  if (!value) return
  try {
    const [year, month, day] = value.split('-').map(Number)
    const canonicalDate = createCanonicalDate(value)
    const results = convertAllCalendars(canonicalDate, CALENDARS)
    const facts = getDateFacts(year, month, day)
    const chronologies = getChronologyData({ year, month, day, dayOfYear: facts.dayOfYear, julianDay: facts.julianDay })
    const timeSpecified = hourInput.value !== '' || minuteInput.value !== ''
    const hour = timeSpecified ? Number(hourInput.value || 0) : 12
    const minute = timeSpecified ? Number(minuteInput.value || 0) : 0
    const location = locationInput.value.trim()
    const observer = parseObserverCoordinates(location)
    const astronomy = getAstronomyData(year, month, day, { hour, minute, observer })
    const culture = getCulturalData({
      year,
      month,
      day,
      weekday: facts.weekday,
      julianDay: facts.julianDay,
      sunLongitude: astronomy.sunPosition.longitude,
      moonLongitude: astronomy.moonPosition.longitude,
      hour: timeSpecified ? hour : null,
      minute,
      solarHourWindow: timeSpecified ? astronomy.solarHourWindow : null,
    })
    chronologies.push({
      id: 'maya-long-count',
      badge: 'ERA',
      family: 'Maya',
      name: 'Maya Long Count',
      value: culture.maya.longCount.formatted,
      meta: 'GMT correlation 584283',
      description: 'Continuous Maya day count expressed in baktun, katun, tun, uinal and kin.',
    })
    let bahrainHijri
    let bahrainError
    try {
      bahrainHijri = getBahrainHijriDate(value)
    } catch (error) {
      bahrainError = error
    }
    const fiction = getFictionResults({ year, month, day, bahrainHijri })
    results.push(bahrainHijri ? {
        id: 'islamic-bahrain',
        name: 'Hijri — Al Zubarah & Bahrain',
        family: 'Islamic',
        description: 'Bahrain model using the published Makkah horizon criterion; observations may supersede it.',
        status: 'ok',
        formatted: bahrainHijri.formatted,
        year: bahrainHijri.year,
        month: bahrainHijri.month,
        day: bahrainHijri.day,
        era: 'ah',
        eraYear: bahrainHijri.year,
      } : unavailableCalendar(
        'islamic-bahrain',
        'Hijri — Al Zubarah & Bahrain',
        'Islamic',
        'Calculated regional Hijri model; dates before its astronomical range are unavailable.',
        bahrainError,
      ))

    const calendarChronologyNames = {
      'julian-calendar': 'Julian Calendar',
      'international-fixed': 'International Fixed Calendar',
      'french-republican': 'French Republican Calendar',
      discordian: 'Discordian Calendar',
    }

    chronologies
      .filter((result) => calendarChronologyNames[result.id])
      .forEach((result) => results.push({
        id: result.id,
        name: calendarChronologyNames[result.id],
        family: result.family,
        description: result.description,
        status: 'ok',
        formatted: result.value,
      }))

    try {
      const zoroastrian = getZoroastrianDate(year, month, day)
      results.push({
        id: 'zoroastrian',
        name: 'Zoroastrian Calendar',
        family: 'Zoroastrian',
        description: 'Fasli solar variant; Shenshai and Kadmi calendars differ.',
        status: 'ok',
        formatted: zoroastrian.formatted,
        year: zoroastrian.year,
        month: zoroastrian.month,
        day: zoroastrian.day,
      })
    } catch (error) {
      results.push(unavailableCalendar('zoroastrian', 'Zoroastrian Calendar', 'Zoroastrian', 'Fasli solar variant; Shenshai and Kadmi calendars differ.', error))
    }

    results.push(...getRegionalCalendarData({ year, month, day }))
    results.push(...getAncientCalendarData({ year, month, day, julianDay: facts.julianDay }))
    results.push(
      {
        id: 'maya-tzolkin',
        name: 'Maya Tzolkʼin',
        family: 'Mesoamerican — Maya',
        description: 'Traditional Maya 260-day ritual count using the GMT correlation.',
        status: 'ok',
        formatted: culture.maya.tzolkin.formatted,
      },
      {
        id: 'maya-haab',
        name: 'Maya Haabʼ',
        family: 'Mesoamerican — Maya',
        description: 'Maya 365-day cycle of eighteen months plus Wayebʼ.',
        status: 'ok',
        formatted: culture.maya.haab.formatted,
      },
      {
        id: 'maya-calendar-round',
        name: 'Maya Calendar Round',
        family: 'Mesoamerican — Maya',
        description: 'Combined position in the Tzolkʼin and Haabʼ cycles.',
        status: 'ok',
        formatted: culture.maya.calendarRound,
      },
    )
    results.push(...getHeritageCalendarData({ year, month, day, julianDay: facts.julianDay }))
    let bahrainMonthLength
    if (bahrainHijri) {
      try {
        bahrainMonthLength = getBahrainHijriMonthLength(bahrainHijri.year, bahrainHijri.month)
      } catch {
        bahrainMonthLength = undefined
      }
    }
    heroDate.textContent =
  formatGregorianDate(
    year,
    month,
    day,
  )


heroWeekday.textContent =
  facts.weekday


heroBahrainHijri.textContent =
  bahrainHijri
    ? bahrainHijri.formatted
    : 'Unavailable'

fitOverviewDateHeadlines()


gregorianDayOfYear.textContent =
  facts.dayOfYear


gregorianDaysRemaining.textContent =
  facts.daysRemaining


gregorianLeapYear.textContent =
  facts.leapYear
    ? 'Yes'
    : 'No'


hijriDayOfMonth.textContent =
  bahrainHijri?.day ?? '—'


hijriDaysRemaining.textContent =
  bahrainMonthLength === undefined
    ? '—'
    : bahrainMonthLength - bahrainHijri.day


hijriMoonPhase.textContent =
  astronomy.moonPhase.name


renderGregorianMonth({
  year,
  month,
  day,
})


if (bahrainHijri) {
  try {
    renderBahrainHijriMonth(bahrainHijri)
  } catch {
    hijriMonthTitle.textContent = 'Calendar unavailable'
    hijriMonthSubtitle.textContent = 'Month grid could not be calculated'
    hijriMonthGrid.innerHTML = ''
  }
} else {
  hijriMonthTitle.textContent = 'Calendar unavailable'
  hijriMonthSubtitle.textContent = 'Outside the supported astronomical range'
  hijriMonthGrid.innerHTML = ''
}
    renderCalendars(results)
    renderChronologies(chronologies, facts)
    renderAstronomy(astronomy, location)
    renderCulture(culture, facts.julianDay)
    renderFiction(fiction)
    localizeDocument(document, currentLanguage)
    fitOverviewDateHeadlines()
  } catch (error) {
    console.error(error)
    alert('That date could not be processed.')
  }
}

systemInputs.forEach((input) => {
  input.addEventListener('change', () => syncPickerFromIso(currentIso))
})

yearInput.addEventListener('change', () => populateDays())
monthInput.addEventListener('change', () => populateDays())

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = 'Current location is not supported by this browser.'
    locationInput.placeholder = 'Location unavailable'
    return
  }

  locationButton.disabled = true
  locationButton.setAttribute('aria-busy', 'true')
  locationStatus.textContent = 'Getting current location…'

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      locationInput.value = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
      locationStatus.textContent = 'Current coordinates added.'
      locationButton.title = 'Current coordinates added'
      locationButton.disabled = false
      locationButton.removeAttribute('aria-busy')
    },
    (error) => {
      const messages = {
        1: 'Location permission was denied.',
        2: 'Current location is unavailable.',
        3: 'Location request timed out.',
      }
      const message = messages[error.code] ?? 'Current location could not be retrieved.'
      locationStatus.textContent = message
      locationInput.placeholder = message
      locationButton.title = message
      locationButton.disabled = false
      locationButton.removeAttribute('aria-busy')
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  )
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  currentIso = pickerValueToIso()
  exploreDate(currentIso)
})

let headlineResizeFrame
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(headlineResizeFrame)
  headlineResizeFrame = window.requestAnimationFrame(fitOverviewDateHeadlines)
})

document.fonts?.ready.then(fitOverviewDateHeadlines)

const today = new Date()
currentIso = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-')
syncPickerFromIso(currentIso)
selectPanel('overview')
exploreDate(currentIso)
