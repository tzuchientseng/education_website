<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/file">File</router-link> |
    <router-link to="/auth">Authentication</router-link> |
    <!-- <span v-if="isAuthenticated"> | Welcome, {{ user.username }} | <button @click="logout" class="btn btn-outline-secondary btn-sm">Log Out</button></span> -->
    <span v-if="isAuthenticated"> | Welcome, {{ user.username }} | <button @click="logout" class="btn btn-warning">Log Out</button></span>
    <span v-else> | Not logged in</span>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AppNavbar',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const user = computed(() => store.getters.getUser)

    const logout = () => {
      store.dispatch('logout')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      router.push('/auth')
    }

    return {
      isAuthenticated,
      user,
      logout
    }
  }
}
</script>

<style scoped>
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #ff9100;
}

button {
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-weight: bold;
}
</style>

