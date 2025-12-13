import { TEMPLATE_INDEX, TemplateID } from '@repo/templates'

function isValidTemplateKey(key: string): key is TemplateID {
  return key in TEMPLATE_INDEX;
}

export async function loadTemplatePackage(template: string, version: string) {
  if (isValidTemplateKey(template))
    return TEMPLATE_INDEX[template]()
}

