const STATUS_CLASSES = {
    loading: 'bg-gray clr-primary',
    success: 'bg-orange clr-black',
    error:   'bg-black clr-primary'
};

function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = 'form-status padding-box-sm border-box bold ' + (STATUS_CLASSES[type] || '');
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