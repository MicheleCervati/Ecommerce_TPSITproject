document.addEventListener('DOMContentLoaded', () => {
    const productId = parseInt(localStorage.getItem("selectedProductId"), 10);
    if (isNaN(productId)) {
        console.error("ID prodotto non valido");
        return;
    }

    fetch('/json/prodotti.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id === productId);
            if (!product) {
                console.error("Prodotto non trovato");
                return;
            }

            const features = [
                { name: "Categoria", value: product.category },
                { name: "Materiale", value: product.materiale },
                { name: "Codice Articolo", value: product.codice_articolo },
                { name: "Fit", value: product.fit },
                { name: "Istruzioni Lavatrice", value: product.istruzioni_lavatrice }
            ];

            const tbody = document.getElementById("product-features");
            features.forEach(feature => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${feature.name}</td><td>${feature.value}</td>`;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Errore nel caricamento del file JSON:", error));

    document.getElementById("back-to-shopping").addEventListener("click", () => {
        window.location.href = "/listaProdotti/listaProdotti.html";
    });

    document.getElementById("continue-shopping").addEventListener("click", () => {
        const isModifying = localStorage.getItem('isModifyingProduct') === 'true';
        window.location.href = isModifying ? "/prodottoSingoloModifica/prodottoSingolo.html" : "/prodottoSingolo/prodottoSingolo.html";
    });
});