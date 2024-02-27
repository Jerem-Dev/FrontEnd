//Get all the works stored in the API and transform the data in JSON
let works = {};
try {
  const fetchWorks = await fetch("http://localhost:5678/api/works");
  works = await fetchWorks.json();
} catch (error) {
  console.error("Failed to fetch data from API", error);
}

console.table(works);
//Update works in the DOM by creating a figure who contains and img and a figcaption
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

// Show all works
const allFilter = document.querySelector("#all");
allFilter.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(works);
});

// Show only works who are objects
const objectsFilter = document.querySelector("#objects");
objectsFilter.addEventListener("click", function () {
  const objectsWorks = works.filter((work) => work.categoryId === 1);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(objectsWorks);
});

//Show only works who are appartment
const appartmentFilter = document.querySelector("#appartment");
appartmentFilter.addEventListener("click", function () {
  const appartmentWorks = works.filter((work) => work.categoryId === 2);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(appartmentWorks);
});

//Show only works who are hotels or restaurants
const hotelRestaurantFilter = document.querySelector("#hotel-restaurant");
hotelRestaurantFilter.addEventListener("click", function () {
  const hotelRestaurantWorks = works.filter((work) => work.categoryId === 3);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(hotelRestaurantWorks);
});
