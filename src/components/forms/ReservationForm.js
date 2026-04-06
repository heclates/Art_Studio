import axios from '@/utils/apiClient.js'
import DOMPurify from 'dompurify'
import { closeModal } from '@/components/Modal'
import { getLanguage } from '@/utils/languageManager'
import ru from '@/i18n/forms/ru.js'
import cs from '@/i18n/forms/en.js'

export const createReservationForm = ({
  courseTitle,
  dayOfWeek,
  time,
  location
}) => {
  const form = document.createElement('form')
  form.className = 'reservation-form'

  form.innerHTML = `
    <h2>Запись на занятие</h2>
    <p>${courseTitle} · ${time} · ${location}</p>

    <select name="slot_id" required>
      <option value="">Выберите дату</option>
    </select>

    <input name="user_name" placeholder="Имя" required />
    <input name="user_surname" placeholder="Фамилия" required />
    <input name="phone" placeholder="Телефон" required />

    <button type="submit">Записаться</button>
    <div class="error" style="display:none"></div>
    <div class="success" style="display:none">Успешно!</div>
  `

  const select = form.querySelector('select')
  const error = form.querySelector('.error')
  const success = form.querySelector('.success')

  const parseApiErrorMessage = (err) => {
    if (!err || !err.response) return 'Ошибка отправки. Попробуйте снова.'
    const data = err.response.data || {}
    const rawMessage = (
      data.non_field_errors?.[0] ||
      data.detail ||
      data.message ||
      data.error ||
      'Повторная запись невозможна. У вас уже есть активная бронь на это время.'
    )
    
    // Translate known error keys
    if (rawMessage === 'duplicate_booking') {
      const t = getLanguage() === 'ru' ? ru : cs
      return t.duplicateBooking || 'Повторная запись невозможна. У вас уже есть активная бронь на это время.'
    }
    
    return rawMessage
  }

  axios.get('timeslots/', {
    params: {
      course_title: courseTitle,
      day_of_week: dayOfWeek
    }
  }).then(({ data }) => {
    data.forEach(slot => {
      const date = new Date(slot.start_time)
      const opt = document.createElement('option')
      opt.value = slot.id
      opt.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      select.appendChild(opt)
    })
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const fd = new FormData(form)

    const payload = {
      slot_id: fd.get('slot_id'),
      user_name: DOMPurify.sanitize(fd.get('user_name')),
      user_surname: DOMPurify.sanitize(fd.get('user_surname')),
      phone: DOMPurify.sanitize(fd.get('phone')),
      status: 'pending'
    }

    try {
      const token = localStorage.getItem('access_token')
      await axios.post('reservations/', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      success.style.display = 'block'
      setTimeout(closeModal, 2000)
    } catch (e) {
      error.textContent = parseApiErrorMessage(e)
      error.style.display = 'block'
    }
  })

  return form
}
