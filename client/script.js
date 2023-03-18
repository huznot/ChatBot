import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++
    } else {
      clearInterval(interval);
    }
  }, 20)
}



function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class = "wrapper ${isAi && 'ai' }">
        <div class="chat">
          <div class= "profile">
            <img
              src ="${isAi ? bot: user}"
              alt ="${isAi ? 'bot': 'user'}"
            />
          </div>
          <div class="message" id = ${uniqueId}>${value}</div>
        </div>
      </div>
    
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const prompt = data.get('prompt').trim();
  
  if (prompt.length === 0) {
    return;
  }
  //user message
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();


  //bot message
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //if statement
  if (prompt.toLowerCase().trim().replace(/\s+/g, ' ').replace("?", '').replace("'", '') === "who made you"|| prompt.toLowerCase().trim().replace(/\s+/g, ' ').replace("?", '').replace("'", '') === "who made u" ) {
    typeText(messageDiv, "A man named Muhammad Huzaifa");
    return;
  }
  else if (prompt.toLowerCase().trim().replace(/\s+/g, ' ').replace("?", '').replace("'", '') === "how were you made") {
    typeText(messageDiv, "A man named Muhammad Huzaifa programmed me and bought me to life");
    return;
  }
  
  
  
  

  // fetch bot response

  const response = await fetch('https://chatbot-p26g.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})

//bot greeting
function greetUser() {
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  typeText(messageDiv, "Hello! How can I help you?");
}

window.onload = greetUser;
