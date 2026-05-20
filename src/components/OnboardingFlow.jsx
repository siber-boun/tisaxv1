import React from 'react';
import StageIndicator from './StageIndicator';
import { FormSection, InputField, SelectField, TextAreaField } from './FormSection';
import { stage1Config } from '../data/initialData';

export default function OnboardingFlow({ 
  stage1Step, 
  stage1Config: config = stage1Config, 
  profile, 
  updateField, 
  stage1Errors, 
  text, 
  handleStage1Back, 
  handleStage1Save, 
  handleSignOut,
  feedback
}) {
  const stage1Text = text.stage1.sections[stage1Step - 1];



  return (
    <div className="onboarding-content">
      <StageIndicator
        step={stage1Step}
        total={config.length}
        title={stage1Text.indicatorTitle}
        stageLabel={text.journey.stage1}
        stepLabel={text.common.step}
      />
      {stage1Step === 1 && (
        <FormSection title={stage1Text.title} description={stage1Text.description}>
          <div className="grid two-col">
            <InputField label={text.stage1.fields.companyName.label} required helper={text.stage1.fields.companyName.helper} value={profile.companyName} onChange={(v) => updateField("companyName", v)} error={stage1Errors.companyName} />
            <SelectField label={text.stage1.fields.companySize.label} required helper={text.stage1.fields.companySize.helper} options={text.stage1.options.companySize} value={profile.companySize} onChange={(v) => updateField("companySize", v)} error={stage1Errors.companySize} />
            <SelectField label={text.stage1.fields.industrySector.label} required helper={text.stage1.fields.industrySector.helper} options={text.stage1.options.industry} value={profile.industrySector} onChange={(v) => updateField("industrySector", v)} error={stage1Errors.industrySector} />
            <InputField label={text.stage1.fields.numberOfEmployees.label} required type="number" helper={text.stage1.fields.numberOfEmployees.helper} value={profile.numberOfEmployees} onChange={(v) => updateField("numberOfEmployees", v)} error={stage1Errors.numberOfEmployees} />
            <InputField label={text.stage1.fields.countryRegion.label} required helper={text.stage1.fields.countryRegion.helper} value={profile.countryRegion} onChange={(v) => updateField("countryRegion", v)} error={stage1Errors.countryRegion} />
            <InputField label={text.stage1.fields.officeLocations.label} required type="number" helper={text.stage1.fields.officeLocations.helper} value={profile.officeLocations} onChange={(v) => updateField("officeLocations", v)} error={stage1Errors.officeLocations} />
            <SelectField label={text.stage1.fields.tisaxLevel.label} required helper={text.stage1.fields.tisaxLevel.helper} options={text.stage1.options.tisaxLevel} value={profile.tisaxLevel || "Bilinmiyor"} onChange={(v) => updateField("tisaxLevel", v)} error={stage1Errors.tisaxLevel} />
            <SelectField label={text.stage1.fields.riskAppetite.label} required helper={text.stage1.fields.riskAppetite.helper} options={text.stage1.options.riskAppetite} value={profile.riskAppetite || "Orta"} onChange={(v) => updateField("riskAppetite", v)} error={stage1Errors.riskAppetite} />
          </div>

        </FormSection>
      )}
      {stage1Step === 2 && (
        <FormSection title={stage1Text.title} description={stage1Text.description}>
          <div className="grid two-col">
            <SelectField label={text.stage1.fields.itEnvironment.label} required helper={text.stage1.fields.itEnvironment.helper} options={text.stage1.options.itEnvironment} value={profile.itEnvironment} onChange={(v) => updateField("itEnvironment", v)} error={stage1Errors.itEnvironment} />
            <SelectField label={text.stage1.fields.thirdPartyProviders.label} required helper={text.stage1.fields.thirdPartyProviders.helper} options={text.stage1.options.yesNoPartial} value={profile.thirdPartyProviders} onChange={(v) => updateField("thirdPartyProviders", v)} error={stage1Errors.thirdPartyProviders} />
            <TextAreaField label={text.stage1.fields.criticalAssets.label} required helper={text.stage1.fields.criticalAssets.helper} value={profile.criticalAssets} onChange={(v) => updateField("criticalAssets", v)} error={stage1Errors.criticalAssets} />
          </div>
        </FormSection>
      )}
      {stage1Step === 3 && (
        <FormSection title={stage1Text.title} description={stage1Text.description}>
          <div className="grid two-col">
            <SelectField label={text.stage1.fields.securityPolicies.label} required helper={text.stage1.fields.securityPolicies.helper} options={text.stage1.options.yesNoPartial} value={profile.securityPolicies} onChange={(v) => updateField("securityPolicies", v)} error={stage1Errors.securityPolicies} />
            <SelectField label={text.stage1.fields.certificationStatus.label} required helper={text.stage1.fields.certificationStatus.helper} options={text.stage1.options.certification} value={profile.certificationStatus} onChange={(v) => updateField("certificationStatus", v)} error={stage1Errors.certificationStatus} />
            <TextAreaField label={text.stage1.fields.regulatoryRequirements.label} required helper={text.stage1.fields.regulatoryRequirements.helper} value={profile.regulatoryRequirements} onChange={(v) => updateField("regulatoryRequirements", v)} error={stage1Errors.regulatoryRequirements} />
          </div>
        </FormSection>
      )}
      {stage1Step === 4 && (
        <FormSection title={stage1Text.title} description={stage1Text.description}>
          <div className="grid two-col">
            <SelectField label={text.stage1.fields.maturityLevel.label} required helper={text.stage1.fields.maturityLevel.helper} options={text.stage1.options.maturity} value={profile.maturityLevel} onChange={(v) => updateField("maturityLevel", v)} error={stage1Errors.maturityLevel} />
            <TextAreaField label={text.stage1.fields.mainConcerns.label} required helper={text.stage1.fields.mainConcerns.helper} value={profile.mainConcerns} onChange={(v) => updateField("mainConcerns", v)} error={stage1Errors.mainConcerns} />
          </div>
        </FormSection>
      )}
      <div className="actions">
        <button className="ghost-btn" onClick={handleSignOut}>{text.common.signOut}</button>
        <div>
          {stage1Step > 1 && <button className="ghost-btn" onClick={handleStage1Back}>{text.common.back}</button>}
          <button className="primary-btn" onClick={handleStage1Save}>{stage1Step === config.length ? text.common.continueToStage2 : text.common.saveAndContinue}</button>
        </div>
      </div>
      {feedback && <p className="feedback success">{feedback}</p>}
    </div>
  );
}
