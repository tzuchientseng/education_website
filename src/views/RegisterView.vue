<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        await axios.post('http://127.0.0.1:8000/api/register/', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        alert('User registered successfully');
        this.$router.push('/login');
      } catch (error) {
        alert(error.response.data);
      }
    }
  }
}
</script>
