import { ILoadState } from "src/redux/store.enums";


export interface IStudyProgram {
    study_program_uuid: string | null,
    program_name: string | null,
    college_university: string | null,
    program_type: string | null,
    program_fee: string | null,
    program_duration: string | null,
    program_admission_last_date: string | null,
    program_admission_opening_date: string | null,
    college_university_representative: string | null,
    contact_number: string | null,
    email: string | null,
    status: "ACTIVE" | "INACTIVE"
}


export interface IStudyProgramState {
    study_programs_list: {
        loading: ILoadState
        data: IStudyProgram[];
        count: number;
        error: string | null;
    },
    single_study_program: {
        loading: ILoadState
        data: IStudyProgram;
        error: string | null;
    },
}