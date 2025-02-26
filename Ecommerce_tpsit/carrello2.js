document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout-button');

    checkoutButton.addEventListener('click', () => {
        window.location.href = '/pagamento.html';
    });
});