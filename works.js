//Get all the works stored in the API and transform the data in JSON

export async function fetchWorks() {
  let works = {};
  try {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    return works;
  } catch (error) {
    console.error("Failed to fetch data from API", error);
  }
}

export let works = await fetchWorks();

console.table(works);

//Update the DOM by creating a <figure> for each works
export function updateWorks(works) {
  const gallery = document.querySelector(".gallery");

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const imgFigure = document.createElement("img");
    const imgFigcaption = document.createElement("figcaption");
    imgFigure.src = work.imageUrl;
    imgFigure.alt = work.title;
    imgFigcaption.textContent = work.title;
    gallery.appendChild(figure);
    figure.appendChild(imgFigure);
    figure.appendChild(imgFigcaption);
  });
}

updateWorks(works);

//CategoryId definition => 1 : Objects | 2 : Appartments | 3 Hotel & restaurant
// Show all works
const allFilter = document.querySelector("#all");
allFilter.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(works);
});

// Sort works show objects
const objectsFilter = document.querySelector("#objects");
objectsFilter.addEventListener("click", function () {
  const objectsWorks = works.filter((work) => work.categoryId === 1);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(objectsWorks);
});

//Sort works to show only appartments
const appartmentFilter = document.querySelector("#appartment");
appartmentFilter.addEventListener("click", function () {
  const appartmentWorks = works.filter((work) => work.categoryId === 2);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(appartmentWorks);
});

//Sort works to show only hotels or restaurants
const hotelRestaurantFilter = document.querySelector("#hotel-restaurant");
hotelRestaurantFilter.addEventListener("click", function () {
  const hotelRestaurantWorks = works.filter((work) => work.categoryId === 3);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(hotelRestaurantWorks);
});
