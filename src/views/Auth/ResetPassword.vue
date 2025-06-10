<template>
  <div class="container">
    <div class="card">
      <h2>Reset Password</h2>
      <form v-if="step === 1" @submit.prevent="handleRequestToken">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" />
        <span v-if="emailError" class="error">{{ emailError }}</span>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Requesting...' : 'Request Reset Token' }}
        </button>
      </form>
      <form v-else @submit.prevent="handleResetPassword">
        <label for="token">Reset Token</label>
        <input type="text" id="token" v-model="token" placeholder="Paste your reset token" />
        <span v-if="tokenError" class="error">{{ tokenError }}</span>
        <label for="password">New Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter new password" />
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div class="switch">
        <a @click.prevent="goToLogin" href="#">Back to Login</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_URL } from '@/config/path.js'

const email = ref('')
const token = ref('')
const password = ref('')
const emailError = ref('')
const tokenError = ref('')
const passwordError = ref('')
const successMessage = ref('')
const loading = ref(false)
const step = ref(1)
const router = useRouter()

const handleRequestToken = async () => {
  emailError.value = ''
  loading.value = true
  try {
    const res = await axios.post(`${API_URL}/auth/forgot-password`, { email: email.value })
    if (res.data.resetToken) {
      token.value = res.data.resetToken
      step.value = 2
      successMessage.value = 'Reset token generated. Paste it below to reset your password.'
    } else {
      emailError.value = res.data.message || 'Email not found.'
    }
  } catch (err) {
    emailError.value = err.response?.data?.message || 'Error requesting reset token.'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  tokenError.value = ''
  passwordError.value = ''
  successMessage.value = ''
  loading.value = true

  if (!token.value) {
    tokenError.value = 'Reset token is required'
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
  }
  if (tokenError.value || passwordError.value) {
    loading.value = false
    return
  }

  try {
    await axios.post(`${API_URL}/auth/reset-password`, {
      token: token.value,
      newPassword: password.value
    })
    successMessage.value = 'Password has been reset successfully! Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 1500) // 1.5 seconds delay for user to see the message
  } catch (err) {
    tokenError.value = err.response?.data?.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
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
.success {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}
</style>