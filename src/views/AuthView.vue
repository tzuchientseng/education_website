<template>
  <div>
    <h1 v-if="isLoginMode">Login</h1>
    <h1 v-else>Register</h1>
    <form @submit.prevent="isLoginMode ? login() : register()">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" v-if="!isLoginMode" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">{{ isLoginMode ? 'Login' : 'Register' }}</button>
    </form>
    <button @click="toggleMode">{{ isLoginMode ? 'Switch to Register' : 'Switch to Login' }}</button>
  </div>
</template>

<script>
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

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
      isLoginMode.value = !isLoginMode.value;
      username.value = ''
      email.value = ''
      password.value = ''
    }

    const login = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/', {
          username: username.value,
          password: password.value
        });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Set user state
        store.dispatch('login', { username: username.value });

        alert('Login successful');
        router.push('/');
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        alert('An error occurred during login.');
      }
    }

    const register = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', {
          username: username.value,
          email: email.value,
          password: password.value
        });
        console.log('Register response:', response.data);
        alert('User registered successfully');
        toggleMode();  // 自動切換到登入模式
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
          if (error.response.data.username) {
            alert(`An error occurred during registration: ${error.response.data.username}`);
          } else if (error.response.data.email) {
            alert(`An error occurred during registration: ${error.response.data.email}`);
          } else {
            alert(`An error occurred during registration: ${JSON.stringify(error.response.data)}`);
          }
        } else {
          alert('An error occurred during registration.');
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

