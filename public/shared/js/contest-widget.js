// Contest Widget JavaScript
(function() {
    const modal = document.getElementById('contestModal');
    const openBtn = document.getElementById('fundraiserBtn');
    const closeBtn = document.getElementById('closeModal');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const ticketForm = document.getElementById('ticketForm');
    const ideaForm = document.getElementById('ideaForm');
    const ideaPitch = document.getElementById('ideaPitch');
    const wordCountEl = document.getElementById('wordCount');
    let ticketNumber = '';
    let userInfo = {};
    
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        showStep(1);
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    function showStep(stepNum) {
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        if (stepNum === 1) step1.classList.remove('hidden');
        else if (stepNum === 2) step2.classList.remove('hidden');
        else if (stepNum === 3) step3.classList.remove('hidden');
    }
    
    ideaPitch.addEventListener('input', () => {
        const words = ideaPitch.value.trim().split(/\s+/).filter(w => w.length > 0);
        const count = words.length;
        wordCountEl.textContent = count;
        if (count > 50) {
            wordCountEl.style.color = '#ef4444';
        } else {
            wordCountEl.style.color = '#6b7280';
        }
    });
    
    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        userInfo = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            mobile: document.getElementById('userMobile').value
        };
        const paymentSuccess = await simulatePayment(userInfo);
        if (paymentSuccess) {
            ticketNumber = 'FWF-IDEA-' + Date.now().toString().slice(-8);
            await saveTicket(ticketNumber, userInfo);
            showStep(2);
        }
    });
    
    ideaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const words = ideaPitch.value.trim().split(/\s+/).filter(w => w.length > 0);
        if (words.length > 50) {
            alert('कृपया अपना आइडिया 50 शब्दों में सीमित रखें। / Please limit your idea to 50 words.');
            return;
        }
        if (words.length < 10) {
            alert('कृपया कम से कम 10 शब्द लिखें। / Please write at least 10 words.');
            return;
        }
        await saveIdea(ticketNumber, ideaPitch.value);
        await sendConfirmationEmail(userInfo, ticketNumber);
        document.getElementById('displayTicket').textContent = ticketNumber;
        showStep(3);
    });
    
    async function simulatePayment(userInfo) {
        return new Promise((resolve) => {
            setTimeout(() => {
                alert('Payment of ₹200 successful! (This is a simulation)');
                resolve(true);
            }, 1000);
        });
    }
    
    async function saveTicket(ticket, user) {
        try {
            const response = await fetch('/api/contest/ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketNumber: ticket, ...user })
            });
            return await response.json();
        } catch (err) {
            console.error('Error saving ticket:', err);
        }
    }
    
    async function saveIdea(ticket, idea) {
        try {
            const response = await fetch('/api/contest/idea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketNumber: ticket, idea })
            });
            return await response.json();
        } catch (err) {
            console.error('Error saving idea:', err);
        }
    }
    
    async function sendConfirmationEmail(user, ticket) {
        try {
            const response = await fetch('/api/contest/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user, ticketNumber: ticket })
            });
            return await response.json();
        } catch (err) {
            console.error('Error sending email:', err);
        }
    }
    
    // Show Contest Entry Form on Buy Ticket button click
    const showTicketFormBtn = document.getElementById('showTicketFormBtn');
    if(showTicketFormBtn && ticketForm){
      showTicketFormBtn.addEventListener('click', function(){
        ticketForm.style.display = 'block';
        showTicketFormBtn.style.display = 'none';
        ticketForm.scrollIntoView({behavior: 'smooth'});
      });
    }
})();
