window.addEventListener('load', function() {
    let particles = [];
    let searchTimeout;

    // Fetch the particles data from particles.json
    fetch('particles.json')
        .then(response => response.json())
        .then(data => {
            particles = data; // Store the fetched particles data
        })
        .catch(error => console.error('Error loading particles data:', error));

    // Add event listener to the search box for input events
    document.getElementById('searchBox').addEventListener('input', function() {
        clearTimeout(searchTimeout); // Clear the previous timeout
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase(); // Get the search query and convert to lowercase
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Clear previous results

            if (query === '') {
                document.body.classList.remove('results-visible'); // Hide results if query is empty
                document.body.classList.remove('search-active'); // Hide results if query is empty
                return;
            }

            // Check for exact PDG code match
            const exactMatch = particles.find(particle => particle.pdgCode.toString() === query);

            let filteredParticles;
            if (exactMatch) {
                filteredParticles = [exactMatch]; // If exact match found, use it
            } else {
                // Filter particles based on name or PDG code
                filteredParticles = particles.filter(particle => 
                    particle.full_name.toLowerCase().includes(query) || 
                    particle.pdgCode.toString().includes(query)
                );
            }

            if (filteredParticles.length > 0) {
                document.body.classList.add('results-visible'); // Show results if any particles match
                document.body.classList.add('search-active'); // Add class to hide toggle button
            } else {
                document.body.classList.remove('results-visible'); // Hide results if no particles match
                document.body.classList.remove('search-active'); // Remove class to show toggle button
            }

            // Function to highlight the search query in the results
            const highlight = (text, query) => {
                const regex = new RegExp(`(${query})`, 'gi');
                return text.replace(regex, '<span class="highlight">$1</span>');
            };

            // Display the filtered particles
            filteredParticles.forEach(particle => {
                const highlightedName = highlight(particle.full_name, query);
                const highlightedPdgCode = highlight(particle.pdgCode.toString(), query);
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    <div class="katex-container">
                        <span class="latex particle-latex">$${particle.latex_name}$</span>
                    </div><br>
                    <span class="particle-info particle-info-name">Name: ${highlightedName}</span><br>
                    <span class="particle-info particle-info-code">PDG Code: ${highlightedPdgCode}</span>
                `;
                resultsContainer.appendChild(div); // Append the result item to the results container
            });

            // Render LaTeX for the particle names
            renderMathInElement(resultsContainer, {
                delimiters: [
                    {left: "$", right: "$", display: true},
                ],
                throwOnError: true
            });
        }, 300); // Debounce the search input
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark'); // Enable dark mode
        } else {
            document.body.classList.remove('dark'); // Disable dark mode
        }
    });
});

// Ensure the theme is consistent with the user's preference
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark'); // Apply dark mode if previously set
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark'); // Enable dark mode
            localStorage.setItem('theme', 'dark'); // Save preference to local storage
        } else {
            document.body.classList.remove('dark'); // Disable dark mode
            localStorage.setItem('theme', 'light'); // Save preference to local storage
        }
    });
});

// Automatically focus the search box when the page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').focus();
});