
// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.style.display === 'flex';
  nav.style.display = open ? 'none' : 'flex';
});

// Donation form (demo)
document.getElementById('donationForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  alert(`Thanks, ${data.name}! Proceeding to payment gateway for ₹${data.amount}.`);
  // TODO: integrate Razorpay/PhonePe/PayU test mode here
});

// Join form (demo)
document.getElementById('joinForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  alert(`Hi ${data.name}, redirecting to ₹200 payment. After success, Member ID will be emailed to ${data.email}.`);
  // TODO: integrate gateway + backend to email member id/password
});
