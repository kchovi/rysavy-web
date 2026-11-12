(() => {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    if (!form || !statusEl) return;

    
    const lang = (document.documentElement.lang || 'cs').slice(0, 2).toLowerCase();

    const MESSAGES = {
        cs: {
            sending: 'Odesílám…',
            connection: 'Chyba připojení, zkuste to prosím znovu.',
            fallback: 'Něco se nepovedlo, zkuste to prosím znovu.'
        },
        en: {
            sending: 'Sending…',
            connection: 'Connection error, please try again.',
            fallback: 'Something went wrong, please try again.'
        }
    };
    const t = MESSAGES[lang] || MESSAGES.cs;

    const STATUS_CLASSES = {
        loading: 'bg-gray clr-primary',
        success: 'bg-orange clr-black',
        error: 'bg-black clr-primary'
    };

    let hideTimer;

    function hideStatus() {
        statusEl.classList.remove('is-visible'); 
        hideTimer = setTimeout(() => { 
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
        setStatus(t.sending, 'loading'); 
        try {
            const body = new FormData(form);
            body.append('lang', lang); 
            const res = await fetch(form.action, {
                method: 'POST',
                body
            });
            const data = await res.json();
            setStatus(data.message || t.fallback, data.ok ? 'success' : 'error', data.ok ? 6000 : 10000);
            if (data.ok) form.reset();
        } catch {
            setStatus(t.connection, 'error', 10000);
        } finally {
            btn.disabled = false;
        }
    });
})();