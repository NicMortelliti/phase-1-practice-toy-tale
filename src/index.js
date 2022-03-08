let addToy = false;
let jsonServer = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const submitBtn = document.querySelector("input.submit");

  // Upon complete DOM load, initiate fetch toy function
  getThings();

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";

      // Call function to add event listener to submit button.
      // Populate newToyText with results from form text entries
      submitBtnListener(submitBtn, toyFormContainer);
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// SUBMIT button event listener and hand off
function submitBtnListener(submitBtn, formContainer) {
  // Add event listener to Submit button when displayed
  submitBtn.addEventListener("click", event => {
    event.preventDefault();

    // Assign variables for name and image text fields
    const nameField = document.querySelector("input.input-text");
    const imgField = document.getElementsByName("image");

    const formData = {
      name: nameField.value,
      image: imgField[0].value,
      likes: 0,
    };

    // Hide form panel after submit click
    formContainer.style.display = "none";

    // Send form data to postThings
    postThings(formData);
  });
}

// Generic fetch GET function that takes in an API url and passes the parsed json off to the nextFn
function getThings() {
  fetch(`${jsonServer}/toys`)
    .then(resp => resp.json())
    .then(json =>
      json.forEach(element => {
        createCard(element);
      })
    );
}

// Generic fetch POST function
function postThings(objectData) {
  // Create the configurationObject that will be passed in to the fetch
  const configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(objectData),
  };

  fetch(`${jsonServer}/toys`, configurationObject)
    .then(resp => resp.json())
    .then(json => createCard(json));
}

// Card object data is passed in as a parameter and passed into the appropriate html elements
function createCard(obj) {
  toyCollectionDiv = document.getElementById("toy-collection");

  const div = document.createElement("div");
  div.className = "card";
  div.id = `toy-${obj.id}`;

  const h2 = document.createElement("h2");
  h2.textContent = obj.name;

  const img = document.createElement("img");
  img.src = obj.image;
  img.className = "toy-avatar";

  const p = document.createElement("p");
  p.textContent = `${obj.likes} Likes`;

  const btn = document.createElement("button");
  btn.className = "like-btn";
  btn.id = obj.id;
  btn.textContent = "Like ❤️";

  div.appendChild(h2);
  div.appendChild(img);
  div.appendChild(p);
  div.appendChild(btn);

  toyCollectionDiv.appendChild(div);

  // Add event listener to like button
  btn.addEventListener("click", () => {
    obj.likes += 1;
    updateLike(obj);
  });
}

function updateLike(obj) {
  // Create the configurationObject that will be passed in to the fetch
  fetch(`${jsonServer}/toys/${obj.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then(resp => resp.json())
    .then(json => {
      document
        .getElementById(`toy-${obj.id}`)
        .getElementsByTagName("p")[0].textContent = `${json.likes} Likes`;
    })
    .catch(() => alert(`Sorry, that didn't work.`));
}
