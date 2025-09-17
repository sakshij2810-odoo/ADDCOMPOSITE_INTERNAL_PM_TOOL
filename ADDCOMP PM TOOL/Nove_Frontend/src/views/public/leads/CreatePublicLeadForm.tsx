import { Box, Button, Typography } from '@mui/material';
import { Step, StepLabel, Stepper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DashboardContent } from 'src/layouts/dashboard';
import { EducationProfileStep, LanguageProfileStep, OtherPropertiesStep, PersonalProfileStep, SelectRegionStep, SpouseDetailsStep, TravelHistoryProfileStep, WorkProfileStep } from './lead-steps';
import { IPublicLead } from 'src/redux/child-reducers/leads/public-leads/public-leads.types';
import { defaultPublicLead } from 'src/redux/child-reducers/leads/public-leads/public-leads.state';
import { ISelectOption } from 'src/types/common';
import { LeadSuccessScreen } from './components';

const steps: ISelectOption[] = [
  // { label: "Select Region", value: "REGION" },
  { label: "Basic Information", value: "BASIC_INFO" },
  { label: "Education History", value: "EDUCATION_INFO" },
];

const CreatePublicLeadForm = () => {
  const [stepperList, setstepperList] = useState<ISelectOption[]>([])
  const [activeStep, setActiveStep] = useState(0);
  const [publicLeadObject, setPublicLeadObject] = useState(defaultPublicLead)
  // const [leadProgressScreen, setLeadProgressScreen] = useState<"PROGRESS" | "SUCCESS">("PROGRESS")

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);


  useEffect(() => {
    let newList = [...steps]
    if (publicLeadObject.service_type.toUpperCase() !== "STUDY") {
      newList.push({ label: "Work History", value: "WORK_INFO" })
    }
    if (publicLeadObject.service_type.toUpperCase() === "VISITOR") {
      newList.push({ label: "Travel History", value: "TRAVEL_INFO" })
    }
    newList.push({ label: "Language Deatils", value: "LANGUAGE_INFO" })
    if (publicLeadObject.marital_status?.toUpperCase() === "MARRIED") {
      newList.push({ label: "Spouse Deatils", value: "SPOUSE_INFO" })
    }
    newList.push({ label: "Other Deatils", value: "OTHER" })
    setstepperList(newList)
  }, [publicLeadObject])

  const handleOnSuccessClick = (lead: IPublicLead) => {
    setPublicLeadObject(lead)
    handleNext()
  }

  // Inline switch-case logic for step content
  const getStepContent = (step: number) => {
    switch (stepperList[step]["value"]) {
      // case "REGION":
      //   return <SelectRegionStep isFirstStep={true} isLastStep={activeStep === stepperList.length - 1}
      //     onBackClick={handleBack} onNextClick={handleNext}
      //     leadInfo={publicLeadObject}
      //     onSaveSuccess={handleOnSuccessClick} />
      case "BASIC_INFO":
        return <PersonalProfileStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      case "EDUCATION_INFO":
        return <EducationProfileStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      case "WORK_INFO":
        return <WorkProfileStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      case "TRAVEL_INFO":
        return <TravelHistoryProfileStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      case "LANGUAGE_INFO":
        return <LanguageProfileStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      case "SPOUSE_INFO":
        return <SpouseDetailsStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      case "OTHER":
        return <OtherPropertiesStep isFirstStep={false} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
      default:
        return <SelectRegionStep isFirstStep={true} isLastStep={activeStep === stepperList.length - 1}
          onBackClick={handleBack} onNextClick={handleNext}
          leadInfo={publicLeadObject}
          onSaveSuccess={handleOnSuccessClick} />
    }
  };

  return (
    <DashboardContent metaTitle='Lead Information' sx={{ py: 3 }}>
      {activeStep === stepperList.length ? (
        <LeadSuccessScreen />
      ) : (
        <>
          <Stepper activeStep={activeStep} alternativeLabel>
            {stepperList.map((step) => (
              <Step key={step.value}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 4 }}>
            {getStepContent(activeStep)}
          </Box>
        </>
      )}
    </DashboardContent >
  )
}

export default CreatePublicLeadForm