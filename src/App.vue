<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue'
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

function scrollToTop() {
  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});


const activeIndex = ref(null);

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  if (scrollPosition >= 500 && scrollPosition < 1000) {
    activeIndex.value = 1; // First item active
  } else if (scrollPosition >= 1000) {
    activeIndex.value = 2; // Second item active
  } else {
    activeIndex.value = 0; // No item active
  }
  footerVisible.value = !(isNarrowScreen.value && scrollPosition > 1200);
};

const footerVisible = ref(true);
const screenWidth = ref(window.innerWidth);
const isNarrowScreen = computed(() => screenWidth.value < 1200);

</script>

<template>
  <div v-if="!currentView">
    <header class="container">
      <h2>A collection of projects</h2>
    </header>
    <Transition name="fade">
    <ul v-scroll-spy-active v-scroll-spy-link v-show="footerVisible">
      <li :class="{ activeSection: activeIndex === 0 }">
        <a>To do list</a>
      </li>
      <li :class="{ activeSection: activeIndex === 1 }">
        <a>Coming soon</a>
      </li>
      <li :class="{ activeSection: activeIndex === 2 }">
        <a>Coming soon</a>
      </li>
    </ul>
    </Transition>
    <section class="linkContainer" v-scroll-spy>
      <section id="uno">
        <div class="unotext">
        <a href="#/todo"><img src="/todolist.png"></a>
        <a href="#/todo" id="button">Try the To do list</a>
        <br>
        Includes public login connected to PostgreSQL databse via Websocket and 
          fallback HTTP requests for real time synchronisation.</div>
      </section>
      <section id="dos">
        <div class="custom-shape-divider-top-1702011878">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
            </svg>
        </div>
        <div class="dostext">
        <a href="#/todo"><img class="inverse" src="/blank.png"></a>
        <a href="#/todo" id="button" class="inverse">Coming soon</a>
        <br>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, odit fugiat et odio, nam quasi corporis aut delectus distinctio, quas nulla libero consequuntur eos illum ea corrupti quos? Vero, error.
        </div>
      </section>
      <section id="tres">
        <div class="custom-shape-divider-top-1702017514">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
            </svg>
        </div>
        <div class="trestext">
        <a href="#/todo"><img src="/blank.png"></a>
        <a href="#/todo" id="button">Coming soon</a>
        <br>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro velit ipsa quam quas voluptate quia blanditiis magni temporibus aut doloribus placeat, voluptatibus nemo pariatur incidunt aliquam cumque adipisci totam reiciendis!
        </div>
      </section>
    </section>
    <div class="custom-shape-divider-top-1702030206">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 0L0 0 598.97 114.72 1200 0z" class="shape-fill"></path>
        </svg>
    </div>
    <footer>
      <div id="top">
        <button><img class="top" src="/icons8-facebook.svg"></button>
        <button><img class="top" src="/icons8-linkedin.svg"></button>
        <button><img class="top" src="/icons8-twitter.svg"></button>
      </div>
      <div id="middle">
        <button @click="scrollToTop">Back</button>
        <button>Terms of Use</button>
        <button>Privacy Policy</button>
      </div>
      <div id="bottom">
        Copyright &copy; 2023. All Rights Reserved
      </div>
    </footer>
  </div>
  <component :is="currentView" />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

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

html {
  overflow-x: hidden;
}

</style>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/*First wave*/
.custom-shape-divider-top-1702011878 {
    position: relative;
    margin-top: -70px;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-top-1702011878 svg {
    position: relative;
    display: block;
    width: 100%;
    height: 150px;
}

.custom-shape-divider-top-1702011878 .shape-fill {
    fill: #060B3E;
}

/*Second wave*/
.custom-shape-divider-top-1702017514 {
    position: relative;
    width: 100%;
    margin-top: -70px;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-top-1702017514 svg {
    position: relative;
    display: block;
    width: calc(150% + 1.3px);
    height: 190px;
}

.custom-shape-divider-top-1702017514 .shape-fill {
    fill: #FFFFFF;
}

/*Footer*/
.custom-shape-divider-top-1702030206 {
    width: 100%;
    overflow: hidden;
    line-height: 0;
    margin-top: -50px;
}

.custom-shape-divider-top-1702030206 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 74px;
}

.custom-shape-divider-top-1702030206 .shape-fill {
    fill: #060B3E;
}

header, h2{
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 20px 0 30px 0px;
  background-color: #060b3e;
}

.container {
  background-color: #060b3e;
}

h2 {
  /* Apply gradient to the text */
  background: linear-gradient(269.92deg, #eca73d -2.94%, #e0546b 107.98%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

footer {
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: -40px 0 0 0;
  left: 0px;
  background-color: rgb(7,17,31);
  padding: 60px 0;
  border: 0;
  color: white;
  width: 100%;
  gap: 10px;
}

#top, #middle, #bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  gap: 15px;
  font-size: 10px;
}

img.top {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  width: 20px;
  height: 20px;
  border: none;
}

button {
  border: none;
  color: white;
  background-color: transparent;
  transition: scale 0.3s;
}

button:hover {
  cursor: pointer;
  scale: 1.2;
}

#top > button {
  border-radius: 50px;
}

section {
  border: 0;
  padding-bottom: 0;
  width: 100%;
  position: relative;
}

a {
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 20%;
  gap: 10px;
  justify-content: center;
  font-size: 15px;
  border-radius: 5px;
  color: white;
  margin-top: 10px;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s, scale 0.3s;
}

div > a:hover {
  cursor: pointer;
  color: black;
  scale: 1.05;
}

#button:hover {
  background-color: white;
}

#button {
  border: 1px solid white;
}

#button.inverse {
  border: 2px solid #060b3e;
}

.inverse {
  color: black;
  background-color: white;
  transition: background-color 0.3s, color 0.3s, scale 0.3s;
}

#button.inverse:hover {
  scale: 1.05;
  color: white;
  background-color: #060b3e;
  cursor: pointer;
}

.linkContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  padding: 40px;
  width: 200vw;
  margin-top: -40px;
}

img {
  width: 50vw;
  min-width: 300px;
  max-width: 600px;
  height: auto;
  left: 0px;
  border-radius: 15px;
  border: 2px solid black;
}

.unotext, .dostext, .trestext {
  max-width: 600px;
  min-width: 300px;
  width: 35vw;
  font-size: 15px;
  padding: 40px;
}


#uno, #dos, #tres {
  min-width: 300px;
  display: flex;
  flex-direction: column;
  width: 100%; /* Full width */
  padding: 60px;
  transition: transform 0.5s; /* Smooth transition for the transform */
}

.unotext, .dostext, .trestext {
  font-size: 13px;
  text-align: center;
  margin: 0 auto;
  color: white;
}

.dostext {
  color: black;
}

/* Apply transform to shift each section */
#uno {
  background-color: #060b3e;
  transform: translateX(-20vw); /* Shift slightly to the left */
}

#dos {
  background-color: white;
}

#tres {
  background-color: #060b3e;
}

ul {
  margin-top: 20vh;
  margin-left: 40px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 20vh;
  width: auto;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  list-style: none;
  font-size: x-large;
}

/*Line between scroll spy*/
ul:not(:first-child)::before {
    content: '';
    position: absolute;
    margin-top: 20vh;
    margin-left: 20px;
    top: 55px;
    left: 0;
    width: 2px; /* Thickness of the line */
    background-color: #eca73d;
    height: 53%; /* Adjust based on your design */
    left: 50%; /* Center the line horizontally */
    transform: translateY(-50%);
}

li {
  background-color: #060b3e;
  border: 1px solid #e0546b;
  border-radius: 10px;
  transition: scale 0.3s;
  z-index: 100;
  padding: 5px;
}

li > a {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #eca73d;
}

li:hover {
  cursor: pointer;
}

.activeSection {
  scale: 1.4;
}

/* For smaller screens: Minimum distance */
@media (max-width: 600px) {
  #dos {
    transform: translateX(-40px); /* Minimum distance */
  }
  #tres {
    transform: translateX(-60px);
  }
  ul {
    justify-content: center;
    flex-direction: row;
    height: auto;
    top: 70%;
    left: 0;
    right: 0;
    gap: 10%;
    padding-left: 0;
    margin-left: 0;
  }
  ul:not(:first-child)::before {
    content: '';
    position: absolute;
    margin: 0;
    margin-left: 0px;
    margin-top: -25px;
    top: 43px;
    width: 40%; /* Thickness of the line */
    height: 2px;
    background-color: #eca73d;
    transform: translateX(-50%);
  }

  li > a {
    font-size: 10px;
  }
}

@media (min-width: 600px) and (max-width: 1199px) {
  #dos {
    transform: translateX(6vw); /* Maximum distance */
  }
  #tres {
    transform: translateX(-7vw);
  }
  ul {
    justify-content: center;
    flex-direction: row;
    height: auto;
    top: 70%;
    left: 0;
    right: 0;
    gap: 10%;
    padding-left: 0;
    margin-left: 0;
  }

  ul:not(:first-child)::before {
    content: '';
    position: absolute;
    margin: 0;
    margin-left: 0px;
    margin-top: -25px;
    top: 45px;
    width: 40%; /* Thickness of the line */
    height: 2px;
    background-color: #eca73d;
    transform: translateX(-50%);
  }
}

/* For larger screens: Maximum distance */
@media (min-width: 1200px) {
  #dos {
    transform: translateX(6vw); /* Maximum distance */
  }
  #tres {
    transform: translateX(-7vw);
  }
  ul {
    margin-left: 50px;
  }
}

</style>