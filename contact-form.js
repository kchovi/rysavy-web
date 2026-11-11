(() => {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    if (!form || !statusEl) return;

    const STATUS_CLASSES = {
        loading: 'bg-gray clr-primary',
        success: 'bg-orange clr-black',
        error: 'bg-black clr-primary'
    };

    let hideTimer;

    function hideStatus() {
        statusEl.classList.remove('is-visible'); // fade out
        hideTimer = setTimeout(() => { // then clean up
            statusEl.textContent = '';
            statusEl.className = 'form-status';
        }, 300);
    }

    function setStatus(text, type, autoHideMs = 0) {
        clearTimeout(hideTimer);
        statusEl.textContent = text;
        statusEl.className = 'form-status border-box bold ' +
            (STATUS_CLASSES[type] || '') + ' is-visible';
        if (autoHideMs) hideTimer = setTimeout(hideStatus, autoHideMs);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type=submit]');
        btn.disabled = true;
        setStatus('Odesílám…', 'loading'); // stays until the request finishes
        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            });
            const data = await res.json();
            setStatus(data.message, data.ok ? 'success' : 'error', data.ok ? 6000 : 10000);
            if (data.ok) form.reset();
        } catch {
            setStatus('Chyba připojení, zkuste to prosím znovu.', 'error', 10000);
        } finally {
            btn.disabled = false;
        }
    });
})();