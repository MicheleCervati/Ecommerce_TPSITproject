document.addEventListener('DOMContentLoaded', () => {
    const nomeFileJSON = "/json/prodotti.json";

    let product = null; // Memorizza il prodotto selezionato
    let selectedColor = null; // Memorizza il colore selezionato

    productId = -1;

    // Ottiene i dati dei prodotti
    fetch(nomeFileJSON)
      .then(response => {
        if (!response.ok) {
          throw new Error("Errore nel caricamento del file JSON");
        }
        return response.json();
      })
      .then(data => {
        productId = parseInt(localStorage.getItem("selectedProductId"), 10);
        const selectedProductColor = localStorage.getItem("selectedProductColor");

        if (isNaN(productId)) {
          throw new Error("ID prodotto non valido");
        }

        product = data.products.find(p => p.id === productId);

        if (!product) {
          throw new Error("Prodotto non trovato");
        }

        // Popola il DOM con le informazioni del prodotto
        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-category").textContent = `Categoria: ${product.category}`;

        // Genera i pulsanti per i colori
        const colorButtonsContainer = document.getElementById("color-buttons");
        product.colors.forEach((colorOption, index) => {
          const button = document.createElement("button");
          button.textContent = colorOption.color;
          button.classList.add("btn", "btn-outline-primary", "m-1", "color-button");

          if (colorOption.color === selectedProductColor) {
            button.classList.add("btn-primary");
            selectedColor = colorOption;
            button.style.color = 'white';
            document.getElementById("product-image").src = selectedColor.image;
            document.getElementById("product-price").textContent = `Prezzo: €${selectedColor.price.toFixed(2)}`;
            updateSizes(selectedColor.sizes);
          }

          button.addEventListener("click", () => {
            // Rimuove la selezione dai pulsanti precedenti
            document.querySelectorAll(".color-button").forEach(btn => {
              btn.classList.remove("btn-primary");
              btn.classList.add("btn-outline-primary");
              btn.style.color = 'blue';
            });

            // Aggiungi il colore bianco quando il pulsante è selezionato
            button.classList.add("btn-primary");
            button.classList.remove("btn-outline-primary");
            button.style.color = 'white';
            selectedColor = colorOption;

            // Aggiorna l'immagine, il prezzo e le taglie disponibili
            document.getElementById("product-image").src = selectedColor.image;
            document.getElementById("product-price").textContent = `Prezzo: €${selectedColor.price.toFixed(2)}`;
            updateSizes(selectedColor.sizes);
          });

          colorButtonsContainer.appendChild(button);
        });
      })
      .catch(error => {
        console.error("Si è verificato un errore:", error.message);
      });

    function updateSizes(sizes) {
      const sizeButtonsContainer = document.getElementById("size-buttons");
      sizeButtonsContainer.innerHTML = ''; // Pulisce i pulsanti delle taglie precedenti
      const addToCartButton = document.getElementById("add-to-cart");

      let selectedSize = null;

      sizes.forEach(size => {
        const button = document.createElement("button");
        button.textContent = size;
        button.classList.add("btn", "btn-outline-primary", "m-1", "size-button");

        button.addEventListener("click", () => {
          // Rimuove la selezione dai pulsanti precedenti
          document.querySelectorAll(".size-button").forEach(btn => {
            btn.classList.remove("btn-primary");
            btn.classList.add("btn-outline-primary");
          });

          // Aggiungi il colore bianco quando il pulsante è selezionato
          button.classList.add("btn-primary");
          button.classList.remove("btn-outline-primary");
          selectedSize = size;
          addToCartButton.disabled = false;
        });

        sizeButtonsContainer.appendChild(button);
      });

      addToCartButton.addEventListener("click", () => {
        if (selectedSize) {
          alert(`Hai modificato correttamente il prodotto nel carrello: ${product.title}, colore ${selectedColor.color}, taglia ${selectedSize}`);

          localStorage.setItem('prodottoAcquistatoMod', productId);
          localStorage.setItem('tagliaAcquistataMod', selectedSize);
          localStorage.setItem('coloreAcquistatoMod', selectedColor.color);

          window.location.href = "/listaProdotti/listaProdotti.html";
        }
      });
    }

    document.getElementById("view-features").addEventListener("click", () => {
        window.location.href = "/caratteristicheProdotto/caratteristiche.html";
    });

    document.getElementById("back-to-shopping").addEventListener("click", () => {
        window.location.href = "/listaProdotti/listaProdotti.html";
    });
});