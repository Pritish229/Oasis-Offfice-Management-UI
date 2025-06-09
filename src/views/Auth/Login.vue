<template>
  <div class="container">
    <div class="card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" />
        <span v-if="emailError" class="error">{{ emailError }}</span>

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
        <span v-if="passwordError" class="error">{{ passwordError }}</span>

        <span v-if="loginError" class="error">{{ loginError }}</span>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="switch">
        Forget password? <a href="#">Recover it</a>
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
const emailError = ref('')
const passwordError = ref('')
const loginError = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const handleLogin = async () => {
  emailError.value = ''
  passwordError.value = ''
  loginError.value = ''
  loading.value = true

  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!isValidEmail(email.value)) {
    emailError.value = 'Invalid email format'
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
  }

  if (emailError.value || passwordError.value) {
    loading.value = false
    return
  }

  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('app/dashboard')
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed. Please try again.'
    loginError.value = msg
  } finally {
    loading.value = false
  }
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
</style>
