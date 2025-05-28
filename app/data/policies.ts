import "server-only";

import { getCurrentUser } from "./auth";
import { Actions, Resources, creatPermisosModulo } from "./utils";

//// NOTE: Modulos
// NOTE: module names
// TODO: Pendiente cambiar nombres que se hayan seleccionado desde el backend
const CAMPAIGNS_EMAIL_READ = "Campanias EMAIL Read";
const CAMPAIGNS_EMAIL_WRITE = "Campanias EMAIL Write";
const CAMPAIGNS_SMS_READ = "Campanias SMS Read";
const CAMPAIGNS_SMS_WRITE = "Campanias SMS Write";
const CAMPAIGNS_VOICE_READ = "Campanias VOICE Read";
const CAMPAIGNS_VOICE_WRITE = "Campanias VOICE Write";
const CAMPAIGNS_WHATSAPP_READ = "Campanias WHATSAPP Read";
const CAMPAIGNS_WHATSAPP_WRITE = "Campanias WHATSAPP Write";
const AGENDA_DINAMICA_READ = "AGENDA_DINAMICA Read";
const AGENDA_DINAMICA_WRITE = "AGENDA_DINAMICA Write";
const REPORTES_READ = "REPORTES Read";
const REPORTES_WRITE = "REPORTES Write";
const ADMIN_READ = "ADMIN Read";
const ADMIN_WRITE = "ADMIN Write";
const CONTACTOS_READ = "CONTACTOS Read";
const CONTACTOS_WRITE = "CONTACTOS Write";

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

  // TODO: Pendiente eliminar cuando el backend envie los modulos
  user.modules = [
    CAMPAIGNS_EMAIL_READ,
    CAMPAIGNS_EMAIL_WRITE,
    CAMPAIGNS_SMS_READ,
    CAMPAIGNS_SMS_WRITE,
    CAMPAIGNS_VOICE_READ,
    CAMPAIGNS_VOICE_WRITE,
    CAMPAIGNS_WHATSAPP_READ,
    CAMPAIGNS_WHATSAPP_WRITE,
    AGENDA_DINAMICA_READ,
    AGENDA_DINAMICA_WRITE,
    REPORTES_READ,
    REPORTES_WRITE,
    ADMIN_READ,
    ADMIN_WRITE,
    CONTACTOS_READ,
    CONTACTOS_WRITE,
  ];

  const keys = Object.keys(policies);
  // // NOTE: Return false if any module exists
  // if (user.modules.every((mod) => !keys.includes(mod))) {
  //   return false;
  // }
  // NOTE: Return false if at least one module don't exists
  if (user.modules.some((mod) => !keys.includes(mod))) {
    return false;
  }
  return user.modules
    .filter((mod) => keys.includes(mod))
    .some((mod) => policies[mod](action, resources));
};
