import { headers as getHeaders } from 'next/headers.js'
import PuckEditor from './components/PuckEditor'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { getCollectionIDType } from '@/utils/getCollectionIDType'
import { getPayload, TextFieldServerComponent } from 'payload'
import React from 'react'
import payloadConfig from '@/payload.config'
import { notFound } from 'next/navigation'
import { getUserTenantIDs } from '@/utils/getUserTanentIDs'

const Page: TextFieldServerComponent = async ({ data, user }) => {
  const headers = await getHeaders()
  const payload = await getPayload({ config: payloadConfig })

  const activeTenantID = getTenantFromCookie(
    headers,
    getCollectionIDType({ collectionSlug: 'tenants', payload }),
  )

  if (!activeTenantID) {
    return notFound()
  }
  const activeTenat = await payload.findByID({
    collection: 'tenants',
    id: activeTenantID,
  })
  return <PuckEditor tenant={activeTenat} handle={data.handle} />
}

export default Page
