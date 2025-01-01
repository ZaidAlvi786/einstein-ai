export const APP_PATHS = {
  home: {
    get: () => '/',
  },

  contacts: {
    tenants: {
      get: () => '/contacts/tenants',
    },
    ownerAndManager: {
      get: () => '/contacts/owner&manager',
    },
  },

  properties: {
    get: () => '/properties',

    new: {
      get: () => '/properties/new-property',
    },
    property: {
      properties: '/properties',
      getById: () => '/properties/:id',
    },
    units: {
      get: () => '/properties/units',
      getById: () => '/properties/:property_id/units/:id',
    },
    bulkEdit: {
      get: () => '/properties/:id/bulk-edit',
    },
    addTenant: {
      get: () => '/properties/add-tenant',
    },
  },

  leaseGuaranteed: {
    get: () => '/leases-guarantee',
    application: {
      get: () => '/leases-guarantee/application',
    },
    preQualified: {
      get: () => '/leases-guarantee/pre-qualified',
    },
  },

  leasing: {
    get: () => '/leases',
    getbyid: () => '/leases/:id',
    application: {
      getId: () => '/leases/application/:id',
      get: () => '/leases/application',
      new: {
        get: () => '/leases/application/new',
      },
    },
    addLease: {
      get: () => '/leases/add-lease',
    },
    addTenant: {
      get: () => '/leases/add-tenant',
    },
  },
  rentalApplication: {
    get: () => '/rental-application',
  },

  signup: {
    get: () => '/signup',
  },
  qualityTenant: {
    get: () => '/quality-tenant-guarantee',
    enrollTenant: {
      get: () => '/quality-tenant-guarantee/enroll',
    },
  },
  qualified: {
    get: () => '/qualified',
    qualifyTenant: {
      get: () => '/qualify-tenant',
    },
  },

  login: {
    get: () => '/login',
  },
  forgotPassword: {
    get: () => '/forgot-password',
  },
  resetPassword: {
    get: () => '/reset-password',
  },
  redirect: {
    get: () => '/redirect',
  },
};
