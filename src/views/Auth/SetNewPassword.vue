<template>
  <div class="container">
    <div class="card">
      <h2>Reset Password</h2>
      <form @submit.prevent="handleResetPassword">
        <div class="password-field">
          <label for="password">New Password</label>
          <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="Enter your new password" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <FontAwesomeIcon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
            </button>
          </div>
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>

        <div class="password-field">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-group">
            <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm your new password" />
            <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
              <FontAwesomeIcon :icon="showConfirmPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
            </button>
          </div>
          <span v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</span>
        </div>

        <span v-if="resetError" class="error">{{ resetError }}</span>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { API_URL } from '@/config/path.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// Add the eye icons to the library
library.add(faEye, faEyeSlash)

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const resetError = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const validatePassword = (password) => {
  return password.length >= 6
}

const handleResetPassword = async () => {
  passwordError.value = ''
  confirmPasswordError.value = ''
  resetError.value = ''
  loading.value = true

  // Validation
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (!validatePassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters long'
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
  }

  if (passwordError.value || confirmPasswordError.value) {
    loading.value = false
    return
  }

  try {
    const response = await axios.post(`${API_URL}/password/reset-password`, {
      newPassword: password.value,
      email: route.params.useremail,
    })
    console.log(response)
    if (response.status === 200) {
      alert('Password reset successful!')
      // Redirect to login page after successful password reset
      router.push('/login')
    }
  } catch (err) {
    console.error('Reset Password Error:', err)
    resetError.value = err.response?.data?.message || 'Failed to reset password. Please try again.'
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

.error {
  color: red;
  font-size: 12px;
  text-align: left;
  margin-top: 5px;
  display: block;
}
</style>
