<template>
  <div class="container">
    <form @submit.prevent="sendOtp">
      <h4 style="color:#007bff; display:flex; justify-content:center; margin:10px;"> Reset password</h4>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send OTP' }}
      </button>
      <div class="switch">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '@/config/path.js'

const email = ref('')
const loading = ref(false)

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const sendOtp = async () => {
  if (!isValidEmail(email.value)) {
    alert('Invalid email format')
    return
  }

  loading.value = true

  try {
    const response = await axios.post(`${API_URL}/password/forgot-password`, { email: email.value })
    alert(response.data.message || 'OTP sent!')
  } catch (error) {
   console.log(error);
  } finally {
    loading.value = false
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

form {
  width: 100%;
  max-width: 400px;
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
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
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
</style>
