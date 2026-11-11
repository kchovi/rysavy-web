const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = type ? 'form-status ' + type : 'form-status';
}

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    setStatus('Odesílám…', 'loading');
    try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        setStatus(data.message, data.ok ? 'success' : 'error');
        if (data.ok) form.reset();
    } catch {
        setStatus('Chyba připojení, zkuste to prosím znovu.', 'error');
    } finally {
        btn.disabled = false;
    }
});