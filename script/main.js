document.addEventListener('DOMContentLoaded', () => {
  // 'use strict';
  //  console.log('Hello BOSS !');

  const customer = document.getElementById('customer');
  const freelancer = document.getElementById('freelancer');
  const blockCustomer = document.getElementById('block-customer');
  const blockFreelancer = document.getElementById('block-freelancer');
  const blockChoise = document.getElementById('block_choice');
  const btnExit = document.getElementById('btn-exit');
  const formCustomer = document.getElementById('form_customer');
  const ordersTable = document.getElementById('orders');
  const modalOrder = document.getElementById('order_read');
  const modalOrderActive = document.getElementById('order_active');
  const closeModal = document.querySelector('.close');
  
  const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];
   
  const toStorage = () => {
    localStorage.setItem('freeOrders', JSON.stringify(orders));
  }
   
   
   const renderOrders = () => {
      ordersTable.textContent = '';   
      orders.forEach((order, i) => {

      ordersTable.innerHTML += `
          <tr class="order ${order.active ? 'taken' : ''}" 
            data-number-order="${i}">
            <td>${i + 1}</td>
            <td>${order.title}</td>
            <td class="${order.currency}"></td>
            <td>${order.deadline}</td>
          </tr>`;
      });
   };
    
  const handlerModal = (event) => {
    const target = event.target;
    const modal = target.closest('.order-modal');
    const order = orders[modal.id];

    const baseAction = () => {
      modal.style.display = 'none';
      toStorage();
      renderOrders();
    }

    if(target.closest('close') || target === modal) {
      modal.style.display = 'none'
    }

    if(target.classList.contains('get-order')){
      order.active = true;
      baseAction();
    }

    if(target.id === 'capitulation'){
      order.active = false;
      baseAction();
    }

    if(target.id === 'ready'){
      orders.splice(orders.indexOf(order), 1);
      baseAction();
    }
  }

   const openModal = (numberOrder) => {
      const order = orders[numberOrder];

      const { title, firstName, email, phone, description,
           amount, currency, deadline, active = false } = order;

      const modal = active ? modalOrderActive : modalOrder;
      const firstNameBlock = modal.querySelector('.firstName'),
            titleBlock = modal.querySelector('.modal-title'),
            emailBlock = modal.querySelector('.email'),
            descriptionBlock = modal.querySelector('.description'),
            deadlineBlock = modal.querySelector('.deadline'),
            currencyBlock = modal.querySelector('.currency_img'),
            countBlock = modal.querySelector('.count'),
            phoneBlock = modal.querySelector('.phone');
      modal.id = numberOrder;      
      titleBlock.textContent = title;
      firstNameBlock.textContent = firstName;
      emailBlock.href = 'mailto:' + email;
      emailBlock.textContent = email;
      descriptionBlock.textContent = description;
      deadlineBlock.textContent = deadline;
      // currencyBlock.className = 'currency_img';
      currencyBlock.classList.add(currency);
      countBlock.textContent = amount;
      // if(phoneBlock) phoneBlock.href = 'tel:' + phone ; //tagidagini kengaytmasi
      // phoneBlock ? phoneBlock.href = 'tel:' + phone : '';
      phoneBlock && (phoneBlock.href = 'tel:' + phone); // birinchi phoneBlock tekshiradi tru bolsa ikinchisiga otadi
      modal.style.display = 'flex';

      modal.addEventListener('click', handlerModal)
      // currencyBlock.className = 'currency_img' 
      // const tellMe = "tel:" + order.phone;
      // phoneBlock.setAttribute('href', tellMe);
      // const emailTo = 'mailto:' + order.email;
      // emailBlock.setAttribute('href', emailTo);

   }
  
   ordersTable.addEventListener('click', (event)  => {
      const target = event.target;

      const targetOrder = target.closest('.order'); // qaysi biriga bosilganini bittasini olib beradi
      if(targetOrder) {
        openModal(targetOrder.dataset.numberOrder);
      }
      // console.log(targetOrder.dataset.nomberOrder); this tipa qaysiligini olib beradi
      console.log(orders[targetOrder.dataset.numberOrder]);

   });
   
   closeModal.addEventListener('click', () => {
     
      modalOrder.style.display = 'none';
      modalOrderActive.style.display = 'none';
    });
   
   customer.addEventListener('click', () => {
     blockChoise.style.display = 'none';
     blockCustomer.style.display = 'block';
     btnExit.style.display = 'block';
   });

   freelancer.addEventListener('click', () => {
     blockChoise.style.display = 'none';
     renderOrders();
     blockFreelancer.style.display = 'block';
     btnExit.style.display = 'block';
     console.log('freelancer boldi');
   });

   btnExit.addEventListener('click', () => {
    blockCustomer.style.display = 'none';
    blockChoise.style.display = 'block';
    blockFreelancer.style.display = 'none';
    btnExit.style.display = 'none';
   });

  formCustomer.addEventListener('submit', (event) => {
    event.preventDefault();

    const obj = {};

    const elements = [...formCustomer.elements]
            .filter((elem) => {
               return (elem.tagName === 'INPUT'  && elem.type !== 'radio') || 
               (elem.type === 'radio' &&   elem.checked) || 
               elem.tagName === 'TEXTAREA'
              });
              

    elements.forEach((elem) => {
        obj[elem.name] = elem.value;

          // if(elem.type !== 'radio') {
          //   elem.value = '';
          // }
      formCustomer.reset();
    });

    orders.push(obj);
    toStorage();
    console.log(orders);
  });

});