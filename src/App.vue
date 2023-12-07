<script setup>
import { ref, computed } from 'vue'
import Todolist from './components/Todolist.vue'

const routes = {
  '/todo': Todolist
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || null]
})

</script>

<template>
  <div v-if="!currentView">
    <header>A collection of projects by Allen</header>
    <div class="linkContainer">
        <a href="#/todo"><img src="/todolist.png">To do list</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
    </div>
  </div>
  <component :is="currentView" />
</template>

<style>
body {
  display: flex;
  font-family: "Roboto", sans-serif;
  font-size: larger;
  justify-content: center;
  align-items: center;
  background-color: white;
  min-width: none;
  min-height: none;
  margin: 0px;
}
</style>

<style scoped>
header {
  text-align: center;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 30px;
  padding: 20px 0;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
}

a {
  text-align: center;
  width: 15vw;
}

a:hover {
  cursor: pointer;
}

/* div {
  border: 1px solid black;
} */
.linkContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 80vw;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

img {
  width: 15vw;
  height: 15vh;
  left: 0px;
  border: 2px solid black;
  border-radius: 15px;
}
</style>