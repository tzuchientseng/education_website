<template>
  <div>
    <h1 v-if="isLoginMode">Login</h1>
    <h1 v-else>Register</h1>
    <form @submit.prevent="isLoginMode ? login() : register()">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" v-if="!isLoginMode" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit" class="btn btn-primary">{{ isLoginMode ? 'Login' : 'Register' }}</button>
    </form>
    <button @click="toggleMode" class="btn btn-success">{{ isLoginMode ? 'Switch to Sign Up' : 'Switch to Log In' }}</button>
  </div>
</template>

<script>
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Swal from 'sweetalert2'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
})

export default {
  name: 'AuthView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoginMode = ref(true)
    const username = ref('')
    const email = ref('')
    const password = ref('')

    const toggleMode = () => {
      isLoginMode.value = !isLoginMode.value
      username.value = ''
      email.value = ''
      password.value = ''
    }

    const login = async () => {
      try {
        const response = await axiosInstance.post('/api/token/', {
          username: username.value,
          password: password.value
        })
        const { access, refresh } = response.data
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        // Set user state
        store.dispatch('login', { username: username.value })

        Swal.fire('Login successful', '', 'success')
        router.push('/')
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message)
        if (error.response && error.response.data) {
          Swal.fire({
            icon: 'error',
            title: 'An error occurred during login',
            text: error.response.data.detail || 'Unknown error',
          })
        } else {
          Swal.fire('An error occurred during login', error.message, 'error')
        }
      }
    }

    const register = async () => {
      try {
        const response = await axiosInstance.post('/api/auth/register/', {
          username: username.value,
          email: email.value,
          password: password.value
        })
        console.log('Register response:', response.data)
        Swal.fire('User registered successfully', '', 'success')
        toggleMode()  // 自動切換到登入模式
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message)
        if (error.response && error.response.data) {
          const errors = error.response.data
          let errorMessage = ''
          if (errors.username) {
            errorMessage = errors.username.join(' ')
          } else if (errors.email) {
            errorMessage = errors.email.join(' ')
          } else {
            errorMessage = JSON.stringify(errors)
          }
          Swal.fire({
            icon: 'error',
            title: 'An error occurred during registration',
            text: errorMessage,
          })
        } else {
          Swal.fire('An error occurred during registration', error.message, 'error')
        }
      }
    }

    return {
      isLoginMode,
      username,
      email,
      password,
      toggleMode,
      login,
      register
    }
  }
}
</script>

