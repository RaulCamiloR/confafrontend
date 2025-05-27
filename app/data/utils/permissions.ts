import { Actions } from "./actions";
import { Resources } from "./resources";

export const creatPolitica = (
  actions: Array<Actions>,
  resources: Array<Resources>,
) => {
  return (_actions: Array<Actions>, _resources: Array<Resources>) =>
    _actions.some((action) => actions.includes(action)) &&
    _resources.some((resource) => resources.includes(resource));
};
