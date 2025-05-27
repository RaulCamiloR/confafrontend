import { Actions } from "./actions";
import { Resources } from "./resources";

export const creatPermisosModulo = (
  actions: Array<Actions>,
  resources: Array<Resources>,
) => {
  return (action: Actions, _resources: Array<Resources>) =>
    actions.includes(action) &&
    resources.some((resource) => _resources.includes(resource));
};
