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
    <section class="linkContainer">
      <section class="uno">
        <div class="unotext">
        <a href="#/todo"><img src="/todolist.png">To do list</a>
        <br>
        Connected to PostgreSQL databse with Websocket and 
          fallback HTTP requests for real time synchronisation.</div>
      </section>
      <section class="dos">
        <div class="dostext">
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        </div>
      </section>
      <section class="tres">
        <div class="trestext">
        <a href="#/todo"><img src="/blank.png">Coming soon</a>
        </div>
      </section>
    </section>
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
  overflow-x: hidden;
}
</style>

<style scoped>

header {
  text-align: center;
  align-items: center;
  margin: 0;
  padding: 20px 0 30px 0px;
  width: 100%;
  background-color: rgb(175, 175, 175);
}

section {
  border: 0;
  margin: 0;
  padding: 0;
  width: 100vw;
  position: relative;
}

a {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  max-width: 35vw;
  gap: 10px;
  justify-content: center;
}

a:hover {
  cursor: pointer;
}

/* div {
  border: 1px solid black;
} */
.linkContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 100vw;
  margin-top: -40px;
}

img {
  max-width: 50vw;
  height: auto;
  left: 0px;
  border: 2px solid black;
  border-radius: 15px;
}

.unotext {
  max-width: 35vw;
  font-size: 15px;
  padding: 40px 15vw;
}

.dostext {
  max-width: 35vw;
  font-size: 15px;
  padding: 40px 65vw;
}

.trestext {
  max-width: 35vw;
  font-size: 15px;
  padding: 40px 50vw;
}

.uno {
  display: flex;
  flex-direction: column;
  background-color: rgb(175, 175, 175);
  padding: 40px;
  border: 0px;
}

.dos {
  background-color: rgb(203, 203, 203);
  padding: 40px;
}

.tres {
  background-color: rgb(255, 255, 255);
  padding: 40px;
}
</style>