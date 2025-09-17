import { ICRSPointCalulations, IEducationProfile, IOINPPoints, ITravelHistoryProfile, IWorkHistoryProfile } from "../private-leads.types"

export interface ILeadAIReportLeadDetails {
    HST: any
    age: any
    email: string
    notes: any
    total: any
    resume: any
    status: string
    asignee: any[]
    comment: any
    country: any
    movable: any
    specify: any
    leads_id: number
    passport: any
    education: IEducationProfile[]
    immovable: any
    insert_ts: string
    create_ts: string
    job_title: any
    net_worth: any
    wkrFrgExp: any
    leads_code: string
    leads_uuid: string
    math_marks: any
    percentage: any
    spouse_sex: any
    total_fees: any
    user_email: any
    user_roles: any
    branch_name: any
    branch_uuid: any
    intake_year: any
    nationality: any
    school_name: any
    speakAndEdu: any
    workAndeduc: any
    company_name: any
    leads_source: any
    service_type: any
    speakAndWork: any
    sponsor_type: any
    submitted_on: any
    visa_refusal: any
    wes_document: any
    work_history: IWorkHistoryProfile[]
    applicant_sex: string
    english_marks: any
    assigned_to_id: any
    contact_number: string
    currency_field: any
    iltes_document: any
    job_start_date: any
    marital_status: string
    sponsor_income: any
    travel_history: ITravelHistoryProfile[]
    completion_year: any
    created_by_name: any
    created_by_uuid: any
    leads_unique_id: number
    self_employment: any
    time_to_contact: any
    unique_token_no: any
    upon_submission: any
    additionalPoints: any
    is_last_10_years: any
    modified_by_name: any
    modified_by_uuid: any
    primary_language: any
    service_sub_type: any
    spouse_education: IEducationProfile[]
    spouse_last_name: any
    total_additional: any
    additional_points: any
    english_exam_type: any
    spouse_first_name: any
    state_or_province: any
    status_in_country: any
    Date_of_IELTS_exam: any
    certificate_points: any
    is_valid_job_offer: any
    number_of_children: any
    questionnaire_name: any
    questionnaire_uuid: any
    spouse_work_points: any
    applicant_last_name: string
    overall_IELTS_score: any
    relatives_in_canada: any
    spouse_work_history: IWorkHistoryProfile[]
    terms_and_condition: any
    applicant_crs_points: any
    applicant_first_name: string
    country_of_residence: any
    spouse_date_of_birth: any
    last_10_foreign_years: any
    french_ability_reading: any
    french_ability_writing: any
    matriculation_end_date: any
    program_type_apply_for: any
    applicant_date_of_birth: string
    english_ability_reading: any
    english_ability_writing: any
    french_ability_speaking: any
    is_spouse_last_10_years: any
    noc_teer_job_offer_type: any
    spouse_education_points: any
    valid_study_permit_visa: any
    english_ability_speaking: any
    french_ability_listening: any
    matriculation_start_date: any
    english_ability_listening: any
    french_language_test_type: any
    senior_secondary_end_date: any
    english_language_test_type: any
    highest_level_of_education: any
    current_residential_address: any
    senior_secondary_percentage: any
    senior_secondary_start_date: any
    certificate_of_qualification: any
    english_ability_total_points: any
    senior_secondary_school_name: any
    is_er_approved_outside_canada: any
    spouse_french_ability_reading: any
    spouse_french_ability_writing: any
    spouse_english_ability_reading: any
    spouse_english_ability_writing: any
    spouse_french_ability_speaking: any
    upon_signing_of_this_agreement: any
    senior_secondary_field_of_study: any
    spouse_english_ability_speaking: any
    spouse_french_ability_listening: any
    province_or_territory_nomination: any
    senior_secondary_completion_year: any
    spouse_english_ability_listening: any
    spouse_french_language_test_type: any
    upon_execution_of_this_agreement: any
    spouse_english_language_test_type: any
    which_intake_you_want_to_apply_for: any
    spouse_english_ability_total_points: any
    second_language_ability_total_points: any
    french_test_result_less_than_two_years: any
    spouse_has_degree_outside_canda_degree: any
    english_test_result_less_than_two_years: any
    spouse_french_test_result_less_than_two_years: any
    spouse_english_test_result_less_than_two_years: any
}

export interface IFswEligibilityAndScope {
    age: any
    education: any
    adaptability: any
    fsw_eligibility: any
    work_experience: any
    language_ability: any
    total_fsw_points: any
    arranged_employment: any
}

// export interface ICrsBreakdown {
//     total: any
//     additional_points: AdditionalPoints
//     core_human_capital_factor: CoreHumanCapitalFactor
//     skill_transferability_factor: SkillTransferabilityFactor
// }

export interface ICRSBreakdown {
    total: number
    additional_points: AdditionalPoints
    core_human_capital_factor: CoreHumanCapitalFactor
    spouse_factor: {
        subtotal: number
        level_of_education: number
        first_official_language: number
        canadian_work_experience: number
    }
    skill_transferability_factor: SkillTransferabilityFactor
}

export interface AdditionalPoints {
    subtotal: number
    job_offer: number
    study_in_canada: number
    sibling_in_canada: number
    provincial_nomination: number
    french_language_skills: number
}

export interface CoreHumanCapitalFactor {
    age: number
    subtotal: number
    level_of_education: number
    official_languages: OfficialLanguages
    canadian_work_experience: number
}

export interface OfficialLanguages {
    first_official_language: number
    second_official_language: number
}

export interface SkillTransferabilityFactor {
    subtotal: number
    education: Education
    foreign_work_experience: ForeignWorkExperience
    certificate_of_qualification: number
}

export interface Education {
    subtotal: number
    canadian_work_experience_and_education: number
    official_language_proficiency_and_education: number
}

export interface ForeignWorkExperience {
    subtotal: number
    canadian_and_foreign_work_experience: number
    official_language_proficiency_and_foreign_work_experience: number
}


export interface ILeadAIReportSummary {
    lead_to_graph_unique_id: number
    lead_to_graph_uuid: string
    leads_uuid: string
    leads_name: any
    lead_details: ILeadAIReportLeadDetails

    fsw_eligibility_and_scope: IFswEligibilityAndScope



    crs_breakdown: ICRSBreakdown

    eligibility: {
        crs_eligibility: string
        crs_score_estimated: number
        crs_invite_likelihood: string
        crs_minimum_passing_score: number
    }
    last_ten_crs_draws: {
        ITAs: number
        date: string
        draw: string
        type: string
        cutoff: number
    }[]
    recommendations: {
        spouse: string
        education: string
        language_tests: string
        work_experience: string
        alternative_pathways: string
    }
    status: string
    created_by_uuid: any
    created_by_name: any
    modified_by_uuid: any
    modified_by_name: any
    create_ts: string
    oinp_breakdown: IOINPPoints
}