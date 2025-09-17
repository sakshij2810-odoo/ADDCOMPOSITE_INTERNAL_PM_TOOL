


export const levelOfEducationList = [
    {
        label: "Less than secondary school (high school)",
        value: "HIGH_SCHOOL"
    },
    {
        label: "Secondary diploma (high school graduation)",
        value: "HIGH_SCHOOL_GRADUATIOIN"
    },
    {
        label: "One-year degree, diploma or certificate from  a university, college, trade or technical school, or other institute",
        value: "ONE_YEAR_DEGREE"
    },
    {
        label: "Two-year program at a university, college, trade or technical school, or other institute",
        value: "TWO_YEAR_PROGRAM"
    },
    {
        label: "Bachelor's degree OR  a three or more year program at a university, college, trade or technical school, or other institute",
        value: "BECHELOR_DEGREE_OR_THREE_OR_MORE_YEAR_PROGRAM"
    },
    {
        label: "Two or more certificates, diplomas, or degrees. One must be for a program of three or more years",
        value: "TWO_OR_MORE_CERTIFICATES_OR_DIPLOMAS_OR_DEGREES"
    },
    {
        label: "Master's degree, OR professional degree needed to practice in a licensed profession",
        value: "MASTER_DEGREE_OR_PROFESSIONAL_DEGREE"
    },
    {
        label: "Doctoral level university degree (Ph.D.)",
        value: "DOCTER_LEVEL_DEGREE"
    }
]

export const getLevelOfEducationLabel = (key: string | null): string => {
    const level = levelOfEducationList.find((option) => option.value === key)
    return level ? level.label : ""
}