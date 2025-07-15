export interface Persona {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  hasStartChat: boolean;
  traits?: any[];
  updatedAt?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  active: boolean;
}
