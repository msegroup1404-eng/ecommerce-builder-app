export async function loadTemplatePackage(template: string, version: string) {
  return await import(`@template-packages/${template}/${version}`)
}
