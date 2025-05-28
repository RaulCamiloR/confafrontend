"use server";

import { testPolicy } from "@/app/data/policies";
import TemplatesShow from "./components/TemplatesShow";
import { Actions, Resources } from "@/app/data/utils";

const PlantillasPage = async () => {
  const hasEmailPermission = await testPolicy(
    Actions.Read,
    [Resources.CampaignsEmailTemplate],
  );
  const hasSmsPermission = await testPolicy(
    Actions.Read,
    [Resources.CampaignsSmsTemplate],
  );
  const hasEmailPermissionWriteOnly = await testPolicy(
    Actions.Write,
    [Resources.CampaignsEmailTemplate],
  );
  const hasSmsPermissionWriteOnly = await testPolicy(
    Actions.Write,
    [Resources.CampaignsSmsTemplate],
  );

  return (
    <TemplatesShow
      hasEmailPermission={hasEmailPermission}
      hasSmsPermission={hasSmsPermission}
      hasEmailPermissionWriteOnly={hasEmailPermissionWriteOnly}
      hasSmsPermissionWriteOnly={hasSmsPermissionWriteOnly}
    />
  );
}

export default PlantillasPage
