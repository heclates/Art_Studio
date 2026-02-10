import axios from 'axios'
import DOMPurify from 'dompurify'
import { closeModal } from '@/components/Modal'

const API = '/api/'

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

  axios.get(`${API}timeslots/`, {
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
      await axios.post(`${API}reservations/`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      success.style.display = 'block'
      setTimeout(closeModal, 2000)
    } catch (e) {
      error.textContent = 'Ошибка отправки'
      error.style.display = 'block'
    }
  })

  return form
}
