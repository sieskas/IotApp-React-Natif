// src/types/organization.ts

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Contact {
  phone: string;
  email: string;
  manager: {
    name: string;
    email: string;
  };
}

export interface OpeningHours {
  monday?: { open: string; close: string } | { closed: true };
  tuesday?: { open: string; close: string } | { closed: true };
  wednesday?: { open: string; close: string } | { closed: true };
  thursday?: { open: string; close: string } | { closed: true };
  friday?: { open: string; close: string } | { closed: true };
  saturday?: { open: string; close: string } | { closed: true };
  sunday?: { open: string; close: string } | { closed: true };
}

export interface BusinessInfo {
  registration_number: string;
  tax_id: string;
  industry: string;
  opening_hours: OpeningHours;
}

export interface LocationPermissions {
  can_create_locations: boolean;
  can_manage_inventory: boolean;
  can_view_all_reports: boolean;
  can_manage_users: boolean;
}

export interface LocalSettings {
  currency: string;
  timezone: string;
  language: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'headquarters' | 'branch' | 'franchise' | 'single_location';
  status: 'active' | 'inactive' | 'pending';
  parent_location_id?: string;
  address: Address;
  contact: Contact;
  business_info: BusinessInfo;
  local_settings?: LocalSettings;
  permissions: LocationPermissions;
  created_at: string;
  updated_at?: string;
}

export interface OrganizationSettings {
  currency: string;
  timezone: string;
  language: string;
  fiscal_year_start?: string;
}

export interface Organization {
  id: string;
  name: string;
  headquarters: {
    location_id: string;
    is_main: boolean;
  };
  settings: OrganizationSettings;
}

export interface Subscription {
  plan: 'basic' | 'premium' | 'enterprise';
  locations_limit: number;
  features: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'single' | 'enterprise';
  created_at: string;
  updated_at?: string;
  subscription: Subscription;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'location_manager' | 'owner' | 'employee';
  locations_access: string[];
  permissions: string[];
  primary_location_id: string;
  created_at: string;
}

export interface LocationRelationship {
  parent_id: string;
  child_id: string;
  relationship_type: 'branch' | 'franchise';
  inheritance: {
    settings: boolean;
    users: boolean;
    inventory: boolean;
  };
}

export interface OrganizationData {
  client: Client;
  organization: Organization;
  locations: Location[];
  users: User[];
  location_relationships?: LocationRelationship[];
}

// Types pour les formulaires d'ajout de location
export interface CreateLocationRequest {
  name: string;
  type: Location['type'];
  parent_location_id?: string;
  address: Address;
  contact: Contact;
  business_info: BusinessInfo;
  local_settings?: LocalSettings;
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> {
  id: string;
  status?: Location['status'];
}
