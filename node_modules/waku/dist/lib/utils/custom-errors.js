const isErrorInfo = (x)=>{
    if (typeof x !== 'object' || x === null) {
        return false;
    }
    if ('status' in x && typeof x.status !== 'number') {
        return false;
    }
    if ('location' in x && typeof x.location !== 'string') {
        return false;
    }
    return true;
};
const prefix = '__WAKU_CUSTOM_ERROR__;';
// This is an internal API and not for public use
export const createCustomError = (message, errorInfo)=>{
    const err = new Error(message);
    err.digest = prefix + JSON.stringify(errorInfo);
    return err;
};
export const getErrorInfo = (err)=>{
    const digest = err?.digest;
    if (typeof digest !== 'string' || !digest.startsWith(prefix)) {
        return null;
    }
    try {
        const info = JSON.parse(digest.slice(prefix.length));
        if (isErrorInfo(info)) {
            return info;
        }
    } catch  {
    // ignore
    }
    return null;
};

//# sourceMappingURL=custom-errors.js.map