
export const setObjectItemStorage = (key: string, data: any):  void  => {
    localStorage.setItem(key, JSON.stringify(data));
}

export const setNonObjectItemStorage = (key: string, data: any):  void  => {
    localStorage.setItem(key, data);
}


export const getItemStorage = (key: string): string | null => {
    return localStorage.getItem(key) || "";
}

export const removeitemStorage = (key: string): void => {
    localStorage.removeItem(key);
}

export const clearAllStorage = (): void => {
    localStorage.clear();
}

