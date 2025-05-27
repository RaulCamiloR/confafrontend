import "server-only";

import { getCurrentUser } from "./auth";
import { Actions, Resources, creatPolitica } from "./utils";

const policies: { [key: string]: ReturnType<typeof creatPolitica> } = {
  "Campanias EMAIL Read": creatPolitica(
    [Actions.Read],
    [
      Resources.CampaignsEmailCampaign,
      Resources.CampaignsEmailSegment,
      Resources.CampaignsEmailTemplate,
    ],
  ),
  "Campanias EMAIL Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [
      Resources.CampaignsEmailCampaign,
      Resources.CampaignsEmailSegment,
      Resources.CampaignsEmailTemplate,
    ],
  ),
  "Campanias SMS Read": creatPolitica(
    [Actions.Read],
    [
      Resources.CampaignsSmsCampaign,
      Resources.CampaignsSmsSegment,
      Resources.CampaignsSmsTemplate,
    ],
  ),
  "Campanias SMS Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [
      Resources.CampaignsSmsCampaign,
      Resources.CampaignsSmsSegment,
      Resources.CampaignsSmsTemplate,
    ],
  ),
  "Campanias VOZ Read": creatPolitica(
    [Actions.Read],
    [Resources.CampaignsVoiceCampaign, Resources.CampaignsVoiceSegment],
  ),
  "Campanias VOZ Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [Resources.CampaignsVoiceCampaign, Resources.CampaignsVoiceSegment],
  ),
  "Campanias Whatsapp Read": creatPolitica(
    [Actions.Read],
    [
      Resources.CampaignsWhatsappCampaign,
      Resources.CampaignsWhatsappSegment,
      Resources.CampaignsWhatsappTemplate,
    ],
  ),
  "Campanias Whatsapp Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [
      Resources.CampaignsWhatsappCampaign,
      Resources.CampaignsWhatsappSegment,
      Resources.CampaignsWhatsappTemplate,
    ],
  ),
  "Agenda Dinamica Read": creatPolitica(
    [Actions.Read],
    [Resources.AgendaDinamica],
  ),
  "Agenda Dinamica Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [Resources.AgendaDinamica],
  ),
  "Reportes Read": creatPolitica([Actions.Read], [Resources.Reportes]),
  "Reportes Write": creatPolitica([Actions.Read, Actions.Write], [Resources.Reportes]),
  "Admin Read": creatPolitica(
    [Actions.Read],
    [Resources.AdminUsuarios, Resources.AdminRoles, Resources.AdminArea],
  ),
  "Admin Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [Resources.AdminUsuarios, Resources.AdminRoles, Resources.AdminArea],
  ),
  "Contactos Read": creatPolitica([Actions.Read], [Resources.Contactos]),
  "Contactos Write": creatPolitica(
    [Actions.Read, Actions.Write],
    [Resources.Contactos],
  ),
};

export const testPolicy = async (
  actions: Array<Actions>,
  resources: Array<Resources>,
) => {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  user.modules = [
    "Campanias EMAIL Read",
    // "Campanias EMAIL Write ",
    // "Campanias Voz Read",
    // "Campanias Voz Write",
    // "Campanias SMS Read",
    // "Campanias SMS Write",
    // "Campanias Whatsapp Read",
    // "Campanias Whatsapp Write",
    "Agenda Dinamica Read",
    "Agenda Dinamica Write",
    "Reportes Read",
    "Reportes Write",
    "Admin Read",
    "Admin Write",
    "Contactos Read",
    "Contactos Write",
  ];

  const keys = Object.keys(policies);
  // NOTE: Return false if any module exists
  if (user.modules.every((mod) => !keys.includes(mod))) {
    return false;
  }
  // // NOTE: Return false if at least one module don't exists
  // if (user.modules.some((mod) => !keys.includes(mod))) {
  //   return false;
  // }
  return user.modules
    .filter((mod) => keys.includes(mod))
    .some((mod) => policies[mod](actions, resources));
};
