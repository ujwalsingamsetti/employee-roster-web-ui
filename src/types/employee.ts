export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
}

export type EmployeeFormData = Omit<Employee, 'id'>;