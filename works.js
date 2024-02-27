//Get all the works stored in the API and transform the data in JSON
async function getWorks() {
  try {
    const fetchWorks = await fetch("http://localhost:5678/api/works");
    worksJson = await fetchWorks.json();
    return worksJson;
  } catch (error) {
    console.error("Failed to fetch data from API", error);
  }
}

//Update works in the DOM by creating a figure who contains and img and a figcaption
async function updateWorks() {
  const works = await getWorks();
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

updateWorks();
