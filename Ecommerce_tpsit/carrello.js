document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const checkoutButton = document.getElementById('checkout-button');
    const backToShoppingButton = document.getElementById('back-to-shopping');
    const couponCodeInput = document.getElementById('coupon-code');
    const applyCouponButton = document.getElementById('apply-coupon');
    const confettiContainer = document.getElementById('confetti-container');
    const bundleContainer = document.getElementById('bundle-container');
    const bundleSection = document.querySelector('.bundle-section');

    let totalAmount = 0;
    let discount = parseInt(localStorage.getItem('discount'), 10) || 0;

    if(localStorage.getItem('fromBundle') === true) {
        startConfetti();
        discount = 10;
        updateCheckoutButton();
        bundleSection.style.display = 'none';
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        totalAmount = 0;

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'mb-3');

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.classList.add('img-thumbnail', 'me-3');
            img.style.width = '100px';

            const details = document.createElement('div');
            details.classList.add('flex-grow-1');
            details.innerHTML = `
                <h5>${item.title}</h5>
                <p>Taglia: ${item.size}</p>
                <p>Colore: ${item.color}</p>
                <p class="fw-bold">€${item.price.toFixed(2)}</p>
            `;

            const removeButton = document.createElement('button');
            removeButton.classList.add('btn', 'btn-danger', 'ms-3');
            removeButton.textContent = 'Rimuovi';
            removeButton.addEventListener('click', () => {
                cartItems.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCartItems();
            });

            cartItem.appendChild(img);
            cartItem.appendChild(details);
            cartItem.appendChild(removeButton);
            cartItemsContainer.appendChild(cartItem);

            totalAmount += item.price;
        });

        updateCheckoutButton();
    }

    function updateCheckoutButton() {
        const discountedAmount = totalAmount * (1 - discount / 100);
        checkoutButton.innerHTML = discount > 0
            ? `Completa il pagamento di <span style="text-decoration: line-through; color: red;">€${totalAmount.toFixed(2)}</span> €${discountedAmount.toFixed(2)}`
            : `Completa il pagamento di €${discountedAmount.toFixed(2)}`;
    }

    function applyCoupon() {
        const couponCode = couponCodeInput.value.trim();
        fetch('/config/config.json')
            .then(response => response.json())
            .then(data => {
                const coupon = data.sconti.find(c => c.codice_sconto === couponCode);
                if (coupon) {
                    discount = coupon.valore_sconto;
                    alert(`Codice sconto applicato: ${discount}% di sconto`);
                    startConfetti();
                } else {
                    discount = 0;
                    alert('Codice sconto non valido');
                }
                updateCheckoutButton();
            })
            .catch(error => console.error('Errore nel caricamento del file JSON:', error));
    }



    function startConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confettiContainer.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    function renderBundle() {
        fetch('/json/prodotti.json')
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                const bundleProducts = [];

                while (bundleProducts.length < 3) {
                    const randomIndex = Math.floor(Math.random() * products.length);
                    const randomProduct = products[randomIndex];
                    if (!bundleProducts.includes(randomProduct)) {
                        bundleProducts.push(randomProduct);
                    }
                }

                localStorage.setItem('bundleProducts', JSON.stringify(bundleProducts.map(p => p.id)));

                bundleContainer.innerHTML = '';
                bundleProducts.forEach(product => {
                    const card = document.createElement('div');
                    card.classList.add('card', 'mb-3', 'bundle-card');
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

                    const colors = document.createElement('p');
                    colors.classList.add('card-text');
                    colors.innerHTML = `<strong>Colori:</strong> ${product.colors.map(c => c.color).join(', ')}`;

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
                    cardBody.appendChild(colors);
                    cardBody.appendChild(price);
                    cardBody.appendChild(colorButtonsContainer);
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    bundleContainer.appendChild(card);

                    card.addEventListener('click', () => {
                        localStorage.setItem('selectedProductId', product.id);
                        localStorage.setItem('selectedProductColor', selectedColor);
                        localStorage.setItem('fromBundle', 'true');
                        window.location.href = '/prodottoSingolo/prodottoSingolo.html';
                    });
                });
            })
            .catch(error => console.error('Errore nel caricamento del file JSON:', error));
    }

    renderCartItems();
    renderBundle();

    const fromBundle = localStorage.getItem('fromBundle') === 'true';
    if (fromBundle) {
        discount = 10;
        localStorage.setItem('discount', discount);
        startConfetti();
        bundleSection.style.display = 'none'; // Nascondi la sezione del bundle
        localStorage.removeItem('fromBundle');
        updateCheckoutButton();
    }

    backToShoppingButton.addEventListener('click', () => {
        window.location.href = '/../listaProdotti/listaProdotti.html';
    });

    applyCouponButton.addEventListener('click', applyCoupon);
});
