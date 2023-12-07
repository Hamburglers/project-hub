<script setup>
import { ref, computed, watch } from 'vue'
import Todolist from './components/Todolist.vue'

const routes = {
  '/todo': Todolist
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
  if (currentPath.value === '#/') {
    buttonClicked.value = false;
  }
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})

const buttonClicked = ref(localStorage.getItem('buttonClicked') === 'true');
watch(buttonClicked, (newValue) => {
  localStorage.setItem('buttonClicked', newValue);
});
</script>

<template>
  <div v-if="!buttonClicked">
    <header>A collection of projects by Allen</header>
    <div class="linkContainer">
        <a @click="buttonClicked = true" href="#/todo"><img src="/todolist.png">To do list</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
        <a @click="buttonClicked = true" href="#/todo"><img src="/blank.png">Coming soon</a>
    </div>
  </div>
  <component :is="currentView" />
</template>

<style scoped>
header {
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 30px;
  padding: 20px 0;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  max-width: none;
}

body {
  display: flex;
  background-color: white;
}

a {
  text-align: center;
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