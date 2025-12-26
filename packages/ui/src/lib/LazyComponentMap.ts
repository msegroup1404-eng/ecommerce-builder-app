export const lazyComponentMap: Record<string, () => Promise<any>> = {
    Hero: () => import('../blocks/Hero-Header-Sections/Hero1'),
    Footer: () => import('../blocks/Footers/Footer'),
    Page: () => import('../components/Page'),
    ProductGrid: () => import('../blocks/Product-List-Sections/ProductGrid'),
    Section: () => import('../components/Section'),
    Callout: () => import('../components/Callout')
}