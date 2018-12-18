class utils {
    static repeat(times, elemFunc) {
        let arr = [];
        for (let i = 0; i < times; i++)
            arr.push(1);
        return (arr.map(elemFunc));
    }
}

export default utils;