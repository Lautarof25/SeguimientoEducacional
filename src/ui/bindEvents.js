export function bindAuthEvents({
    authToggle,
    authForm,
    authSubmit,
    setAuthMode,
    onSubmit
}) {
    authToggle?.addEventListener('click', () => setAuthMode());
    authForm?.addEventListener('submit', onSubmit);
    return {
        authSubmit
    };
}
