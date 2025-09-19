export const getLanguage = () => localStorage.getItem('lang') || 'uz'
export const setLanguage = (lang) => localStorage.setItem('lang', lang)
