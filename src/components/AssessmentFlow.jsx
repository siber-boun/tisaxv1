import React from 'react';
import StageIndicator from './StageIndicator';
import AssessmentSectionCard from './AssessmentSectionCard';

export default function AssessmentFlow({ 
  stage2Step, 
  stage2Sections, 
  stage2Answers, 
  stage2Errors, 
  handleAnswer, 
  maturityOptions, 
  text, 
  profile, 
  currentUser, 
  handleSignOut, 
  handleEditProfile, 
  handleStage2Back, 
  handleStage2Save, 
  feedback 
}) {
  const currentStage2 = stage2Sections[stage2Step - 1];

  return (
    <div className="onboarding-content">
      <StageIndicator step={stage2Step} total={stage2Sections.length} title={currentStage2.title} stageLabel={text.journey.stage2} stepLabel={text.common.step} />
      <section className="card stage-context">
        <p className="kicker">{text.journey.sharedProfile}</p>
        <strong>{profile.companyName || currentUser?.companyName || text.common.profileNotSet}</strong>
        <p>{profile.industrySector || text.common.profileNotSet} · {profile.companySize || text.common.profileNotSet} · {profile.countryRegion || text.common.profileNotSet}</p>
      </section>
      <AssessmentSectionCard section={currentStage2} answers={stage2Answers} errors={stage2Errors} onAnswer={handleAnswer} maturityOptions={maturityOptions} />
      <div className="actions">
        <button className="ghost-btn" onClick={handleSignOut}>{text.common.signOut}</button>
        <div>
          <button className="ghost-btn" onClick={handleEditProfile}>{text.journey.editProfile}</button>
          {stage2Step > 1 && <button className="ghost-btn" onClick={handleStage2Back}>{text.common.back}</button>}
          <button className="primary-btn" onClick={handleStage2Save}>{text.common.saveAndContinue}</button>
        </div>
      </div>
      {feedback && <p className="feedback success">{feedback}</p>}
    </div>
  );
}
