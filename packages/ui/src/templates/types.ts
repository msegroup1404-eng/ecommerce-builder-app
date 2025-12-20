import { TEMPLATE_INDEX } from ".";
import { Data } from "@measured/puck";

export type TemplateSnapshot = Data & {
  id: string;
  name: string;                            // template name, e.g. "modern"
  version: string;
  updatedAt: string;
  meta?: Record<string, any>;
  defaults?: {
    [key: string]: any;
  };
  tokens?: {
    [key: string]: any;
  }
}

// Template IDs
export type TemplateID = keyof typeof TEMPLATE_INDEX;

// Version IDs per template
export type VersionID<T extends TemplateID> =
  keyof (typeof TEMPLATE_INDEX)[T]["versions"];

// Package type for a given template+version
export type TemplatePackage<
  T extends TemplateID,
  V extends VersionID<T>
> = (typeof TEMPLATE_INDEX)[T]["versions"][V];

// export type PageID<
//   T extends TemplateID,
//   V extends VersionID<T>
// > = keyof TemplatePackage<T, V>['pages'];

// Shape of a template version barrel file
export interface TemplateVersionModule {
  pages: {
    home: () => Promise<{ default: TemplateSnapshot }>;
    about: () => Promise<{ default: TemplateSnapshot }>;
    contact: () => Promise<{ default: TemplateSnapshot }>;
    "products-list": () => Promise<{ default: TemplateSnapshot }>;
    "products-detail": () => Promise<{ default: TemplateSnapshot }>;
  };
  puckConfig: () => Promise<{ default: unknown }>;
  componentsMap: () => Promise<{ default: unknown }>;
  componentAvailability: () => Promise<{ default: Record<string, boolean> }>;
}

