export function saveUserSession(user, role) {
    localStorage.setItem('user', user)
    localStorage.setItem('role', role)
    document.cookie = `user=${user}; path=/;`
    document.cookie = `role=${role}; path=/;`
}

export function clearCookiesLocalStorage() {
    localStorage.clear()
    document.cookie = "user=; path=/; max-age=0;"
    document.cookie = "role=; path=/; max-age=0;"
}

export function logout() {
    localStorage.clear()
    clearCookiesLocalStorage()
}