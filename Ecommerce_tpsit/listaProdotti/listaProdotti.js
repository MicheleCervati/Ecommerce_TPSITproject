document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const sidebar = document.getElementById('sidebar');
    const cartIcon = document.getElementById('cart-icon');

    // Gestisci l'apertura del carrello su schermi piccoli
    cartIcon.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Carica i prodotti dal file JSON
    fetch('/json/prodotti.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file JSON');
            }
            return response.json();
        })
        .then(data => {
            const products = data.products;

            // Pulisce il contenitore dei prodotti
            productContainer.innerHTML = '';

            // Crea dinamicamente le card dei prodotti con ID unici
            const uniqueProducts = [];
            products.forEach(product => {
                if (!uniqueProducts.some(p => p.id === product.id)) {
                    uniqueProducts.push(product);
                }
            });

            uniqueProducts.forEach(product => {
                const col = document.createElement('div');
                col.classList.add('col');

                const card = document.createElement('div');
                card.classList.add('card', 'h-100', 'prodotto'); // Aggiungi la classe 'prodotto'
                card.style.cursor = 'pointer';

                const img = document.createElement('img');
                img.classList.add('card-img-top');
                img.src = product.colors[0].image;
                img.alt = product.title;

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = product.title;

                const sizes = document.createElement('p');
                sizes.classList.add('card-text');
                sizes.innerHTML = `<strong>Taglie:</strong> ${product.colors[0].sizes.join(', ')}`;

                const color = document.createElement('p');
                color.classList.add('card-text');
                color.innerHTML = `<strong>Colore:</strong> ${product.colors.map(c => c.color).join(', ')}`;

                const price = document.createElement('p');
                price.classList.add('card-text');
                price.innerHTML = `<strong>Prezzo:</strong> €${product.colors[0].price.toFixed(2)}`;

                const colorButtonsContainer = document.createElement('div');
                colorButtonsContainer.classList.add('d-flex', 'flex-wrap', 'gap-2', 'mt-2');

                let selectedColor = product.colors[0].color; // Colore di default

                product.colors.forEach((colorOption, index) => {
                    const button = document.createElement('button');
                    button.textContent = colorOption.color;
                    button.classList.add('btn', 'btn-outline-primary', 'color-button');
                    if (index === 0) {
                        button.classList.add('btn-primary');
                        button.style.color = 'white'; //CARICAMENTO PAGINA COLORE BOTTONI
                    }

                    button.addEventListener('click', (event) => {
                        event.stopPropagation(); // Previene il reindirizzamento alla pagina del prodotto singolo

                        // Rimuove la selezione dai pulsanti precedenti
                        colorButtonsContainer.querySelectorAll('.color-button').forEach(btn => {
                            btn.classList.remove('btn-primary');
                            btn.classList.add('btn-outline-primary');
                            btn.style.color = ''; // Ripristina il colore predefinito
                        });

                        // Aggiungi il colore bianco quando il pulsante è selezionato
                        button.classList.add('btn-primary');
                        button.classList.remove('btn-outline-primary');
                        button.style.color = 'white'; // Imposta il colore del testo su bianco

                        // Aggiorna l'immagine, il prezzo e le taglie disponibili
                        img.src = colorOption.image;
                        price.innerHTML = `<strong>Prezzo:</strong> €${colorOption.price.toFixed(2)}`;
                        sizes.innerHTML = `<strong>Taglie:</strong> ${colorOption.sizes.join(', ')}`;

                        // Aggiorna il colore selezionato
                        selectedColor = colorOption.color;
                    });

                    colorButtonsContainer.appendChild(button);
                });

                cardBody.appendChild(title);
                cardBody.appendChild(sizes);
                cardBody.appendChild(color);
                cardBody.appendChild(price);
                cardBody.appendChild(colorButtonsContainer);
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                productContainer.appendChild(col);

                card.addEventListener('click', (event) => {
                    if (!event.target.classList.contains('color-button')) {
                        localStorage.setItem('selectedProductId', product.id);
                        localStorage.setItem('selectedProductColor', selectedColor);
                        window.location.href = '/prodottoSingolo/prodottoSingolo.html';
                    }
                });
            });
        })
        .catch(error => {
            console.error('Errore:', error);
        });
});