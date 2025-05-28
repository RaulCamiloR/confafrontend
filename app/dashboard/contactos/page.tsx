"use server";

import { testPolicy } from "@/app/data/policies";
import SegmentShow from "./components/SegmentShow";
import { Actions, Resources } from "@/app/data/utils";

const ContactosPage = async () => {
  const hasEmailPermission = await testPolicy(
    Actions.Read,
    [Resources.CampaignsEmailSegment],
  );
  const hasSmsPermission = await testPolicy(
    Actions.Read,
    [Resources.CampaignsSmsSegment],
  );
  const hasVoicePermission = await testPolicy(
    Actions.Read,
    [Resources.CampaignsVoiceSegment],
  );

  return (
    <SegmentShow
      hasEmailPermission={hasEmailPermission}
      hasSmsPermission={hasSmsPermission}
      hasVoicePermission={hasVoicePermission}
    />
  );
};

export default ContactosPage;

