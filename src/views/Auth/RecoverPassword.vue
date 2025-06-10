<template>
  <div class="container">
    <div class="card">
      <h2>Recover Password</h2>
      <form v-if="!showReset" @submit.prevent="handleEmailCheck">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
        />
        <span v-if="emailError" class="error">{{ emailError }}</span>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Checking...' : 'Verify Email' }}
        </button>
      </form>
      <form v-else @submit.prevent="handleReset">
        <label for="password">New Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter new password"
        />
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirm new password"
        />
        <span v-if="confirmPasswordError" class="error">{{
          confirmPasswordError
        }}</span>
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
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const successMessage = ref('')
const loading = ref(false)
const showReset = ref(false)
const auth = useAuthStore()
const router = useRouter()

const handleEmailCheck = async () => {
  emailError.value = ''
  loading.value = true
  try {
    const exists = await auth.checkEmailExists(email.value)
    if (exists) {
      showReset.value = true
    } else {
      emailError.value = 'Email not found. Please try again.'
    }
  } catch {
    emailError.value = 'Error verifying email.'
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  passwordError.value = ''
  confirmPasswordError.value = ''
  successMessage.value = ''
  loading.value = true

  if (!password.value) {
    passwordError.value = 'Password is required'
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
  }
  if (passwordError.value || confirmPasswordError.value) {
    loading.value = false
    return
  }

  try {
    await auth.resetPassword(email.value, password.value)
    successMessage.value = 'Password has been reset successfully!'
    showReset.value = false
  } catch {
    passwordError.value = 'Failed to reset password. Try again.'
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
  color: #007bff;
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
  background-color: #007bff;
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
  color: #007bff;
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
