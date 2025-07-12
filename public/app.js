document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');

  function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(recipe => recipe.id === id);
  }

  function addToFavorites(recipe) {
    const favorites = getFavorites();
    if (isFavorite(recipe.id)) {
      alert('Recipe already in favorites!');
      return;
    }
    favorites.push(recipe);
    saveFavorites(favorites);
    alert(`Added "${recipe.title}" to favorites!`);
  }

  function removeFromFavorites(id) {
    let favorites = getFavorites();
    favorites = favorites.filter(recipe => recipe.id !== id);
    saveFavorites(favorites);
    alert('Recipe removed from favorites.');
    if (typeof renderFavorites === 'function') renderFavorites();
  }

  function renderRecipes(recipes) {
    if (recipes.length === 0) {
      searchResults.innerHTML = '<p>No recipes found.</p>';
      return;
    }
    const html = recipes.map(r => `
      <div class="recipe">
        <h3>${r.title}</h3>
        <img src="${r.image || ''}" alt="${r.title}" width="200" />
        <p>${r.instructions || ''}</p>
        <p>Ingredients: ${r.ingredients.join(', ')}</p>
        <button data-id="${r.id}" class="add-fav-btn">Add to Favorites</button>
      </div>
    `).join('');
    searchResults.innerHTML = html;

    const buttons = searchResults.querySelectorAll('.add-fav-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.getAttribute('data-id'));
        const recipe = recipes.find(r => r.id === id);
        if (recipe) addToFavorites(recipe);
      });
    });
  }

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.innerHTML = '<p>Please enter a search term.</p>';
      return;
    }
    searchResults.innerHTML = '<p>Searching...</p>';

    axios.get(`/api/recipes/search?q=${encodeURIComponent(query)}`)
      .then(response => {
        renderRecipes(response.data);
      })
      .catch(err => {
        console.error(err);
        searchResults.innerHTML = '<p>Error loading search results.</p>';
      });
  });

  window.renderFavorites = function() {
    const favoritesContainer = document.getElementById('favorites');
    if (!favoritesContainer) return;

    const favorites = getFavorites();
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p>No favorite recipes yet.</p>';
      return;
    }

    const html = favorites.map(r => `
      <div class="recipe">
        <h3>${r.title}</h3>
        <img src="${r.image || ''}" alt="${r.title}" width="200" />
        <p>${r.instructions || ''}</p>
        <p>Ingredients: ${r.ingredients.join(', ')}</p>
        <button data-id="${r.id}" class="delete-fav-btn">Remove from Favorites</button>
      </div>
    `).join('');
    favoritesContainer.innerHTML = html;

    const deleteButtons = favoritesContainer.querySelectorAll('.delete-fav-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.getAttribute('data-id'));
        if (confirm('Remove this recipe from favorites?')) {
          removeFromFavorites(id);
        }
      });
    });
  };

  if (document.getElementById('favorites')) {
    renderFavorites();
  }
});
