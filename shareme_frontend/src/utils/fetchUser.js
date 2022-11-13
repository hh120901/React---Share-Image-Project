export const fetchUser = () =>{
    const user = localStorage.getItem('user') !== 'undefined' ? localStorage.getItem('user') : localStorage.clear(); 
    return user;
}