import { ILoadState } from "src/redux/store.enums";

import type { IPrivateLead, IEducationProfile, IPrivateLeadState, IWorkHistoryProfile, ICRSPointCalulations, ITravelHistoryProfile, IRetainerAgreement, IChildrenProfile, IJobOffer } from "./private-leads.types";


export const defaultEducationProfile: IEducationProfile = {
  from: "",
  to: "",
  qualification: "",
  marks_percentage: null,
  school_or_university: "",
  city: "",
  country: "",
  program_details: ""
}

export const defaultWorkHistoryProfile: IWorkHistoryProfile = {
  designation: "",
  noc_job_uuid: "",
  noc_job_code: "",
  noc_job_title: "",
  employement_type: null,
  currently_working: false,
  from: "",
  to: "",
  company_name: "",
  company_location: "",
  location_type: null,
  work_description: null,
  country: ""
}

export const defaultTravelHistoryProfile: ITravelHistoryProfile = {
  from_date: "",
  to_date: "",
  duration: "",
  destination: "",
  purpose_of_travel: "",
  description: "",
}

export const defaultChildrenProfile: IChildrenProfile = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  age: 0,
}

export const defaultJobOffer: IJobOffer = {
  teer_category: 0,
  noc_category: 0,
  wage: 0,
  work_permit_status: 0,
  job_tenure: 0,
  earnings_history: 0,
  location: 0,
}


export const defaultPrivateLead: IPrivateLead = {
  leads_uuid: null,
  leads_code: "",
  referral_code: null,
  service_type: "",
  service_sub_type: null,
  applicant_first_name: "",
  applicant_last_name: "",
  applicant_date_of_birth: "",
  applicant_sex: "",
  contact_number: "",
  email: "",
  marital_status: "MARRIED",
  number_of_children: "",
  education: [],
  work_history: [],
  nationality: "",
  country_of_residence: "",
  status_in_country: "",
  country: "",
  state_or_province: "",

  english_language_test_type: null,
  english_test_result_less_than_two_years: "NO",
  english_ability_speaking: null,
  english_ability_reading: null,
  english_ability_writing: null,
  english_ability_listening: null,

  french_language_test_type: null,
  french_test_result_less_than_two_years: "NO",
  french_ability_speaking: null,
  french_ability_reading: null,
  french_ability_writing: null,
  french_ability_listening: null,

  spouse_first_name: null,
  spouse_last_name: null,
  spouse_date_of_birth: null,
  spouse_sex: null,
  spouse_education: [],
  spouse_work_history: [],

  spouse_english_language_test_type: null,
  spouse_english_test_result_less_than_two_years: "NO",
  spouse_english_ability_speaking: null,
  spouse_english_ability_reading: null,
  spouse_english_ability_writing: null,
  spouse_english_ability_listening: null,

  self_employment: null,
  leads_source: null,
  specify: null,
  notes: null,
  comment: null,
  time_to_contact: null,
  assigned_to_id: null,
  status: "ACTIVE",

  certificate_of_qualification: null,

  is_valid_job_offer: null,
  teer_category: null,
  noc_category: null,
  wage: null,
  work_permit_status: null,
  job_tenure: null,
  earnings_history: null,
  location: null,


  province_or_territory_nomination: null,
  relatives_in_canada: null,

  currency_field: "",
  immovable: null,
  movable: null,
  net_worth: null,
  sponsor_income: null,
  sponsor_type: null,
  travel_history: [],

  // additional_points: {
  //   brother_or_sister_living_in_canada_who_is_a_citizen_or_permanent_resident_of_canada: false,
  //   nclc_7_or_higher_all_french_and_clb_4_or_lower_in_english_or_did_not_take_an_English_test: false,
  //   nclc_7_or_higher_all_french_and_clb_5_or_higher_all_english_skills: false,
  //   post_secondary_education_canada_credential_1_or_2_years: false,
  //   post_secondary_education_canada_credential_3_years_or_longer: false,
  //   arranged_employment_noc_teer_0_major_group_00: false,
  //   arranged_employment_noc_teer_1_2_or_3_or_any_teer_0_other_than_major_group_00: false,
  //   provincial_or_territorial_nomination: false,
  // },

  //----------- Applicant Documents -----------
  passport: null,              // File
  wes_document: null,          // File
  iltes_document: null,        // File
  resume: null,                // File

  //----------- Student Form Structure -----------
  current_residential_address: null,
  primary_language: null,
  Date_of_IELTS_exam: null,
  overall_IELTS_score: null,
  which_intake_you_want_to_apply_for: null,
  intake_year: null,
  program_type_apply_for: null,

  visa_refusal: null,
  study_permit_visa_type: null,
  created_by_name: "",
  user_email: "",

  job_offer: [],

  asignee: [],
  branch_uuid: null,
  branch_name: null,
  terms_and_condition: 0,


  funds_available: "",
  prior_travel_history: "",
  country_code: "+1",
  childrens_details: [],
  no_work_experience: 0,
  relative_relation: null,
  spouse_no_work_experience: 0
}

export const defaultCRSPointCalulations: ICRSPointCalulations = {
  core_human_capital_factor: {
    age: 0,
    level_of_education: 0,
    official_languages_subtotal: 0,
    official_languages: {
      first_official_language: 0,
      second_official_language: 0,
    },
    canadian_work_experience: 0,
    subtotal: 0
  },
  spouse_factor: {
    level_of_education: 0,
    first_official_language: 0,
    second_official_language: 0,
    canadian_work_experience: 0,
    subtotal: 0
  },
  skill_transferbility_factor: {
    education: {
      official_language_proficiencey_and_education: 0,
      canadian_work_experience_and_education: 0,
      subtotal: 0,
    },
    foreign_work_experience: {
      official_language_proficiencey_and_foreign_work_experience: 0,
      canadian_and_foreign_work_experience: 0,
      subtotal: 0,
    },
    certificate_of_qualification: 0,
    subtotal: 0, // education + foreign_work_experience
  },
  additional_point: {
    provinicial_nomination: 0,
    job_offer: 0,
    study_in_canada: 0,
    sibling_in_canada: 0,
    french_language_skills: 0,
    subtotal: 0
  },
  comprehensive_ranking_system_formula_grand_total: 0,
  total: 0
}




export const defaultRetainerAgreement: IRetainerAgreement = {
  retainer_uuid: "",
  module_uuid: "",
  module_name: "", // eg: ENQUIRY | QUOTE | COSTING_SHEET etc
  country: "",
  state_or_province: "",
  service_type: "",
  service_sub_type: "",

  client_name: "",
  client_email: "",
  client_contact_number: "",
  job_title: null,
  job_description: null,

  amount_upon_on_this_agreement: "0",
  amount_on_this_service: "0",
  amount_due_upon_on_this_agreement: "0",
  hst: "0",
  hst_rate: 0,
  total_due: "0",
  aggrement_date: "",
  retainer_type: null,
  file_path: null,
  status: "DRAFT"
}


export const defaultPrivateLeadState: IPrivateLeadState = {
  private_leads_list: {
    loading: ILoadState.idle,
    data: [],
    count: 0,
    error: null,
  },
  single_private_lead: {
    loading: ILoadState.idle,
    data: defaultPrivateLead,
    error: null,
  },
  single_lead_activity: {
    loading: ILoadState.idle,
    // data: [
    //   {
    //     name: "Kamaldeep", module_id: "", module_name: "", module_column_name: "", module_uuid: "",
    //     create_ts: "12/12/2024", history_uuid: "",
    //     message: "Kamal create a lead."
    //   },
    //   {
    //     name: "Kamaldeep", module_id: "", module_name: "", module_column_name: "", module_uuid: "",
    //     create_ts: "12/12/2024", history_uuid: "",
    //     message: "Kamal create a lead."
    //   },
    //   {
    //     name: "Kamaldeep", module_id: "", module_name: "", module_column_name: "", module_uuid: "",
    //     create_ts: "12/12/2024", history_uuid: "",
    //     message: "Kamal create a lead."
    //   },
    //   {
    //     name: "Kamaldeep", module_id: "", module_name: "", module_column_name: "", module_uuid: "",
    //     create_ts: "12/12/2024", history_uuid: "",
    //     message: "Kamal create a lead."
    //   }
    // ],
    data: [],
    count: 0,
    error: null,
  },
  single_lead_sugessions: {
    loading: ILoadState.idle,
    data: {
      assessment: [],
      improvement: []
    },
    error: null,
  },
  single_lead_report: {
    loading: ILoadState.idle,
    data: null,
    error: null,
  },
  single_retainer_agreement: {
    loading: ILoadState.idle,
    data: defaultRetainerAgreement,
    error: null,
  },
  single_lead_retainer_agreement_list: {
    loading: ILoadState.idle,
    data: [],
    count: 0,
    error: null,
  },
  single_lead_ai_report_summary: {
    loading: ILoadState.idle,
    data: null,
    error: null,
  }
}