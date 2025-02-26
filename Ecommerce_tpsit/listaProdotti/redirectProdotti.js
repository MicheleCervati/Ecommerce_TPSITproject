document.addEventListener('DOMContentLoaded', () => {
  // Seleziona tutte le card dei prodotti
  const productCards = document.querySelectorAll('.card');

  // Aggiungi animazione hover a ogni card
  productCards.forEach((card, index) => {
    // Aggiungi classe per animazione al passaggio del cursore
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.1)'; // Ingrandisci la card
      card.style.border = '2px solid green'; // Cambia il bordo a verde
      card.style.transition = 'transform 0.3s, border 0.3s'; // Aggiungi transizione
    });

    // Rimuovi animazione quando il cursore lascia la card
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)'; // Ripristina la dimensione originale
      card.style.border = ''; // Ripristina il bordo originale
    });

    // Aggiungi evento click per reindirizzare alla pagina prodottoSingolo.html
    card.addEventListener('click', () => {
      // Memorizza l'ID del prodotto nel localStorage
      localStorage.setItem('selectedProductId', index);

      // Memorizza il colore selezionato nel localStorage
      const selectedColorButton = card.querySelector('.color-button.btn-primary');
      if (selectedColorButton) {
        localStorage.setItem('selectedProductColor', selectedColorButton.textContent);
      }

      // Reindirizza alla pagina prodottoSingolo.html
      window.location.href = '/../prodottoSingolo/prodottoSingolo.html';
    });
  });
});