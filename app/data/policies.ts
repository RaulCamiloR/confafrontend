import "server-only";

import { getCurrentUser } from "./auth";
import { Actions, Resources, creatPermisosModulo } from "./utils";

//// NOTE: Modulos
// NOTE: module names
const CAMPAIGNS_EMAIL_READ = "EMAIL-READ";
const CAMPAIGNS_EMAIL_WRITE = "EMAIL-WRITE";
const CAMPAIGNS_SMS_READ = "SMS-READ";
const CAMPAIGNS_SMS_WRITE = "SMS-WRITE";
const CAMPAIGNS_VOICE_READ = "VOICE-READ";
const CAMPAIGNS_VOICE_WRITE = "VOICE-WRITE";
const CAMPAIGNS_WHATSAPP_READ = "WHATSAPP-READ";
const CAMPAIGNS_WHATSAPP_WRITE = "WHATSAPP-WRITE";
const ADMIN_READ = "ADMIN-READ";
const ADMIN_WRITE = "ADMIN-WRITE";
const AGENDA_DINAMICA_READ = "AGENDA-DINAMICA-READ";
const AGENDA_DINAMICA_WRITE = "AGENDA-DINAMICA-WRITE";
const REPORTES_READ = "REPORTES-READ";
const REPORTES_WRITE = "REPORTES-WRITE";
const CONTACTOS_READ = "CONTACTOS-READ";
const CONTACTOS_WRITE = "CONTACTOS-WRITE";

const policies: { [key: string]: ReturnType<typeof creatPermisosModulo> } = {
  [CAMPAIGNS_EMAIL_READ]: creatPermisosModulo(
    [Actions.Read],
    [
      Resources.CampaignsEmailCampaign,
      Resources.CampaignsEmailSegment,
      Resources.CampaignsEmailTemplate,
    ],
  ),
  [CAMPAIGNS_EMAIL_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [
      Resources.CampaignsEmailCampaign,
      Resources.CampaignsEmailSegment,
      Resources.CampaignsEmailTemplate,
    ],
  ),
  [CAMPAIGNS_SMS_READ]: creatPermisosModulo(
    [Actions.Read],
    [
      Resources.CampaignsSmsCampaign,
      Resources.CampaignsSmsSegment,
      Resources.CampaignsSmsTemplate,
    ],
  ),
  [CAMPAIGNS_SMS_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [
      Resources.CampaignsSmsCampaign,
      Resources.CampaignsSmsSegment,
      Resources.CampaignsSmsTemplate,
    ],
  ),
  [CAMPAIGNS_VOICE_READ]: creatPermisosModulo(
    [Actions.Read],
    [Resources.CampaignsVoiceCampaign, Resources.CampaignsVoiceSegment],
  ),
  [CAMPAIGNS_VOICE_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [Resources.CampaignsVoiceCampaign, Resources.CampaignsVoiceSegment],
  ),
  [CAMPAIGNS_WHATSAPP_READ]: creatPermisosModulo(
    [Actions.Read],
    [
      Resources.CampaignsWhatsappCampaign,
      Resources.CampaignsWhatsappSegment,
      Resources.CampaignsWhatsappTemplate,
    ],
  ),
  [CAMPAIGNS_WHATSAPP_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [
      Resources.CampaignsWhatsappCampaign,
      Resources.CampaignsWhatsappSegment,
      Resources.CampaignsWhatsappTemplate,
    ],
  ),
  [AGENDA_DINAMICA_READ]: creatPermisosModulo(
    [Actions.Read],
    [Resources.AgendaDinamica],
  ),
  [AGENDA_DINAMICA_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [Resources.AgendaDinamica],
  ),
  [REPORTES_READ]: creatPermisosModulo([Actions.Read], [Resources.Reportes]),
  [REPORTES_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [Resources.Reportes],
  ),
  [ADMIN_READ]: creatPermisosModulo(
    [Actions.Read],
    [Resources.AdminUsuarios, Resources.AdminRoles, Resources.AdminArea],
  ),
  [ADMIN_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [Resources.AdminUsuarios, Resources.AdminRoles, Resources.AdminArea],
  ),
  [CONTACTOS_READ]: creatPermisosModulo([Actions.Read], [Resources.Contactos]),
  [CONTACTOS_WRITE]: creatPermisosModulo(
    [Actions.Read, Actions.Write],
    [Resources.Contactos],
  ),
};

export const testPolicy = async (
  action: Actions,
  resources: Array<Resources>,
) => {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  const keys = Object.keys(policies);
  // NOTE: Return false if at least one module don't exists
  if (user.modules.some((mod) => !keys.includes(mod))) {
    return false;
  }
  return user.modules
    .filter((mod) => keys.includes(mod))
    .some((mod) => policies[mod](action, resources));
};
