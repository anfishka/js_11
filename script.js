let main = document.getElementsByClassName("main")[0];
if (!main) {
  main = createElem("main", document.body);
}
let api = "k5yNIE9fLZhEE37wMZjWrtUihx02";
let btn_get_random_dog = createElem("btn_get_random_dog", main);
let imgContainer = createElem("img_container", main);

function createElem(name, place) {
  let elem = document.createElement("div");
  elem.classList.add(name);

  if (place) {
    place.appendChild(elem);
  }

  return elem;
}

btn_get_random_dog.addEventListener("click", (e) => {
  fetchDogImage();
});

function fetchDogList() {
  fetch("https://dog.ceo/api/breeds/list/all")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        populateBreedList(data.message);
      } else {
        console.error("Failed to fetch dog breeds");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function fetchDogImage(selected_breed = '', selected_sub_breed = '') {
  let url;

  if (selected_sub_breed) {
    url = `https://dog.ceo/api/breed/${selected_breed}/${selected_sub_breed}/images/random`;
  } else if (selected_breed) {
    url = `https://dog.ceo/api/breed/${selected_breed}/images/random`;
  } else {
    url = `https://dog.ceo/api/breeds/image/random`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const dogImage = data.message;
        fetch(`https://studio.pixelixe.com/api/blur/v1?apiKey=${api}&value=3&imageUrl=${dogImage}`)
          .then((response) => response.blob())
          .then((myBlob) => {
            var reader = new FileReader();
            reader.readAsDataURL(myBlob);
            reader.onloadend = function () {
                var base64Image = reader.result;
                
              main.style.backgroundImage = `url(${base64Image})`;
              imgContainer.style.backgroundImage = `url(${dogImage})`;
            };
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.error("Failed to fetch dog image");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function populateBreedList(breedData) {
  let list_container = createElem("list_container", main);

  let form = document.createElement("form");

  let select = document.createElement("select");
  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select breed";
  select.appendChild(defaultOption);
  form.appendChild(select);

  for (const breed in breedData) {
    if (breedData[breed].length > 0) {
      let optgroup = document.createElement("optgroup");
      optgroup.label = breed;
      select.appendChild(optgroup);

      breedData[breed].forEach((subBreed) => {
        let option = document.createElement("option");
        option.value = `${breed}/${subBreed}`;
        option.textContent = `${subBreed} (${breed})`;
        optgroup.appendChild(option);
      });
    } else {
      let option = document.createElement("option");
      option.value = breed;
      option.textContent = breed;
      select.appendChild(option);
    }
  }
  form.appendChild(select);
  list_container.appendChild(form);

  select.addEventListener("change", (e) => {
      const [selectedBreed, selectedSubBreed] = e.target.value.split("/");
 fetchDogImage(selectedBreed, selectedSubBreed || "");   
  });
}

fetchDogList();
fetchDogImage();