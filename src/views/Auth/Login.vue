<script setup>
import { ref } from 'vue'
import input from '@/components/prop/input.vue'

const form = ref({
  email: '',
  password: ''
})
</script>

<template>
  <section>
    <div class="form-box">
      <div class="form-value">
        <form @submit.prevent="() => console.log(form)">
          <h2>Login</h2>

          <div class="inputbox">
            <input
              text="Email"
              type="input"
              v-model="form.email"
              :restricted="true"
            />
            <ion-icon name="mail-outline"></ion-icon>
          </div>

          <div class="inputbox">
            <input
              text="Password"
              type="input"
              v-model="form.password"
              :restricted="true"
            />
            <ion-icon name="lock-closed-outline"></ion-icon>
          </div>

          <div class="forget">
            <label>
              <input type="checkbox" />
              Remember Me
              <a href="#">Forget Password</a>
            </label>
          </div>

          <button type="submit">Log in</button>

          <div class="register">
            <p>Don't have an account? <a href="#">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
