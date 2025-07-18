document.addEventListener('DOMContentLoaded', () => {
  loadRecipes();
  
  // Form submission handler
  document.getElementById('recipe-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
      title: document.getElementById('title').value,
      image: document.getElementById('image').value,
      instructions: document.getElementById('instructions').value,
      ingredients: document.getElementById('ingredients').value.split(',').map(item => item.trim()),
      readyInMinutes: parseInt(document.getElementById('readyInMinutes').value)
    };
    
    axios.post('/api/recipes', formData)
      .then(() => {
        loadRecipes();
        this.reset();
      })
      .catch(error => {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe. Check console for details.');
      });
  });

  // Search functionality
  document.getElementById('search-btn')?.addEventListener('click', searchRecipes);
  
  // Random recipes
  document.getElementById('random-btn')?.addEventListener('click', showRandomRecipes);
});

// Load all recipes
async function loadRecipes() {
  try {
    const response = await axios.get('/api/recipes');
    displayRecipes(response.data);
  } catch (error) {
    console.error('Failed to load recipes:', error);
    alert('Failed to load recipes. Check console for details.');
  }
}

// Display recipes
function displayRecipes(recipes) {
  const container = document.getElementById('recipes-container');
  if (!container) return;
  
  container.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" data-id="${recipe.id}">
      <img src="${recipe.image || 'https://via.placeholder.com/300'}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${recipe.readyInMinutes} mins | ${recipe.ingredients.length} ingredients</p>
      <div class="recipe-actions">
        <button class="edit-btn" data-id="${recipe.id}">Edit</button>
        <button class="delete-btn" data-id="${recipe.id}">Delete</button>
      </div>
    </div>
  `).join('');

  // Add event listeners to all buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      deleteRecipe(this.dataset.id);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      editRecipe(this.dataset.id);
    });
  });
}

// Search functionality
async function searchRecipes() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return loadRecipes();
  
  try {
    const response = await axios.get(`/api/recipes/search/${encodeURIComponent(query)}`);
    displayRecipes(response.data);
  } catch (error) {
    console.error('Search failed:', error);
    alert('Search failed. Check console for details.');
  }
}

// Random recipes
async function showRandomRecipes() {
  try {
    const response = await axios.get('/api/recipes/random/3');
    displayRecipes(response.data);
  } catch (error) {
    console.error('Failed to get random recipes:', error);
    alert('Failed to get random recipes. Check console for details.');
  }
}

// Delete recipe
async function deleteRecipe(id) {
  if (!confirm('Are you sure you want to delete this recipe?')) return;
  
  try {
    await axios.delete(`/api/recipes/${id}`);
    loadRecipes();
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Failed to delete recipe. Check console for details.');
  }
}

// Edit recipe (basic implementation)
async function editRecipe(id) {
  try {
    const response = await axios.get(`/api/recipes/${id}`);
    const recipe = response.data;
    
    // Fill a form or show a modal here
    console.log('Editing recipe:', recipe);
    alert(`Edit mode for: ${recipe.title}\nImplement your edit form/modal here.`);
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    alert('Failed to load recipe for editing. Check console for details.');
  }
}