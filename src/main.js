import './style.css'

import { CALENDARS } from './data/calendars'
import { createCanonicalDate, convertAllCalendars } from './engine/calendar-engine'
import { getDateFacts } from './engine/date-facts'
import { getAstronomyData } from './engine/astronomy-engine'
import { getCulturalData } from './engine/cultural-engine'
import { getChronologyData } from './engine/chronology-engine'
import {
  bahrainHijriToIso,
  getBahrainHijriDate,
  getBahrainHijriMonthLength,
} from './engine/bahrain-calendar'
import { getSymbol, symbolBadge } from './ui/symbols'
import { mountRotatingSigil } from './ui/rotating-sigil'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="site">
    <header class="atlas-header">
      <div class="hero">
        <p class="eyebrow">UNIVERSAL CHRONOLOGY ATLAS</p>
        <h1>One date. <span>Every system.</span></h1>
        <p class="hero-description">Explore a single day across calendars, chronologies, astronomy, culture, history and fiction.</p>
      </div>

      <section class="date-search" aria-label="Date explorer">
        <form id="date-form">
          <fieldset class="calendar-choice">
            <legend>Date system</legend>
            <label><input type="radio" name="date-system" value="gregorian" checked><span>Gregorian</span></label>
            <label><input type="radio" name="date-system" value="hijri"><span>Hijri · Bahrain</span></label>
          </fieldset>
          <div class="date-controls">
            <label class="date-field date-field--year"><span>Year</span><input id="year-input" type="number" min="1" max="9999" inputmode="numeric" required></label>
            <label class="date-field"><span>Month</span><select id="month-input" required></select></label>
            <label class="date-field date-field--day"><span>Day</span><select id="day-input" required></select></label>
            <button type="submit">Explore Date</button>
          </div>
        </form>
      </section>
    </header>

    <nav class="atlas-tabs" aria-label="Atlas sections" role="tablist">
      <button id="tab-overview" class="atlas-tab" type="button" role="tab" aria-selected="true" aria-controls="overview" data-panel="overview">Overview</button>
      <button id="tab-calendars" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="calendar-section" data-panel="calendar-section" tabindex="-1">Calendars</button>
      <button id="tab-chronology" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="chronology-section" data-panel="chronology-section" tabindex="-1">Chronology</button>
      <button id="tab-sky" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="astronomy-section" data-panel="astronomy-section" tabindex="-1">Sky</button>
      <button id="tab-traditions" class="atlas-tab" type="button" role="tab" aria-selected="false" aria-controls="culture-section" data-panel="culture-section" tabindex="-1">Traditions</button>
      <button class="atlas-tab" type="button" role="tab" aria-selected="false" disabled aria-disabled="true">Fiction <span class="coming-soon">Soon</span></button>
    </nav>

    <div class="atlas-workspace">
      <section id="overview" class="atlas-panel overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">
        <article class="date-profile date-profile--gregorian">
          <div class="date-profile-main">
            <div class="sigil-stage" data-sigil="solar" aria-hidden="true"></div>
            <div class="date-profile-copy">
              <span class="section-label">GREGORIAN</span>
              <h2 id="hero-date"></h2>
              <p id="hero-weekday"></p>
            </div>
          </div>
          <div class="profile-facts">
            <div class="profile-fact"><span>Day of year</span><strong id="gregorian-day-of-year"></strong></div>
            <div class="profile-fact"><span>Days remaining</span><strong id="gregorian-days-remaining"></strong></div>
            <div class="profile-fact"><span>Leap year</span><strong id="gregorian-leap-year"></strong></div>
          </div>
        </article>

        <article class="date-profile date-profile--hijri">
          <div class="date-profile-main">
            <div class="sigil-stage" data-sigil="lunar" aria-hidden="true"></div>
            <div class="date-profile-copy">
              <span class="section-label">AL ZUBARAH & BAHRAIN</span>
              <h2 id="hero-bahrain-hijri"></h2>
              <p>Calculated date · official observations may supersede it</p>
            </div>
          </div>
          <div class="profile-facts">
            <div class="profile-fact"><span>Day of month</span><strong id="hijri-day-of-month"></strong></div>
            <div class="profile-fact"><span>Days remaining</span><strong id="hijri-days-remaining"></strong></div>
            <div class="profile-fact"><span>Moon phase</span><strong id="hijri-moon-phase"></strong></div>
          </div>
        </article>
      </section>

      <section id="calendar-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-calendars" tabindex="0" hidden>
        <div class="section-heading"><div><span class="section-label">CALENDARS</span><h2>Same day. Different systems.</h2></div><div id="calendar-count" class="count"></div></div>
        <div id="calendar-grid" class="calendar-grid"></div>
      </section>

      <section id="chronology-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-chronology" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">CHRONOLOGIES & ALTERNATIVE CALENDARS</span><h2>Beyond the standard calendar.</h2><p class="section-description">Historical calendars, proposed reforms, continuous day counts, computing epochs and alternative systems.</p></div>
          <div id="chronology-count" class="count"></div>
        </div>
        <div id="chronology-grid" class="calendar-grid"></div>
      </section>

      <section id="astronomy-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-sky" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">ASTRONOMY</span><h2>The sky on this date.</h2><p id="astronomy-note" class="section-description"></p></div>
          <div class="count">13 properties</div>
        </div>
        <div id="astronomy-grid" class="astronomy-grid"></div>
        <div class="season-panel"><div class="season-panel-heading"><span class="section-label">SEASONAL YEAR</span><h3>Equinoxes & solstices</h3></div><div id="season-grid" class="season-grid"></div></div>
      </section>

      <section id="culture-section" class="atlas-panel" role="tabpanel" aria-labelledby="tab-traditions" tabindex="0" hidden>
        <div class="section-heading">
          <div><span class="section-label">ZODIAC & TRADITIONS</span><h2>How traditions describe this date.</h2><p class="section-description">Cultural, astrological and historical associations are shown separately from astronomical observations.</p></div>
          <div id="culture-count" class="count"></div>
        </div>
        <div id="culture-grid" class="culture-grid"></div>
        <div class="culture-note"><strong>About these results</strong><p>Astrology, zodiac traditions and symbolic date systems are cultural frameworks rather than astronomical measurements. Astronomy results elsewhere in this atlas describe calculated physical positions.</p></div>
      </section>
    </div>

    <footer class="atlas-footer">
      <div class="footer-group">
        <span class="github-mark" aria-hidden="true">
          <svg viewBox="0 0 19 19"><use href="/icons.svg#github-icon"></use></svg>
        </span>
        <span class="footer-context">Open source:</span>
        <a href="https://github.com/kooheji" target="_blank" rel="noopener noreferrer">View this project on GitHub</a>
      </div>
      <div class="footer-group footer-support">
        <span class="footer-context">Like the tool?</span>
        <a class="support-link" href="https://ko-fi.com/kooheji" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a>
      </div>
    </footer>
  </main>
`

const $ = (selector) => document.querySelector(selector)
const form = $('#date-form')
const yearInput = $('#year-input')
const monthInput = $('#month-input')
const dayInput = $('#day-input')
const systemInputs = [...document.querySelectorAll('input[name="date-system"]')]
const calendarGrid = $('#calendar-grid')
const chronologyGrid = $('#chronology-grid')
const astronomyGrid = $('#astronomy-grid')
const seasonGrid = $('#season-grid')
const cultureGrid = $('#culture-grid')
const heroDate = $('#hero-date')
const heroWeekday = $('#hero-weekday')
const heroBahrainHijri = $('#hero-bahrain-hijri')
const gregorianDayOfYear = $('#gregorian-day-of-year')
const gregorianDaysRemaining = $('#gregorian-days-remaining')
const gregorianLeapYear = $('#gregorian-leap-year')
const hijriDayOfMonth = $('#hijri-day-of-month')
const hijriDaysRemaining = $('#hijri-days-remaining')
const hijriMoonPhase = $('#hijri-moon-phase')
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

let currentIso

function selectedSystem() {
  return systemInputs.find((input) => input.checked)?.value ?? 'gregorian'
}

function gregorianMonthLength(year, month) {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
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
    const hijri = getBahrainHijriDate(isoDate)
    yearInput.value = hijri.year
    populateMonths('hijri', hijri.month)
    populateDays(hijri.day)
    return
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
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)))
}

function formatAstronomyEvent(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hourCycle: 'h23' }).format(date)
}

function formatNumber(value, decimals = 1) {
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function cardHeader(symbol, badge, family = '') {
  return `<div class="card-header">${symbolBadge(symbol)}<div class="card-meta"><span class="badge">${badge}</span>${family ? `<span class="family">${family}</span>` : ''}</div></div>`
}

function renderCalendars(results) {
  calendarGrid.innerHTML = results.map((result) => `<article class="result-card calendar-card ${result.status !== 'ok' ? 'calendar-card--disabled' : ''}">${cardHeader(getSymbol('calendar', result.id), result.badge, result.family)}<h3>${result.name}</h3><p class="converted-date">${result.formatted}</p><p class="card-description">${result.description}</p></article>`).join('')
  $('#calendar-count').textContent = `${results.length} systems`
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
  chronologyGrid.innerHTML = chronologyResults.map((result) => `<article class="result-card calendar-card">${cardHeader(getSymbol('chronology', result.id), result.badge, result.family)}<h3>${result.name}</h3><p class="converted-date">${result.value}</p><p class="chronology-meta">${result.meta}</p><p class="card-description">${result.description}</p></article>`).join('')
  $('#chronology-count').textContent = `${chronologyResults.length} systems`
}

function astronomyCard(label, value, description) {
  const family = label.startsWith('Moon') || label.startsWith('Lunar') ? 'Lunar' : label.startsWith('Sun') ? 'Solar' : 'Celestial'
  return `<article class="result-card astronomy-card">${cardHeader(getSymbol('astronomy', label), 'ASTRONOMY', family)}<h3>${label}</h3><strong class="astro-value">${value}</strong><p class="card-description">${description}</p></article>`
}

function seasonCard(label, value) {
  return `<article class="season-event">${symbolBadge(getSymbol('astronomy', label))}<div><span>${label}</span><strong>${value}</strong><small>UTC</small></div></article>`
}

function renderAstronomy(data) {
  $('#astronomy-note').textContent = `Geocentric calculations evaluated at ${data.calculationTime}. Location-specific astronomy will be added later.`
  astronomyGrid.innerHTML = [
    astronomyCard('Moon phase', data.moonPhase.name, 'Current lunar phase.'),
    astronomyCard('Moon illumination', `${formatNumber(data.moonPhase.illumination, 1)}%`, 'Fraction of the visible lunar disc illuminated by the Sun.'),
    astronomyCard('Moon phase angle', `${formatNumber(data.moonPhase.angle, 2)}°`, 'Geocentric ecliptic angular separation of Moon and Sun.'),
    astronomyCard('Lunar illumination angle', `${formatNumber(data.moonPhase.phaseAngle, 2)}°`, 'Sun–Moon–Earth illumination geometry.'),
    astronomyCard('Moon distance', `${formatNumber(data.moonPhase.distanceKm, 0)} km`, 'Approximate geocentric distance from Earth.'),
    astronomyCard('Moon magnitude', formatNumber(data.moonPhase.magnitude, 2), 'Calculated apparent visual magnitude.'),
    astronomyCard('Moon ecliptic longitude', `${formatNumber(data.moonPosition.longitude, 2)}°`, 'Position around the ecliptic coordinate system.'),
    astronomyCard('Moon ecliptic latitude', `${formatNumber(data.moonPosition.latitude, 2)}°`, 'Angular position north or south of the ecliptic.'),
    astronomyCard('Sun ecliptic longitude', `${formatNumber(data.sunPosition.longitude, 2)}°`, 'Apparent geocentric longitude of the Sun.'),
    astronomyCard('Sun ecliptic latitude', `${formatNumber(data.sunPosition.latitude, 4)}°`, 'Apparent solar latitude relative to the ecliptic.'),
    astronomyCard('Northern season', data.seasons.northern, 'Astronomical season in the Northern Hemisphere.'),
    astronomyCard('Southern season', data.seasons.southern, 'Corresponding astronomical season in the Southern Hemisphere.'),
    astronomyCard('Greenwich sidereal time', `${formatNumber(data.siderealTime, 4)} h`, 'Greenwich apparent sidereal time at the calculation instant.'),
  ].join('')
  seasonGrid.innerHTML = [seasonCard('March Equinox', formatAstronomyEvent(data.seasons.marchEquinox)), seasonCard('June Solstice', formatAstronomyEvent(data.seasons.juneSolstice)), seasonCard('September Equinox', formatAstronomyEvent(data.seasons.septemberEquinox)), seasonCard('December Solstice', formatAstronomyEvent(data.seasons.decemberSolstice))].join('')
}

function cultureCard({ badge, name, value, meta, description }) {
  const textValue = value.replace(/[☀-♧]/gu, '$&\uFE0E')
  return `<article class="result-card culture-card">${cardHeader(getSymbol('culture', name, value), badge, meta)}<h3>${name}</h3><strong class="culture-value">${textValue}</strong><p class="card-description">${description}</p></article>`
}

function renderCulture(data) {
  const cards = [
    cultureCard({ badge: 'ASTROLOGY', name: 'Western Tropical Zodiac', value: data.westernZodiac.formatted, meta: `${formatNumber(data.westernZodiac.degree, 2)}° into sign`, description: 'Tropical zodiac sign determined from the Sun’s calculated ecliptic longitude.' }),
    cultureCard({ badge: 'ASTROLOGY', name: 'Moon Zodiac', value: data.moonZodiac.formatted, meta: `${formatNumber(data.moonZodiac.degree, 2)}° into sign`, description: 'Tropical zodiac sector occupied by the Moon at the calculation instant.' }),
  ]
  if (data.planetaryRuler) cards.push(cultureCard({ badge: 'TRADITION', name: 'Planetary Weekday Ruler', value: `${data.planetaryRuler.symbol} ${data.planetaryRuler.body}`, meta: heroWeekday.textContent, description: 'Traditional planetary ruler associated with the weekday.' }))
  if (data.chinese) cards.push(
    cultureCard({ badge: 'TRADITION', name: 'Chinese Zodiac Animal', value: data.chinese.animal, meta: data.chinese.yearName, description: 'Earthly Branch animal of the traditional Chinese sexagenary year.' }),
    cultureCard({ badge: 'TRADITION', name: 'Chinese Element', value: data.chinese.element, meta: data.chinese.yearName, description: 'Five-phase element associated with the Heavenly Stem of the Chinese year.' }),
    cultureCard({ badge: 'TRADITION', name: 'Yin / Yang', value: data.chinese.polarity, meta: data.chinese.yearName, description: 'Polarity associated with the Heavenly Stem of the sexagenary year.' }),
    cultureCard({ badge: 'CHRONOLOGY', name: 'Chinese Sexagenary Year', value: data.chinese.yearName, meta: '60-year cycle', description: 'Traditional Heavenly Stem and Earthly Branch combination.' }),
  )
  cards.push(
    cultureCard({ badge: 'CALENDAR', name: 'Maya Tzolkʼin', value: data.maya.tzolkin.formatted, meta: '260-day ritual cycle', description: 'Traditional Maya combination of a thirteen-number cycle and twenty day names.' }),
    cultureCard({ badge: 'CALENDAR', name: 'Maya Haabʼ', value: data.maya.haab.formatted, meta: '365-day cycle', description: 'Maya solar calendar composed of eighteen twenty-day months plus Wayebʼ.' }),
    cultureCard({ badge: 'CHRONOLOGY', name: 'Maya Calendar Round', value: data.maya.calendarRound, meta: 'Tzolkʼin + Haabʼ', description: 'Combined date formed from the Maya ritual and solar calendar cycles.' }),
    cultureCard({ badge: 'CHRONOLOGY', name: 'Maya Long Count', value: data.maya.longCount.formatted, meta: 'GMT correlation 584283', description: 'Continuous Maya day count using the Goodman–Martínez–Thompson correlation constant.' }),
  )
  cultureGrid.innerHTML = cards.join('')
  $('#culture-count').textContent = `${cards.length} systems`
}

function exploreDate(value) {
  if (!value) return
  try {
    const [year, month, day] = value.split('-').map(Number)
    const canonicalDate = createCanonicalDate(value)
    const results = convertAllCalendars(canonicalDate, CALENDARS)
    const facts = getDateFacts(year, month, day)
    const chronologies = getChronologyData({ year, month, day, dayOfYear: facts.dayOfYear, julianDay: facts.julianDay })
    const astronomy = getAstronomyData(year, month, day)
    const culture = getCulturalData({ year, month, day, weekday: facts.weekday, julianDay: facts.julianDay, sunLongitude: astronomy.sunPosition.longitude, moonLongitude: astronomy.moonPosition.longitude })
    const bahrainHijri = getBahrainHijriDate(value)
    const bahrainMonthLength = getBahrainHijriMonthLength(bahrainHijri.year, bahrainHijri.month)
    heroDate.textContent = formatGregorianDate(year, month, day)
    heroWeekday.textContent = facts.weekday
    heroBahrainHijri.textContent = bahrainHijri.formatted
    gregorianDayOfYear.textContent = facts.dayOfYear
    gregorianDaysRemaining.textContent = facts.daysRemaining
    gregorianLeapYear.textContent = facts.leapYear ? 'Yes' : 'No'
    hijriDayOfMonth.textContent = bahrainHijri.day
    hijriDaysRemaining.textContent = bahrainMonthLength - bahrainHijri.day
    hijriMoonPhase.textContent = astronomy.moonPhase.name
    renderCalendars(results)
    renderChronologies(chronologies, facts)
    renderAstronomy(astronomy)
    renderCulture(culture)
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

form.addEventListener('submit', (event) => {
  event.preventDefault()
  currentIso = pickerValueToIso()
  exploreDate(currentIso)
})

const today = new Date()
currentIso = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-')
syncPickerFromIso(currentIso)
selectPanel('overview')
exploreDate(currentIso)
