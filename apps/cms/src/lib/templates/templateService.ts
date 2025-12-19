// apps/cms/src/services/TemplateService.ts
import { TemplateID, VersionID } from "@repo/ui/templates/types.js";
import { loadTemplatePackage } from "./loadTemplatePackage";
import { TenantsSelect } from "@/payload-types";
// import { mergeSettingsIntoNode } from "@shared-utils/mergeTemplateSettings";
import { Tenant } from '@/payload-types'
import { Config } from "@measured/puck";


export const TemplateService = {
  // --------------------------------------------
  // Load template version module for tenant
  // --------------------------------------------
  async load(tenant: Tenant) {

    const version = (tenant.templateVersion || "v1") as VersionID<TemplateID>;
    const { default: versions } = await loadTemplatePackage(tenant.template as TemplateID, version);
    return versions;
  },

  // --------------------------------------------
  // Produce filtered Puck config
  // --------------------------------------------
  async getPuckConfig(tenant: Tenant): Promise<Config> {
    const pkg = await this.load(tenant);

    const { default: puckConfig } = await pkg.puckConfig();
    const { default: availability } = await pkg.componentAvailability();

    if (!puckConfig.components) {
      console.warn("puckConfig.components is missing");
      return puckConfig;
    }

    const availabilityObj = availability ?? {};
    const filteredComponents = Object.fromEntries(
      Object.entries(puckConfig.components).filter(([key]) => availabilityObj[key] !== false)
    );

    return { ...puckConfig, components: filteredComponents };
  },

  // --------------------------------------------
  // Load default page snapshot for new page
  // --------------------------------------------
  async getDefaultPageSnapshot(tenant: Tenant, slug: string) {
    const pkg = await this.load(tenant);


    const { default: snapshot } = await pkg.pages?.[slug];
    if (!snapshot) return null;
    let tree = structuredClone(snapshot);

    const settings = tenant.templateSettings || {};
    // tree = mergeSettingsIntoNode(tree, settings);

    return tree;
  },

};
