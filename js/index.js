const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const userResults = document.getElementById('user-results');
const repoResults = document.getElementById('repo-results');
const toggleSearchButton = document.getElementById('toggle-search-type');

let isUserSearch = true; // By default, search for users

// Function to fetch users from the GitHub API
async function searchUsers(query) {
  const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const data = await response.json();
  displayUserResults(data.items);
}

// Function to fetch repositories from the GitHub API
async function searchRepos(query) {
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const data = await response.json();
  displayRepoResults(data.items);
}

// Function to display users in the DOM
function displayUserResults(users) {
  userResults.innerHTML = ''; // Clear previous results

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');

    userDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50" height="50">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
    `;

    userDiv.addEventListener('click', () => fetchUserRepos(user.login));

    userResults.appendChild(userDiv);
  });
}

// Function to fetch and display repositories for a specific user
async function fetchUserRepos(username) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const data = await response.json();
  displayRepoResults(data);
}

// Function to display repositories in the DOM
function displayRepoResults(repos) {
  repoResults.innerHTML = ''; // Clear previous results

  repos.forEach(repo => {
    const repoDiv = document.createElement('div');
    repoDiv.classList.add('repo');

    repoDiv.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;

    repoResults.appendChild(repoDiv);
  });
}

// Event listener for the search form submission
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (query) {
    if (isUserSearch) {
      searchUsers(query);
    } else {
      searchRepos(query);
    }
  }
});

// Toggle between user and repo search
toggleSearchButton.addEventListener('click', () => {
  isUserSearch = !isUserSearch;
  toggleSearchButton.textContent = isUserSearch ? 'Search Repositories' : 'Search Users';
  userResults.innerHTML = ''; // Clear user results
  repoResults.innerHTML = ''; // Clear repo results
});
