<template>
  <div class="container">
    <div>
      <form @submit.prevent="sendOtp" v-if="!isvalidotp">
        <h4 style="color:#007bff; display:flex; justify-content:center; margin:10px;">
          Reset password
        </h4>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
        <p v-if="emailError" class="error-msg">{{ emailError }}</p>

        <button type="submit" :disabled="sendLoading">
          {{ sendLoading ? 'Sending...' : 'Send OTP' }}
        </button>

        <div class="switch">
          <router-link to="/login">Back to Login</router-link>
        </div>
      </form>

      <form @submit.prevent="verifyOtp" v-else>
        <h4 style="color:#007bff; display:flex; justify-content:center; margin:10px;">
          Reset password
        </h4>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" disabled />
        <p v-if="emailError" class="error-msg">{{ emailError }}</p>

        <label for="otp">OTP</label>
        <div style="position: relative;">
          <input type="text" id="otp" v-model="otp" placeholder="Enter OTP" />
          <div class="countdown" v-if="countdown > 0">
            {{ formattedTime }}
          </div>
        </div>
        <p v-if="otpError" class="error-msg">{{ otpError }}</p>

        <button type="submit" :disabled="verifyLoading">
          {{ verifyLoading ? 'Verifying...' : 'Verify OTP' }}
        </button>

        <div v-if="countdown <= 0" class="resend-container">
          <a href="javascript:void(0)" class="resend-link" @click="!sendLoading && sendOtp()">
            {{ sendLoading ? 'Sending...' : 'Resend OTP' }}
          </a>
        </div>

        <div class="switch">
          <router-link to="/login">Back to Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import axios from 'axios'
import { API_URL } from '@/config/path.js'

const email = ref('')
const otp = ref('')
const sendLoading = ref(false)
const verifyLoading = ref(false)
const isvalidotp = ref(false)

const emailError = ref('')
const otpError = ref('')

const countdown = ref(0)
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(countdown.value / 60).toString().padStart(2, '0')
  const seconds = (countdown.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const sendOtp = async () => {
  emailError.value = ''
  if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  sendLoading.value = true

  try {
    const response = await axios.post(`${API_URL}/password/forgot-password`, { email: email.value })

    if (response.status === 200) {
      isvalidotp.value = true
      startCountdown()
    }
    alert(response.data.message || 'OTP sent!')
  } catch (error) {
    console.log(error)
  } finally {
    sendLoading.value = false
  }
}

function startCountdown() {
  countdown.value = 120
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

onUnmounted(() => {
  clearInterval(timer)
})

const verifyOtp = async () => {
  emailError.value = ''
  otpError.value = ''

  if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.'
  }

  if (!otp.value || otp.value.length !== 6 || !/^\d{6}$/.test(otp.value)) {
    otpError.value = 'OTP must be a 6-digit number.'
  }

  if (emailError.value || otpError.value) return

  verifyLoading.value = true
  try {
    const payload = {
      email: email.value,
      otp: otp.value
    }

    console.log('Verifying OTP with payload:', payload)

    alert('OTP verified. Redirecting to reset password page.')
  } catch (err) {
    console.error(err)
  } finally {
    verifyLoading.value = false
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.switch {
  margin-top: 15px;
  font-size: 14px;
  display: flex;
  justify-content: center;
}

.switch a {
  color: #007BFF;
  text-decoration: none;
}

.resend-link {
  margin-top: 10px;
  color: #dc3545;
  font-weight: bold;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
}
.resend-link:disabled {
  pointer-events: none;
  opacity: 0.6;
}

form {
  width: 100%;
  min-width: 450px;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 19px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.countdown {
  position: absolute;
  top: 15px;
  bottom: 5px;
  left: 90%;
  color: red;
  font-size: 13px;
  font-weight: bold;
}

.resend-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.resend-btn {
  margin-top: 10px;
  background: none;
  border: none;
  color: #dc3545;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.error-msg {
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
}
</style>
