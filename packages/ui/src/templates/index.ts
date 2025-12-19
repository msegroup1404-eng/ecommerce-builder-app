export const TEMPLATE_INDEX = {
  simple: {
    versions: {
      //   v1: {
      //     pages: {
      //       home: () => import("./simple/v1/home.json"),
      //       about: () => import("./simple/v1/about.json"),
      //       contact: () => import("./simple/v1/contact.json"),
      //       "products-list": () => import("./simple/v1/products-list.json"),
      //       "products-detail": () => import("./simple/v1/products-detail.json"),
      //     },
      //     puckConfig: () => import("./simple/v1/puck-config"),
      //     componentsMap: () => import("./simple/v1/componentsMap.lazy"),
      //     componentAvailability: () => import("./simple/v1/componentAvailability"),
      //   },
      // },
      v1: () => import("./simple/v1")
    },
  }
} as const;

export type TemplateID = keyof typeof TEMPLATE_INDEX;

export type VersionID<T extends TemplateID> =
  keyof (typeof TEMPLATE_INDEX)[T]["versions"];