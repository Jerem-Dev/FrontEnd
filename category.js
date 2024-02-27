// Get categories from API
async function getCategories() {
  try {
    const fetchCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await fetchCategories.json();
    console.table(categories);
    return categories;
  } catch (error) {
    console.error("Failed to fetch data from API", error);
  }
}

getCategories();
