export declare const getActiveVacancies: () => Promise<{
    id: any;
    title: any;
    department: any;
    description: any;
    requirements: any;
    salaryRange: string;
    location: any;
    type: any;
    deadline: string | null;
    status: string;
    applicants: number;
}[]>;
