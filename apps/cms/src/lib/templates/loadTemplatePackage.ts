import { TEMPLATE_INDEX } from "@repo/ui/templates/index.js";
import { TemplateID, TemplatePackage, TemplateVersionModule, VersionID } from "@repo/ui/templates/types.js";

export async function loadTemplatePackage<
  T extends TemplateID,
  V extends VersionID<T>
>(
  template: T,
  version: V
): Promise<any> {
  const versions = TEMPLATE_INDEX[template].versions as (typeof TEMPLATE_INDEX)[T]["versions"]
  const mod = await versions[version];
  return mod;
}