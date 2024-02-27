//Get all the works stored in the API and transform the data in JSON
let works = {};
try {
  const fetchWorks = await fetch("http://localhost:5678/api/works");
  works = await fetchWorks.json();
} catch (error) {
  console.error("Failed to fetch data from API", error);
}
console.table(works);

//Update the DOM by creating a <figure> for each works
function updateWorks(works) {
  const gallery = document.querySelector(".gallery");

  works.forEach((work) => {
    const figure = document.createElement("figure");
    gallery.appendChild(figure);
    const imgFigure = document.createElement("img");
    imgFigure.src = work.imageUrl;
    imgFigure.alt = work.title;
    figure.appendChild(imgFigure);
    const imgFigcaption = document.createElement("figcaption");
    imgFigcaption.textContent = work.title;
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
