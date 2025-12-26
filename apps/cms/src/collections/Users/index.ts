import type { CollectionConfig } from "payload";

import { admins, adminsOrSelf, anyone, isSuperAdmin, isSuperAdminAccess } from "@/access/roles";

import { groups } from "../groups";
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { setCookieBasedOnDomain } from "./hooks/setCookieBasedOnDomain";
import { ensureUniqueUsername } from "./hooks/ensureUniqueUsername";

const defaultTenantArrayField = tenantsArrayField({
    tenantsArrayFieldName: 'tenants',
    tenantsArrayTenantFieldName: 'tenant',
    tenantsCollectionSlug: 'tenants',
    arrayFieldAccess: {},
    tenantFieldAccess: {},
    rowFields: [
        {
            name: 'roles',
            type: 'select',
            defaultValue: ['tenant-viewer'],
            hasMany: true,
            options: ['tenant-admin', 'tenant-viewer'],
            required: true,
            access: {
                update: ({ req }) => {
                    const { user } = req
                    if (!user) {
                        return false
                    }

                    if (isSuperAdminAccess({ req })) {
                        return true
                    }

                    return true
                },
            },
        },
    ],
})

export const Users: CollectionConfig = {
    slug: "users",
    access: {
        create: anyone,
        delete: admins,
        read: adminsOrSelf,
        update: admins,
    },
    admin: {
        useAsTitle: "email",
    },

    auth: true,
    fields: [
        // Email added by default
        {
            name: "firstName",
            type: "text",
            label: "First Name",
        },
        {
            name: "lastName",
            type: "text",
            label: "Last Name",
        },
        {
            type: 'text',
            name: 'password',
            hidden: true,
            access: {
                read: () => false, // Hide password field from read access
                update: ({ req, id }) => {
                    const { user } = req
                    if (!user) {
                        return false
                    }

                    if (id === user.id) {
                        // Allow user to update their own password
                        return true
                    }

                    return isSuperAdminAccess({ req })
                },
            },
        },
        {
            name: 'username',
            type: 'text',
            hooks: {
                beforeValidate: [ensureUniqueUsername],
            },
            index: true,
        },
        {
            name: "roles",
            type: "select",
            access: {
                create: ({ req }) => {
                    const isAdmin = !!req.user?.roles?.includes("admin");
                    return isAdmin;
                },
                update: ({ req }) => {
                    const isAdmin = !!req.user?.roles?.includes("admin");
                    return isAdmin;
                },
            },
            defaultValue: ["user"],
            hasMany: true,
            options: [
                {
                    label: "admin",
                    value: "admin",
                },
                {
                    label: "user",
                    value: "user",
                },
                {
                    label: "super admin",
                    value: "super-admin",
                },
            ],
            saveToJWT: true,
        },
        {
            ...defaultTenantArrayField,
            admin: {
                ...(defaultTenantArrayField?.admin || {}),
                position: 'sidebar',
            },
        },
    ],
    hooks: {
        afterLogin: [setCookieBasedOnDomain],
    },
};
