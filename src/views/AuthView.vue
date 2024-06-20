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

export default {
  name: 'AuthView',
  data() {
    return {
      isLoginMode: true,
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    toggleMode() {
      this.isLoginMode = !this.isLoginMode;
      this.username = '';
      this.email = '';
      this.password = '';
    },
    async login() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/', {
          username: this.username,
          password: this.password
        });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        alert('Login successful');
        this.$router.push('/');
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        alert('An error occurred during login.');
      }
    },
    async register() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        console.log('Register response:', response.data);
        alert('User registered successfully');
        this.toggleMode();  // 自動切換到登入模式
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        alert('An error occurred during registration.');
      }
    }

  }
}
</script>

