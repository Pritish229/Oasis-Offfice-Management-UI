import { defineStore } from 'pinia'
import axios from 'axios'
import { API_URL } from '@/config/path.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    permissions: []
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    }
  },

  actions: {
    async login({ identifier, password }) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { identifier, password })

        this.token = res.data.token
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        await this.fetchProfile()
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
        this.permissions = (res.data.permissions || []).map(p => p.name)

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (err) {
        this.logout()
        throw new Error('Failed to fetch profile')
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.permissions = []
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async initialize() {
      if (this.token && !this.user) {
        try {
          await this.fetchProfile()
        } catch (err) {
          this.logout()
        }
      }
    },

    setPermissions(permissions) {
      this.permissions = permissions
    }
  }
})
