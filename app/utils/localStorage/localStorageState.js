const HandleLocalStorageState = (key, value, action) => {
    if (!action) return;
    if (action === "get") {
        return window.localStorage.getItem(key);
    }
    if (action === "set") {
        return window.localStorage.setItem(key, value);
    }
    if (action === "remove") {
        return window.localStorage.removeItem(key);
    }
};

export default HandleLocalStorageState;