<template>
  <div class="home">
    <img class="container" alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="The Websiet is on process..."/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script> 