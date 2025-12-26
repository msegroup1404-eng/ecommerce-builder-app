import { Config } from '@measured/puck'
import { PuckProps } from '../puck-types'
import { ReactNode } from 'react'

export const config: Config<any> = {
  root: {
    fields: {
      title: { type: 'text' },
      description: { type: 'textarea' },
      handle: { type: 'text' },
    },
    render: ({ children }: { children: ReactNode }) => {
      return (
        <div className="twp">
          {/* <AuthProvider> */}
            {children}
            {/* </AuthProvider> */}
        </div>
      )
    },
  },
  categories: {
    layout: {
      title: '🏗️ Sections',
      components: ['HeaderBlock', 'FooterSection', 'HeroSection', 'LandingHeroSection'],
    },
    content: {
      title: '📝 Blocks',
      components: [
        'HeadingBlock',
        'NewsletterSection',
        'ProductGrid',
        'FeaturedProductsSection',
        'FeatureCard',
      ],
    },
    elements: {
      title: '🔧 Components',
      components: ['TextBlock', 'ButtonBlock', 'Logo', 'StatItem', 'Badge', 'Spacer'],
    },
  },
  components: {

  },
}
