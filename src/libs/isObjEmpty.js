
export default function isObjEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}