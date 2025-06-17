<template>
  <div class="container">
    <div class="card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div style="margin-bottom: 10px;">
          <label for="identifier">Email or Username</label>
          <input type="text" id="identifier" v-model="identifier" placeholder="Enter your email or username" />
          <span v-if="identifierError" class="error">{{ identifierError }}</span>
        </div>

        <div class="password-field">
          <label for="password">Password</label>
          <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
              placeholder="Enter your password" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <FontAwesomeIcon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
            </button>
          </div>
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>

        <span v-if="loginError" class="error">{{ loginError }}</span>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="switch" style="display: flex; justify-content: end;">
        <router-link to="/Reset-Password">Forget Password?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// Add the eye icons to the library
library.add(faEye, faEyeSlash)

const router = useRouter()
const auth = useAuthStore()

const identifier = ref('')
const password = ref('')
const identifierError = ref('')
const passwordError = ref('')
const loginError = ref('')
const loading = ref(false)
const showPassword = ref(false)

const isValidInput = (value) => value.trim().length > 0

const handleLogin = async () => {
  identifierError.value = ''
  passwordError.value = ''
  loginError.value = ''
  loading.value = true

  if (!identifier.value || !isValidInput(identifier.value)) {
    identifierError.value = 'Email or username is required'
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
  }

  if (identifierError.value || passwordError.value) {
    loading.value = false
    return
  }

  try {
    await auth.login({ identifier: identifier.value, password: password.value })
    router.push('/app/dashboard')
  } catch (err) {
    console.error('Login Error:', err)
    console.error('Response:', err.response?.data)
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
}

h2 {
  color: #007BFF;
  margin-bottom: 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  text-align: left;
  margin-bottom: 5px;
  font-weight: 500;
}

.password-field {
  margin-bottom: 15px;
}

.password-field input {
  border-radius: 5px !important;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 1px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #007BFF;
}

button[type="submit"] {
  padding: 12px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

button[type="submit"]:disabled {
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
  margin-top: 5px;
  display: block;
}
</style>
