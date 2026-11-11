const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    statusEl.textContent = 'Odesílám…';
    try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        statusEl.textContent = data.message;
        if (data.ok) form.reset();
    } catch {
        statusEl.textContent = 'Chyba připojení, zkuste to prosím znovu.';
    } finally {
        btn.disabled = false;
    }
});