const filterButtons = document.querySelectorAll('[data-filter]');
const catalogItems = document.querySelectorAll('.catalog-item');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

const cart = [];

const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

const renderCart = () => {
  if (!cart.length) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Добавьте товар из каталога, чтобы сформировать заказ.</div>';
    cartTotalElement.textContent = '0 ₽';
    cartCountElement.textContent = '0 товаров';
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map((item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.title}</strong>
          <span>${formatPrice(item.price)}</span>
        </div>
        <button class="btn btn-sm btn-outline-dark remove-item" data-index="${index}">Удалить</button>
      </div>
    `)
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const productLabel = cart.length % 10 === 1 && cart.length % 100 !== 11 ? 'товар' : 'товаров';

  cartTotalElement.textContent = formatPrice(total);
  cartCountElement.textContent = `${cart.length} ${productLabel}`;

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      renderCart();
    });
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    catalogItems.forEach((item) => {
      const isVisible = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !isVisible);
    });
  });
});

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    cart.push({
      title: button.dataset.title,
      price: Number(button.dataset.price),
    });

    renderCart();
    checkoutButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

checkoutButton.addEventListener('click', () => {
  const message = cart.length
    ? `Заказ сформирован на сумму ${cartTotalElement.textContent}. Это демонстрация блока эквайринга.`
    : 'Сначала добавьте товары в корзину.';

  window.alert(message);
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formFeedback.style.display = 'block';
  formFeedback.textContent = 'Сообщение отправлено. Мы свяжемся с вами в ближайшее время.';
  contactForm.reset();
});

renderCart();
