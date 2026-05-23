export interface IIssues {
    title : string;
    description : string;
    type : string
    data : any
}

export interface IQuery {
    sort? : string;
    type? : string;
    status? : string
}