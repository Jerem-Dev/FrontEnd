// Update selected button
document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", function () {
    document
      .querySelectorAll(".filter")
      .forEach((filterRemove) => filterRemove.classList.remove("selected"));
    this.classList.add("selected");
  });
});
