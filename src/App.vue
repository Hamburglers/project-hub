<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue'
import Todolist from './components/Todolist.vue'
import Sand from './components/Sandgame.vue'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

const routes = {
  '/todo': Todolist,
  '/sand': Sand
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
  window.addEventListener("scroll", reveal);
  var tl = gsap.timeline();
  tl.fromTo(".title", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
  tl.fromTo(".title1", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.5);
  tl.fromTo(".unotext", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1);
  let list = gsap.utils.toArray(".features");

  list.forEach((element) => {
    tl.fromTo(
      element.children,
      { x: -200, autoAlpha: 0 },
      {
        x: 0,
        duration: 0.75,
        autoAlpha: 1,
        force3D: true,
        //not sure what the new ease would be
        ease: "back.out(1.7)",
        stagger: 0.15
      }
    , 1.5);
  });

  tl.fromTo(".title3", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 2);

})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener("scroll", reveal);
});


const activeIndex = ref(null);

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const totalDocumentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const maxScrollPosition = totalDocumentHeight - viewportHeight;

  //38, 77, 92
  const percentage = scrollPosition / maxScrollPosition
  if (percentage < 0.38) {
    activeIndex.value = 0; // First item active
  } else if (percentage < 0.77) {
    activeIndex.value = 1; // Second item active
  } else {
    activeIndex.value = 2; // No item active
  }
  footerVisible.value = percentage < 0.92;
};

const footerVisible = ref(true);

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

function facebook() {
  window.location.href='https://facebook.com/'
}

function linkedin() {
  window.location.href='http://linkedin.com/'
}

function twitter() {
  window.location.href='https://twitter.com/'
}
</script>

<template>
  <div class="main" v-if="!currentView">
    <header class="container">
      <h2 class="title">hamburgler.xyz</h2>
    </header>
    <h4><span class="title1">A hub for projects made with&nbsp;<span class="vue">Vue.js</span></span></h4>
    <h4 id="last"><span class="title1">and hosted using&nbsp;<span class="go">Golang</span></span></h4>
    <Transition name="fade">
    <ul class='title3' v-scroll-spy-active v-scroll-spy-link v-show="footerVisible">
      <li :class="{ activeSection: activeIndex === 0 }">
        <a>To do list</a>
      </li>
      <li :class="{ activeSection: activeIndex === 1 }">
        <a>Falling Sand</a>
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
        </div>
        <ul class="features">
          <li>Saves user entries locally</li>
          <li>Public login system</li>
          <li>Uses Websocket and fallback HTTP requests to PostgreSQL database</li>
          <li>Logged-in users see real-time edits</li>
        </ul>
      </section>
      <section id="dos">
        <div class="custom-shape-divider-top-1702011878">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
            </svg>
        </div>
        <div class="dostext reveal">
        <a href="#/sand"><img class="inverse padded" src="/sand.png"></a>
        <a href="#/sand" id="button" class="inverse">Try the Falling Sand Game</a>
        <br>
        A falling sand game with realistic physics and element interactions
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
        <div class="trestext reveal">
        <a href="#/todo"><img src="/blank.png"></a>
        <a href="#/todo" id="button">Coming soon</a>
        <br>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro velit ipsa quam quas voluptate quia blanditiis magni temporibus aut doloribus placeat, voluptatibus nemo pariatur incidunt aliquam cumque adipisci totam reiciendis!
        </div>
      </section>
    </section>
    <footer>
      <div id="top">
        <button @click="facebook"><img class="top" src="/icons8-facebook.svg"></button>
        <button @click="linkedin"><img class="top" src="/icons8-linkedin.svg"></button>
        <button @click="twitter"><img class="top" src="/icons8-twitter.svg"></button>
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
@import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;500&display=swap');

body {
  display: flex;
  font-family: "Dosis", sans-serif;
  font-size: larger;
  justify-content: center;
  align-items: center;
  background-color: white;
  min-width: none;
  min-height: none;
  margin: 0px;
  overflow-x: hidden;
  overflow-y:hidden;
}

html {
  overflow-x: hidden;
  overscroll-behavior: none;
}

</style>

<style scoped>
svg {
  padding-bottom: 100px;
}
.features > li {
  color: white;
  font-size: 20px;
  width: 30vw;
  max-width: 400px;
  padding-left: 10px;
  box-sizing: border-box;
}

.features {
  display: flex;
  list-style: none;
  flex-direction: column;
  gap: 15px;
  justify-content: space-between;
  margin: 0;
  padding: 0;
}

.vue {
  color: #40b883;
}

.go {
  color: #29BEB0;
}
.reveal {
  opacity: 0;
  transform: translateY(80px);
  transition: opacity 0.5s, transform 0.5s; /* Transition for both opacity and transform */
}

.reveal.active {
  opacity: 1;
  transform: translateY(0); /* Reset to original position */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/*First wave*/
.custom-shape-divider-top-1702011878 {
    position: relative;
    margin-top: -150px;
    width: 120%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-top-1702011878 svg {
    position: relative;
    display: block;
    width: 100%;
    height: 100px;
}

.custom-shape-divider-top-1702011878 .shape-fill {
    fill: #e0546b;
}

/*Second wave*/
.custom-shape-divider-top-1702017514 {
    position: relative;
    width: 120%;
    margin-top: -200px;
    overflow: hidden;
    line-height: 0;
    border-bottom: 100px;
    padding-bottom: 100px;
}

.custom-shape-divider-top-1702017514 svg {
    position: relative;
    display: block;
    width: calc(150% + 1.3px);
    height: 150px;
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
  padding: 20px 0 10px 0px;
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

h4 {
  display: flex;
  justify-content: center;
  color: white;
  padding: 40px 0 0 0;
  padding-top: 0;
  background-color: #060B3E;
  margin: 0;
}

#last {
  padding-bottom: 40px;
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

.padded {
  padding: 10px;
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
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 20%;
  gap: 10px;
  justify-content: center;
  font-size: 20px;
  border-radius: 5px;
  color: white;
  margin-top: 10px;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s, scale 0.3s;
}

div > a:hover {
  cursor: pointer;
  color: black;
  scale: 1.03;
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
  padding-bottom: 0px;
  width: 100vw;
  margin-top: -40px;
}

img {
  width: 50vw;
  min-width: 400px;
  max-width: 600px;
  height: auto;
  left: 0px;
  border-radius: 15px;
  border: 2px solid black;
}

button > img {
  border-radius: 0;
}


#uno, #dos, #tres {
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%; /* Full width */
  padding: 150px 0;
  transition: transform 0.5s; /* Smooth transition for the transform */
}

.unotext, .dostext, .trestext {
  max-width: 600px;
  min-width: 400px;
  width: 35vw;
  font-size: 15px;
  font-size: 13px;
  text-align: center;
  margin: 0;
  color: white;
}

.unotext {
  padding-right: 40px;
}
.dostext {
  color: black;
}

/* Apply transform to shift each section */
#uno {
  flex-direction: row;
  background-color: #060b3e;
  background-image: url('/dragon-scales (1).svg');
  background-position: center;
  z-index: 2;
}

#tres {
  background-color: #060b3e;
  background-image: url('/wintery-sunburst.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 200%;
  z-index: 2;
  padding: 200px 0 300px 0;
}

ul:not(.features) {
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
ul:not(:first-child):not(.features)::before {
  content: '';
  position: absolute;
  margin-top: 20vh;
  margin-left: 10px;
  top: 55px;
  left: 0;
  width: 2px; /* Thickness of the line */
  background-color: #eca73d;
  height: calc(40vh + 80px); /* Adjust based on your design */
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
  width: 100px;
}

li > a {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #eca73d;
}

li > a:hover {
  cursor: pointer;
}

.activeSection {
  scale: 1.3;
}

/* For smaller screens: Minimum distance */
@media (max-width: 700px) {
  ul:not(.features) {
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
  ul:not(:first-child):not(.features)::before {
    content: '';
    position: absolute;
    margin: 0;
    margin-left: 0px;
    margin-top: -27px;
    top: 43px;
    width: calc(20vw + 160px); /* Thickness of the line */
    height: 2px;
    background-color: #eca73d;
    transform: translateX(-50%);
  }

  li > a {
    margin-top: 0;
    align-items: center;
    height: auto;
    font-size: 15px;
  }

  #uno {
    flex-direction: column;
  }

  a > img, a#button {
    width: 70vw;
    min-width: 0;
    max-width: 400px;
    margin: auto;
    margin-top: 10px;
  }

  .features > li {
    width: 70vw;
  }

  .unotext {
    padding: 0px;
    padding-bottom: 40px;
  }

  li {
    width: 18vw;
  }
}

@media (min-width: 700px) and (max-width: 799px) {
  ul:not(.features) {
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

  ul:not(:first-child):not(.features)::before {
    content: '';
    position: absolute;
    margin: 0;
    margin-left: 0px;
    margin-top: -25px;
    top: 45px;
    width: calc(20vw + 160px); /* Thickness of the line */
    height: 2px;
    background-color: #eca73d;
    transform: translateX(-50%);
  }

  .features > li {
    width: 25vw;
    font-size: 15px;
  }
}

@media (min-width: 800px) and (max-width: 1199px) {
  ul:not(.features) {
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

  ul:not(:first-child):not(.features)::before {
    content: '';
    position: absolute;
    margin: 0;
    margin-left: 0px;
    margin-top: -25px;
    top: 45px;
    width: calc(20vw + 160px); /* Thickness of the line */
    height: 2px;
    background-color: #eca73d;
    transform: translateX(-50%);
  }

  .features > li {
    width: 25vw;
  }
}

/* For larger screens: Maximum distance */
@media (min-width: 1200px) {
  ul {
    padding-left: 20px;
  }
}

</style>