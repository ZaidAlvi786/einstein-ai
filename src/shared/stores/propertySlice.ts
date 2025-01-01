import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import {
  AddUnitDetails,
  ContactDetails,
  EditUnitDetailsArgs,
  OwnerDetails,
  PropertyDetails,
  PropertyManegerSchema,
  SingleUnitInterface,
  UnitModelDataInterface,
  MultipleUnitInterface,
} from '@interfaces/property.interface';
import type { RootState } from './index';

const initialState = {
  data: null as any,
  contactDetails: null as any,
  loading: false,
  error: null as string | null,
  contact: null,
  unitsDetails: [] as UnitModelDataInterface[],
  singleUnits: [] as SingleUnitInterface[],
  multipleUnits: [] as MultipleUnitInterface[],
  responseUnits: {} as UnitModelDataInterface,
  ownerDetails: [] as OwnerDetails[],
  tempOwnerDetails: [] as OwnerDetails[],
  tempIndividualOwnerDetails: [] as OwnerDetails[],
  manegerDetails: [] as PropertyManegerSchema[],
};

export const propertyDetails = createAsyncThunk(
  'api/propertyDetails',
  async (userData: PropertyDetails) => {
    const response = await createRequest(
      API.PROPERTY.CREATE,
      'POST',
      userData,
      'multipart/form-data'
    );
    if (!response.data) {
      throw new Error('Network response was not ok');
    }
    if (response.data) {
      return response.data;
    }
  }
);

export const getPropertyDetails = createAsyncThunk('api/getPropertyDetails', async (id: string) => {
  const response = await createRequest(`${API.PROPERTY.GET}/${id}`, 'GET');
  if (!response) {
    throw new Error('Network response was not ok');
  }
  if (response) {
    return response;
  }
});

export const getOwnerDetailsByPropertyId = createAsyncThunk(
  'api/getOwnerDetailsByPropertyId',
  async (property_id: string) => {
    const response = await createRequest(`${API.CONTACTS.GET_BY_PROPERTY}/${property_id}`, 'GET');
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);

export const updateUnitTable = createAsyncThunk('api/updateUnitTable', async (tableData: any) => {
  const response = await createRequest(
    API.UNITS.UPDATE_BULK,
    'PUT',
    { units: tableData },
    'application/json'
  );
  if (!response.data) {
    throw new Error('Network response was not ok');
  }
  if (response.data) {
    return response.data;
  }
});

export const updatePropertyDetails = createAsyncThunk(
  'api/propertyDetails',
  async (propertyData: any) => {
    const response = await createRequest(
      `${API.PROPERTY.UPDATE}/${propertyData?.get('id')}`,
      'PUT',
      propertyData,
      'multipart/form-data'
    );
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response?.['id']) {
      return response;
    }
  }
);

export const propertyContacts = createAsyncThunk(
  'api/propertyContacts',
  async (userData: ContactDetails) => {
    const response = await createRequest(API.CONTACTS.CREATE, 'POST', userData, 'application/json');
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);

export const updatePropertyContacts = createAsyncThunk(
  'api/propertyContacts',
  async (contactData: ContactDetails) => {
    const response = await createRequest(
      `${API.CONTACTS.UPDATE}/${contactData.id}`,
      'PUT',
      contactData,
      'application/json'
    );
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);

export const getUnitDetailsList = createAsyncThunk('api/getUnitDetailsList', async () => {
  const response = await createRequest(API.UNITS.GET, 'GET');
  if (!response) {
    throw new Error('Network response was not ok');
  }
  if (response) {
    return response;
  }
});

export const getUnitDetailsListByProperty = createAsyncThunk(
  'api/getUnitDetailsListByProperty',
  async (id: string) => {
    const response = await createRequest(`${API.UNITS.GET_UNITS_BY_PROPERTY}/${id}`, 'GET');
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);


export const setUpdateProperty = createAsyncThunk(
  'api/setUpdateProperty',
  async (data: any) => {
    if (data) {
      return data;
    }
  }
);



export const getSingleUnits = createAsyncThunk('api/getSingleUnits', async (data:any) => {
  const response = await createRequest(
    `${API.UNITS.SINGLE_UNITS_MODEL}/${data.id}?limit=${data.limit}&last_evaluated_key=${data.lastId}&search_query=${data.searchQuery}`,
    'GET'
  );
  if (!response) {
    throw new Error('Network response was not ok');
  }
  if (response) {
    return response;
  }
});

export const getMultipleUnits = createAsyncThunk('api/getMultipleUnits', async (id: string) => {
  const response = await createRequest(`${API.UNITS.MULTI_UNITS_MODEL}/${id}`, 'GET');
  if (!response) {
    throw new Error('Network response was not ok');
  }
  if (response) {
    return response;
  }
});

export const addUnitDetails = createAsyncThunk(
  'api/addUnitDetails',
  async (userData: AddUnitDetails) => {
    const response = await createRequest(API.UNITS.CREATE, 'POST', userData, 'multipart/form-data');
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);

export const addUnitToModelDetails = createAsyncThunk(
  'api/addUnitToModelDetails',
  async (data: any) => {
    // Construct query params from data object
    const queryParams = Object.entries(data.params)
      .map(([key, value]) => {
        // Ensure value is of type string | number | boolean
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          return `${key}=${encodeURIComponent(value)}`;
        }
        // If the value isn't one of the accepted types, return an empty string or handle it as needed
        return '';
      })
      .filter((param) => param !== '') // Remove any empty strings
      .join('&');

    // Make the request with the query params
    const response = await createRequest(
      `${API.UNITS.UNITS_TO_MODEL}?${queryParams}`,
      'POST',
      data.formData,
      'multipart/form-data'
    );

    if (!response) {
      throw new Error('Network response was not ok');
    }

    return response;
  }
);

export const editUnitDetails = createAsyncThunk(
  'api/editUnitDetails',
  async ({ id, userData }: EditUnitDetailsArgs) => {
    const response = await createRequest(
      `${API.UNITS.UPDATE}/${id}`,
      'PUT',
      userData,
      'multipart/form-data'
    );
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);

export const deleteUnitDetails = createAsyncThunk('api/deleteUnitDetails', async (id: string) => {
  const response = await createRequest(`${API.UNITS.DELETE}/${id}`, 'DELETE');
  if (!response) {
    throw new Error('Network response was not ok');
  }
  if (response) {
    return response;
  }
});

export const moveUnitsToModel = createAsyncThunk('api/moveUnitsToModel', async (userData: any) => {
  const response = await createRequest(API.UNITS.MOVE_UNITS_TO_MODEL, 'PATCH', userData);
  if (!response) {
    throw new Error('Network response was not ok');
  }
  if (response) {
    return response;
  }
});

export const setOwnerDetails = createAsyncThunk(
  'api/setOwnerDetails',
  async (data: OwnerDetails) => {
    if (data) {
      return data;
    }
  }
);

export const sameAsOwner = createAsyncThunk(
  'api/sameAsOwner',
  async (data: PropertyManegerSchema) => {
    if (data) {
      return data;
    }
  }
);

export const deleteOwnerDetails = createAsyncThunk('api/deleteOwnerDetails', async (index: any) => {
  if (index !== undefined) {
    return index;
  }
});

export const clearOwnerDetails = createAsyncThunk('api/clearOwnerDetails', async () => {
  return;
});

export const updateOwnerDetails = createAsyncThunk(
  'api/updateOwnerDetails',
  async (data: OwnerDetails) => {
    if (data) {
      return data;
    }
  }
);

export const setManagerDetails = createAsyncThunk(
  'api/setManagerDetails',
  async (data: PropertyManegerSchema) => {
    if (data) {
      return data;
    }
  }
);

export const deleteManegerDetails = createAsyncThunk(
  'api/deleteManegerDetails',
  async (index: any) => {
    if (index !== undefined) {
      return index;
    }
  }
);

export const clearMangerDetails = createAsyncThunk('api/clearManegerDetails', async () => {
  return;
});

export const updateManagerDetails = createAsyncThunk(
  'api/updateManagerDetails',
  async (data: PropertyManegerSchema) => {
    if (data) {
      return data;
    }
  }
);

export const getUnitGroupModel = createAsyncThunk(
  'api/getUnitGroupModel',
  async (property_id: string) => {
    const response = await createRequest(`${API.UNITS.GET_MULTIPLE_MODEL}/${property_id}`, 'GET');
    if (!response) {
      throw new Error('Network response was not ok');
    }
    if (response) {
      return response;
    }
  }
);

export const clearAllData = createAsyncThunk('api/clearAllData', async () => {
  return;
});

const propertySlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    clearData(state) {
      state.data = null;
      state.error = null;
      state.contact = null;
      state.manegerDetails = [];
      state.ownerDetails = [];
    },
    clearHederData(state) {
      state.data = null;
      state.contactDetails = null;
    },
    setPropertyData(state) {
      state.data = null;
    },
    updateUnitDetailsUnits(state, action) {
      state.unitsDetails = action.payload;
    },
    addTempOwnerDetails(state, action) {
      state.tempOwnerDetails = action.payload;
    },
    addTempIndividualOwnerDetails(state, action) {
      state.tempIndividualOwnerDetails = action.payload;
    },
    updateTempToOwnerDetails(state, action) {
      action.payload
        ? (state.ownerDetails = state.tempIndividualOwnerDetails)
        : (state.ownerDetails = state.tempOwnerDetails);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(propertyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(propertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getPropertyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOwnerDetailsByPropertyId.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetails = action.payload;
      })
      .addCase(getOwnerDetailsByPropertyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(propertyContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload;
      })
      .addCase(setManagerDetails.fulfilled, (state, action) => {
        if (action.payload) {
          state.manegerDetails.push(action.payload);
        } else {
          state.manegerDetails = [];
        }
      })
      .addCase(setOwnerDetails.fulfilled, (state, action) => {
        if (action.payload) {
          state.ownerDetails.push(action.payload);
        }
      })
      .addCase(sameAsOwner.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.manegerDetails = action.payload; // Ensure this is an array of PropertyManegerSchema
        } else {
          state.manegerDetails = [];
        }
      })
      .addCase(deleteOwnerDetails.fulfilled, (state, action) => {
        if (typeof action.payload === 'number') {
          state.ownerDetails.splice(action.payload, 1);
        }
      })
      .addCase(clearOwnerDetails.fulfilled, (state) => {
        state.ownerDetails = [];
      })
      .addCase(clearAllData.fulfilled, (state) => {
        state.data = null;
        state.error = null;
        state.contact = null;
        state.manegerDetails = [];
        state.ownerDetails = [];
      })
      .addCase(updateOwnerDetails.fulfilled, (state, action) => {
        if (action.payload && action.payload.index !== undefined) {
          state.ownerDetails[action.payload.index] = action.payload.owner;
        } else {
          state.ownerDetails = [];
        }
      })
      .addCase(deleteManegerDetails.fulfilled, (state, action) => {
        if (typeof action.payload === 'number') {
          state.manegerDetails.splice(action.payload, 1);
        }
      })
      .addCase(clearMangerDetails.fulfilled, (state) => {
        state.manegerDetails = [];
      })
      .addCase(updateManagerDetails.fulfilled, (state, action) => {
        if (action.payload && action.payload.index !== undefined) {
          state.manegerDetails[action.payload.index] = action.payload.maneger;
        } else {
          state.manegerDetails = [];
        }
      })
      .addCase(propertyContacts.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(getUnitDetailsListByProperty.fulfilled, (state, action) => {
        state.unitsDetails = action.payload;
      })
      .addCase(setUpdateProperty.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(getUnitDetailsListByProperty.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(getSingleUnits.fulfilled, (state, action) => {
        state.singleUnits = action.payload;
      })
      .addCase(getSingleUnits.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(getMultipleUnits.fulfilled, (state, action) => {
        state.multipleUnits = action.payload;
      })
      .addCase(getMultipleUnits.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(addUnitDetails.fulfilled, (state, action) => {
        state.responseUnits = action.payload;

        if (action.payload.unit_type === 'single') {
          state.unitsDetails = [...state.unitsDetails, action.payload];
        }
      })

      .addCase(addUnitDetails.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(editUnitDetails.fulfilled, (state, action) => {
        state.unitsDetails = state.unitsDetails.map((unit) => {
          if (unit.id === action.payload.id) {
            return action.payload;
          }
          return unit;
        });
      })
      .addCase(editUnitDetails.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(addUnitToModelDetails.fulfilled, (state, action) => {
        state.unitsDetails = state.unitsDetails.map((unit) => {
          if (unit.id === action.payload.unit_model_id) {
            return { ...unit, units: [...(unit.units ?? []), action.payload.unit] };
          }
          return unit;
        });
      })
      .addCase(addUnitToModelDetails.rejected, (state, action) => {
        state.error = action.error.message || null;
      });
  },
});

export const {
  clearData,
  setPropertyData,
  updateUnitDetailsUnits,
  addTempOwnerDetails,
  updateTempToOwnerDetails,
  addTempIndividualOwnerDetails,
  clearHederData,
} = propertySlice.actions;

export const selectApiData = (state: RootState) => state.property.data;
export const getContactOfPropertyDetails = (state: RootState) => state.property.contactDetails;
export const selectApiLoading = (state: RootState) => state.property.loading;
export const selectApiError = (state: RootState) => state.property.error;
export const getOwnerDeatils = (state: RootState) => state.property.ownerDetails;
export const getManegerDeatils = (state: RootState) => state.property.manegerDetails;
export const getContactDetails = (state: RootState) => state.property.contact;
export const getUnitMixDetails = (state: RootState) => state.property.unitsDetails;
export const getResponseUnits = (state: RootState) => state.property.responseUnits;
export const getSingleModelUnits = (state: RootState) => state.property.singleUnits;
export const getMultipleModelUnits = (state: RootState) => state.property.multipleUnits;

export default propertySlice.reducer;
