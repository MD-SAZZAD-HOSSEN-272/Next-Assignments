export interface IUsers {
    name : string;
    email : string;
    password : string;
    role : 'contributor' | 'maintainer';
}