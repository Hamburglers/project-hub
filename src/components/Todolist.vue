<script setup>
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios';

const list = ref([{text: 'Example', complete: false}]);
const inputValue = ref('');
const hideCompleted = ref(false)
const editingIndex = ref(-1)
const apiBaseUrl = 'https://hamburgler.xyz:8081';

// Save local data
watch(list, (newList) => {
  if (!isLoggedIn.value) {
    localStorage.setItem('myList', JSON.stringify(newList));
  }
}, { deep: true });


const savedList = localStorage.getItem('myList');
if (savedList) {
  list.value = JSON.parse(savedList);
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Push changes to list
async function submission() {
  if (inputValue.value.trim()) {
    if (editingIndex.value >= 0) {
      list.value[editingIndex.value].text = inputValue.value;
      // Edit existing database
      if (isLoggedIn.value && ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ action: 'edit', 
          id: list.value[editingIndex.value].id,
          text: list.value[editingIndex.value].text }));
      } else {
        // Fallback to HTTP request if WebSocket is not available
        await updateTodo(list.value[editingIndex.value]);
      }
      editingIndex.value = -1;
    } else {
      // Append to existing database
      if (isLoggedIn.value) {
        const newTodo = { text: inputValue.value, complete: false };
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
          ws.value.send(JSON.stringify({ action: 'add', text: inputValue.value }));
        } else {
          // Fallback to HTTP request if WebSocket is not available
          await addTodo(newTodo);
        }
      } else {
        list.value.push({ id: generateUniqueId(), text: inputValue.value, complete: false });
      }
    }
    inputValue.value = '';
  }
}

// Delete list items with 1 tick debounce
let isDeleting = false;

async function deleteItem(index) {
  if (isDeleting) return;
  isDeleting = true;
  const todo = list.value[index];
  if (isLoggedIn.value) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({ action: 'delete', id: todo.id }));
    } else {
      await deleteTodo(todo.id, index);
    }
  } else {
    list.value.splice(index, 1);
  }
  await nextTick();
  isDeleting = false;
}
const inputRef = ref(null);

// Edit list items
async function editItem(index) {
  inputValue.value = list.value[index].text;
  editingIndex.value = index;
  await nextTick();
  inputRef.value.select();
}

// If hide completed is selected, filter original list for uncompleted
const filteredList = computed(() => {
  let result = list.value;

  // Apply filter if necessary
  if (hideCompleted.value) {
    result = result.filter(item => !item.complete);
  }

  // Apply sorting if the user is logged in
  if (isLoggedIn) {
    return result.slice().sort((a, b) => a.id - b.id);
  } else {
    return result;
  }
});

// Handle dark mode and light mode
const switchMode = ref([
  { src: "/brightness.png" },
  { src: "/night-mode.png" }
]);

const modeIndex = ref(1);

function toggleMode() {
  modeIndex.value = modeIndex.value === 0 ? 1 : 0;
}

const darkBool = computed(() => modeIndex.value === 0);

watch(darkBool, (newValue) => {
  const bodyElement = document.querySelector('#body'); // Select the element with class 'body'

  if (newValue) {
    bodyElement.classList.add('dark');
    bodyElement.classList.remove('light');
  } else {
    bodyElement.classList.remove('dark');
    bodyElement.classList.add('light');
  }
});

const ws = ref(null);
onMounted(() => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  isLoggedIn.value = loggedIn;
  if (loggedIn) {
    originalList.value = [...list.value];
    fetchTodos();
  }

  const bodyElement = document.querySelector('#body'); // Select the element with class 'body'
  if (bodyElement) {
    bodyElement.classList.add(modeIndex.value === 0 ? 'dark' : 'light');
  }

  ws.value = new WebSocket('wss://hamburgler.xyz:8081/ws');
  ws.value.onmessage = (event) => {
  // Only update the list from WebSocket data if the user is logged in
    if (isLoggedIn.value) {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        list.value = data;
      } else if (data === null){
        list.value = []
      }
    }
  };

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  ws.value.onclose = function(event) {
    console.log("WebSocket Closed:", event.code, event.reason, event.wasClean);
  };
});

onBeforeUnmount(() => {
  list.value = [...originalList.value];
  if (ws.value) {
      ws.value.close(); // Close WebSocket connection when component is destroyed
  }
});

// Send new data to database after editing
const updateTodo = async (todo) => {
  try {
    await axios.patch(`${apiBaseUrl}/todos/${todo.id}`, todo);
    // Optionally, refresh the list or handle UI updates
  } catch (error) {
    console.error('Error updating the to-do:', error);
  }
  fetchTodos();
};

// Add new data after submission
const addTodo = async (todo) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/todos`, todo);
    // Handle the response, e.g., adding the new to-do with an ID returned from the server
    // This is important if your database generates unique IDs for new entries
    const addedTodo = { ...todo, id: response.data.id };
    list.value.push(addedTodo);
  } catch (error) {
    console.error('Error adding the to-do:', error);
  }
  fetchTodos();
};

// Delete data in database
const deleteTodo = async (id, index) => {
  try {
    await axios.delete(`${apiBaseUrl}/todos/${id}`);
    // Remove the item from the local list after successful deletion
    list.value.splice(index, 1);
  } catch (error) {
    console.error('Error deleting the to-do:', error);
  }
  fetchTodos();
};

// Update list with data if logged in
const fetchTodos = async () => {
  if (!isLoggedIn.value) {
    return; // Do not fetch if not logged in
  }

  try {
    const response = await axios.get(`${apiBaseUrl}/todos`);
    list.value = response.data;
  } catch (error) {
    console.error('Error fetching to-dos:', error);
  }
};

// Handle public login
const isLoggedIn = ref(false)
const originalList = ref([]);
// Save login state to local storage
function login() {
  localStorage.setItem('isLoggedIn', 'true');
  isLoggedIn.value = true;
  originalList.value = [...list.value];
  fetchTodos();
}

function logout() {
  localStorage.setItem('isLoggedIn', 'false');
  isLoggedIn.value = false;
  list.value = [...originalList.value];
  localStorage.setItem('myList', JSON.stringify(originalList.value));
}

function completion(item) {
  if (isLoggedIn.value && ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({ action: 'complete', id: item.id }));
  } else {
    item.complete = !item.complete
  }
}

function back() {
  window.location.hash = '/';
}

</script>

<template>
  <div id="body">
    <Transition>
      <header>
        <button @click="back" style="font-size:13px">Back</button>
        <button v-if="!isLoggedIn" @click="login" style="font-size: 13px; width: 100px;">Click to login</button>
        <button v-else @click="logout" style="font-size: 13px; width: 100px;">Logged in</button>
        <button @click="toggleMode"><img :src="switchMode[modeIndex].src" class="white-image"></button>
      </header>
    </Transition>
    <h2>To do</h2>
    <form @submit.prevent="submission">
      <input ref="inputRef" placeholder="e.g. Walk Odie" v-model="inputValue">
      <button id="add">+</button>
    </form>
    <ul>
      <transition-group name="list" tag="ul">
        <li v-for="(item, index) in filteredList"
            :key="item.id" 
            @click="completion(item)"
            :class="{ complete: item.complete }">
            <div id="text">{{ item.text }}</div>
            <div id="buttons">
              <button @click.stop="editItem(index)" class="edit"><img src="/edit.png"></button>
              <button @click.stop="deleteItem(index)" class="delete"><img src="/delete.png"></button>
            </div>
        </li>
      </transition-group>
    </ul>
    <footer>
      <button v-show="!hideCompleted" @click="hideCompleted = !hideCompleted" id="hide">Hide completed</button>
      <button v-show="hideCompleted" @click="hideCompleted = !hideCompleted" id="hide">View completed</button>
    </footer>
  </div>
</template>


<style scoped>

img {
  width: 20px;
  height: 20px;
  position: relative;
  left: 4px;
  display: flex;
}

div {
  display: flex;
  flex-direction: column;
}

div#buttons {
  flex-direction: row;
}

div#body {
  font-family: "Roboto", sans-serif;
  font-size: larger;
  display: flex;
  height: 100dvh;
  width: 100vw;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 50px;
  margin: 0px;
  position: relative;
  box-sizing: border-box;
  overscroll-behavior: none;
  touch-action: manipulation;
}


.light {
  background-image: linear-gradient(to right, rgb(255, 134, 255), rgb(113, 113, 250));
}

.dark {
  background-image: linear-gradient(to right, rgb(115, 39, 115), rgb(33, 33, 103));
}

h2 {
  text-align: center;
  padding: 20px;
  color: white;
}

.complete {
  text-decoration: line-through;
  color: white;
  background-color: rgb(193, 193, 193);
}

form {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

input {
  font-size: larger;
  width: 50vw;
  max-width: 200px;
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  color: white;
}

::placeholder {
  color: white;
}

:focus {
  outline: none;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 15px 20px 10px 20px;
  gap: 15px;
  max-height: 350px;
  overflow-x: hidden;
  overflow-y: auto; /* Make it scrollable */
  flex: 1;
}

/* Styles for scrollbar */
ul::-webkit-scrollbar {
  width: 10px;
}

ul::-webkit-scrollbar-thumb {
  background: #ffffff; 
}

ul::-webkit-scrollbar-thumb:hover {
  background: #ffffff; 
}

li {
  box-shadow: 3px 3px 3px black;
  border: 0.5px solid black;
  background-color: white;
  padding: 7px;
  width: 65vw;
  max-width: 500px;
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: transform 0.3s ease;
}

#text {
  max-width: 50vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

li:hover {
  transform: scale(1.05);
}

button {
  background-color: transparent;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  padding: 0px;
  font-size: large;
  user-select: none;
  transition: transform 0.3s ease;
}

header > button:hover {
  transform: scale(1.2);
}

header > button {
  border: none;
}

.white-image {
  filter: invert(100%) brightness(2);
}

header {
  display: flex;
  justify-content: space-between;
  max-width: 515px; /* 500px + 7px padding each side + 0.5px border each side*/
  width: 65vw;
}

#add, #hide {
  transition: font-size 0.3s ease;
}

#add:hover, #hide:hover {
  font-size: 20px;
}

.edit:hover, .delete:hover {
  transform: scale(1.2);
}

li, li:focus, button, button:focus, .edit, .edit:focus, .delete, .delete:focus {
  cursor: pointer;
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

button.edit, button.delete {
  color: black;
  margin-left: 10px;
  background-color: #f0f0f0;
  color: black;
  border: 1px solid #ddd;
}

#hide {
  width: auto;
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
}

@media (max-width: 600px) {
  img {
    width: 15px;
    height: 15px;
  }

  button {
    width: 25px;
    height: 25px;
  }

  input, footer, ul {
    font-size: 18px;
  }

  ul {
    max-height: 47vh;
  }

  h2 {
    font-size: larger;
  }

  div#body {
    box-sizing: border-box;
    height: 100dvh;
    width: 100vw;
    justify-content: flex-start;
    padding-bottom: 0;
  }
}

</style>