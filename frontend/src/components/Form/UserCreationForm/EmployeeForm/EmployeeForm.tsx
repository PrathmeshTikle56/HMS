import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import UserAccountCreationForm from "../AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../BasicDetails/BasicDetail";
import EducationDetailsForm from "../EducationDetails/EducationDetail";
import BankDetailsForm from "../BankDetailStep/BankDetail";
import Stepper from "../../../Stepper/Stepper";

const EmployeeForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Initialize react-hook-form
  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      accountCreation: {},
      basicDetails: {},
      educationDetails: {},
      bankDetails: {},
    },
  });

  const [formData, setFormData] = useState({
    accountCreation: {},
    basicDetails: {},
    educationDetails: {},
    bankDetails: {},
  });

  const steps = [
    "Account Creation",
    "Basic Details",
    "Educational Details",
    "Bank Details",
  ];

  const stepKeys = [
    "accountCreation",
    "basicDetails",
    "educationDetails",
    "bankDetails",
  ];
  const handleNext = async () => {
    if (activeStep !== 3) {
      const isValid = await methods.trigger();
      if (!isValid) return;
    }

    const currentStepKey = stepKeys[activeStep];
    const allValues = methods.getValues();

    setFormData((prev) => ({
      ...prev,
      [currentStepKey]: allValues[currentStepKey],
    }));

    setActiveStep((prev) => prev + 1);
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Final Submission
  const onSubmit = (data: any) => {
    console.log("Final Submission:", data);
    setFormData({
      accountCreation: data.accountCreation,
      basicDetails: data.basicDetails,
      educationDetails: data.educationDetails,
      bankDetails: data.bankDetails,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto p-4">
        <Stepper steps={steps} activeStep={activeStep} />

        {activeStep === 0 && <UserAccountCreationForm />}
        {activeStep === 1 && <BasicDetailsForm />}
        {activeStep === 2 && <EducationDetailsForm />}
        {activeStep === 3 && <BankDetailsForm />}

        <div className="mt-6 flex justify-between">
          {activeStep > 0 && (
            <button type="button" onClick={handleBack}>
              Back
            </button>
          )}
          {activeStep < steps.length - 1 ? (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default EmployeeForm;
