"use server";

import { testPolicy } from "@/app/data/policies";
import CampaignShow from "./components/CampaignShow";
import { Actions, Resources } from "@/app/data/utils";

const CampaniasPage = async () => {
  const hasEmailPermission = await testPolicy(Actions.Read, [
    Resources.CampaignsEmailCampaign,
  ]);
  const hasSmsPermission = await testPolicy(Actions.Read, [
    Resources.CampaignsSmsCampaign,
  ]);
  const hasVoicePermission = await testPolicy(Actions.Read, [
    Resources.CampaignsVoiceCampaign,
  ]);

  return (
    <CampaignShow
      hasEmailPermission={hasEmailPermission}
      hasSmsPermission={hasSmsPermission}
      hasVoicePermission={hasVoicePermission}
    />
  );
};

export default CampaniasPage;
