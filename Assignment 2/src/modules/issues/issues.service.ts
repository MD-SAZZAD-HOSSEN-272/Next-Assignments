import type { IIssues } from "./issues.interface";

const createIssueIntoDB = async(payload : IIssues) => {
    const {title, description, type} = payload;
    console.log(payload)
}

export const issuesService = {
    createIssueIntoDB
}