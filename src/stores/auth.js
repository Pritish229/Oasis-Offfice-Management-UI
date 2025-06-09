import { defineStore } from 'pinia'
import axios from 'axios'
import { API_URL } from '@/config/path.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login({ email, password }) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password })
        this.token = res.data.token
        this.user = res.data.user
        localStorage.setItem('token', this.token)

        // Set default auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Login failed')
      }
    },

    async fetchProfile() {
      try {
        const res = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.user = res.data
      } catch (err) {
        throw new Error('Failed to fetch profile')
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})
