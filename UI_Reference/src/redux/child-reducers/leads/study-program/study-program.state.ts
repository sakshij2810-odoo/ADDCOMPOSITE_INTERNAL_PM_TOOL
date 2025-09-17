import { ILoadState } from "src/redux/store.enums"
import { IStudyProgram, IStudyProgramState } from "./study-program.types"



export const defaultStudyProgram: IStudyProgram = {
    study_program_uuid: null,
    program_name: null,
    college_university: null,
    program_type: null,
    program_fee: null,
    program_duration: null,
    program_admission_last_date: null,
    program_admission_opening_date: null,
    college_university_representative: null,
    contact_number: null,
    email: null,
    status: "ACTIVE"
}


export const defaultStudyProgramState: IStudyProgramState = {
    study_programs_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_study_program: {
        loading: ILoadState.idle,
        data: defaultStudyProgram,
        error: null,
    },
}