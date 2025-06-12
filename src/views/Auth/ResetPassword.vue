<template>
  <div class="container">
    <div class="card">
      <h2>Reset Your Password</h2>

      <form @submit.prevent="showOtpInput ? handleVerifyOtp() : handleLogin">
        <!-- Email input -->
        <div v-if="!showOtpInput">
          <label for="identifier" style="width:100%;">Email</label>
          <input type="text" id="identifier" v-model="identifier" placeholder="Enter your email"  style="width:100%;"/>
          <span v-if="identifierError" class="error">{{ identifierError }}</span>
        </div>

        <!-- OTP input -->
        <div v-else>
          <label for="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            v-model="otp"
            placeholder="Enter 6-digit OTP"
            :disabled="isLocked"
          />
          <span v-if="otpError" class="error">{{ otpError }}</span>
          <div
            v-if="isLocked"
            style="color: red; font-size: 13px; margin-top: 5px;"
          >
            Too many attempts. Try again in
            {{ Math.floor(countdown / 60) }}:{{ String(countdown % 60).padStart(2, '0') }}
          </div>
        </div>

        <button type="submit" :disabled="loading || isLocked">
          {{ loading ? 'Sending OTP...' : showOtpInput ? 'Verify OTP' : 'Send OTP' }}
        </button>
      </form>

      <div class="switch" style="display: flex; justify-content: center;">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const identifier = ref('')
const identifierError = ref('')
const otp = ref('')
const otpError = ref('')
const loading = ref(false)
const showOtpInput = ref(false)
const attemptCount = ref(0)
const isLocked = ref(false)
const countdown = ref(0)
let timer = null

const LOCK_DURATION = 600 // 10 minutes

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function handleLogin() {
  identifierError.value = ''
  if (!validateEmail(identifier.value)) {
    identifierError.value = 'Invalid email address'
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    showOtpInput.value = true
    localStorage.setItem('email', identifier.value)
    console.log('OTP sent to:', identifier.value)
  }, 1000)
}

function handleVerifyOtp() {
  otpError.value = ''
  if (isLocked.value) return

  if (otp.value !== '123456') {
    attemptCount.value++
    otpError.value = 'Incorrect OTP'
    localStorage.setItem('attemptCount', attemptCount.value)

    if (attemptCount.value >= 3) {
      lockOtpInput()
    }
  } else {
    alert('OTP verified successfully!')
    resetAll()
  }
}

function lockOtpInput() {
  isLocked.value = true
  const lockStartTime = Date.now()
  localStorage.setItem('lockStartTime', lockStartTime.toString())
  localStorage.setItem('attemptCount', attemptCount.value)
  countdown.value = LOCK_DURATION
  startCountdown()
}

function startCountdown() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      isLocked.value = false
      attemptCount.value = 0
      localStorage.removeItem('lockStartTime')
      localStorage.removeItem('attemptCount')
      clearInterval(timer)
    }
  }, 1000)
}

function resumeLockIfNeeded() {
  const lockStart = parseInt(localStorage.getItem('lockStartTime') || '0')
  const prevAttempts = parseInt(localStorage.getItem('attemptCount') || '0')

  if (lockStart && prevAttempts >= 3) {
    const elapsed = Math.floor((Date.now() - lockStart) / 1000)
    if (elapsed < LOCK_DURATION) {
      countdown.value = LOCK_DURATION - elapsed
      isLocked.value = true
      attemptCount.value = prevAttempts
      showOtpInput.value = true
      startCountdown()
    } else {
      localStorage.removeItem('lockStartTime')
      localStorage.removeItem('attemptCount')
    }
  }

  const savedEmail = localStorage.getItem('email')
  if (savedEmail) {
    identifier.value = savedEmail
    showOtpInput.value = true
  }
}

function resetAll() {
  identifier.value = ''
  otp.value = ''
  identifierError.value = ''
  otpError.value = ''
  attemptCount.value = 0
  isLocked.value = false
  showOtpInput.value = false
  localStorage.clear()
  clearInterval(timer)
}

onMounted(() => {
  resumeLockIfNeeded()
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  width: 400px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #007BFF;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  text-align: left;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.switch {
  margin-top: 15px;
  font-size: 14px;
}

.switch a {
  color: #007BFF;
  text-decoration: none;
}

.error {
  color: red;
  font-size: 12px;
  text-align: left;
  margin-top: -5px;
  margin-bottom: 10px;
}
</style>
