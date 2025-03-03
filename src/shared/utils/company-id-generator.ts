export const IdGenerator = (name: string): string => {
    const str = name.split(' ');
    const newArr = str.map((el) => el.charAt(0));
    const randomNumber: number = Math.floor(1000000 + Math.random() * 9000000);
    return `${newArr.join('')}-${randomNumber}`;
};
