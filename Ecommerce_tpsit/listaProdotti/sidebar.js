document.addEventListener('DOMContentLoaded', () => {
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');

    function renderCartItems() {

        cartItemsContainer.innerHTML = '';
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
<div class="card mb-3 p-2">
    <div class="row g-2">
        <div class="col-4">
            <img src="${item.image}" alt="Image of ${item.title} in size ${item.size}" class="img-fluid rounded">
        </div>
        <div class="col-8 d-flex flex-column">
            <div class="flex-grow-1">
                <p class="fw-bold mb-1">${item.title}</p>
                <p class="text-muted small mb-1">Colore: ${item.color}</p>
                <p class="text-muted small mb-1">Taglia: ${item.size}</p>
                <p class="fw-semibold text-primary">€${item.price.toFixed(2)}</p>
                <p class="modify-button">Modifica</p>
            </div>
            <div class="d-flex justify-content-end align-items-end">
                <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">X</button>
            </div>
        </div>
    </div>
</div>
            `;
            cartItemsContainer.appendChild(li);

            //MODIFICA PRODOTTO
            li.addEventListener('click', (event) => {
                if (!event.target.classList.contains('remove-from-cart')) {
                    localStorage.setItem('selectedProductIndex', index);
                    localStorage.setItem('selectedProductId', item.id);
                    localStorage.setItem('selectedProductColor', item.color);
                    localStorage.setItem('isModifyingProduct', 'true');
                    window.location.href = '/prodottoSingoloModifica/prodottoSingolo.html';
                }
            });
        });

        // Update checkout button state
        if (cartItems.length > 0) {
            checkoutButton.classList.remove('btn-secondary');
            checkoutButton.classList.add('btn-success');
            checkoutButton.disabled = false;
        } else {
            checkoutButton.classList.remove('btn-success');
            checkoutButton.classList.add('btn-secondary');
            checkoutButton.disabled = true;
        }
    }



    function removeFromCart(itemId) {
        const itemIndex = cartItems.findIndex(item => item.id === parseInt(itemId));
        if (itemIndex > -1) {
            cartItems.splice(itemIndex, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartItems();
        }
    }

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const itemId = event.target.dataset.id;
            removeFromCart(itemId);
        }
    });

    checkoutButton.addEventListener('click', () => {
        if (cartItems.length > 0) {
            window.location.href = '/../carrello.html';
        }
    });

    renderCartItems();

    if(localStorage.getItem("isModifyingProduct")){
        const prodottoAcquistatoMod = localStorage.getItem("prodottoAcquistatoMod");
        const tagliaAcquistataMod = localStorage.getItem("tagliaAcquistataMod");
        const coloreAcquistatoMod = localStorage.getItem("coloreAcquistatoMod");
        const selectedProductIndex = parseInt(localStorage.getItem('selectedProductIndex'), 10);

        if (prodottoAcquistatoMod && tagliaAcquistataMod && coloreAcquistatoMod) {
            const productId = parseInt(prodottoAcquistatoMod, 10);

            fetch('/../json/prodotti.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Errore nel caricamento del file JSON");
                    }
                    return response.json();
                })
                .then(data => {
                    if (isNaN(productId)) {
                        throw new Error("ID prodotto non valido");
                    }

                    const product = data.products.find(p => p.id === productId);

                    if (!product) {
                        throw new Error("Prodotto non trovato");
                    }

                    const colorOption = product.colors.find(c => c.color === coloreAcquistatoMod);

                    if (!colorOption) {
                        throw new Error("Colore non trovato");
                    }

                    const item = {
                        id: product.id,
                        title: product.title,
                        size: tagliaAcquistataMod,
                        image: colorOption.image,
                        price: colorOption.price,
                        category: product.category,
                        color: colorOption.color
                    };


                        
                    cartItems[selectedProductIndex] = item;


                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    renderCartItems();

                    // Rimuovi il prodotto acquistato dal local storage
                    localStorage.removeItem('prodottoAcquistatoMod');
                    localStorage.removeItem('tagliaAcquistataMod');
                    localStorage.removeItem('coloreAcquistatoMod');
                    localStorage.removeItem('selectedProductIndex');
                })
                .catch(error => {
                    console.error("Errore:", error);
                });
                localStorage.setItem('isModifyingProduct', 'false');
                
    }else{

    const prodottoAggiunto = localStorage.getItem("prodottoAcquistato");
    const tagliaAcquistata = localStorage.getItem("tagliaAcquistata");
    const coloreAcquistato = localStorage.getItem("coloreAcquistato");

    if (prodottoAggiunto && tagliaAcquistata && coloreAcquistato) {
        const productId = parseInt(prodottoAggiunto, 10);

        fetch('/../json/prodotti.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nel caricamento del file JSON");
                }
                return response.json();
            })
            .then(data => {
                if (isNaN(productId)) {
                    throw new Error("ID prodotto non valido");
                }

                const product = data.products.find(p => p.id === productId);

                if (!product) {
                    throw new Error("Prodotto non trovato");
                }

                const colorOption = product.colors.find(c => c.color === coloreAcquistato);

                if (!colorOption) {
                    throw new Error("Colore non trovato");
                }

                const item = {
                    id: product.id,
                    title: product.title,
                    size: tagliaAcquistata,
                    image: colorOption.image,
                    price: colorOption.price,
                    category: product.category,
                    color: colorOption.color
                };

      
                    cartItems.push(item);
                

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCartItems();

                // Rimuovi il prodotto acquistato dal local storage
                localStorage.removeItem('prodottoAcquistato');
                localStorage.removeItem('tagliaAcquistata');
                localStorage.removeItem('coloreAcquistato');
                localStorage.removeItem('selectedProductIndex');
            })
            .catch(error => {
                console.error("Errore:", error);
            });
    }}
    }
});