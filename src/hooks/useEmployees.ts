import { useState, useMemo } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';
import { mockEmployees } from '@/data/mockEmployees';

export interface FilterCriteria {
  firstName: string;
  department: string;
  role: string;
}

export type SortField = 'firstName' | 'department';
export type SortOrder = 'asc' | 'desc';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    firstName: '',
    department: '',
    role: '',
  });
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter, search, and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Apply search
    if (searchTerm) {
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filterCriteria.firstName) {
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(filterCriteria.firstName.toLowerCase())
      );
    }
    if (filterCriteria.department) {
      result = result.filter(employee =>
        employee.department.toLowerCase().includes(filterCriteria.department.toLowerCase())
      );
    }
    if (filterCriteria.role) {
      result = result.filter(employee =>
        employee.role.toLowerCase().includes(filterCriteria.role.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return result;
  }, [employees, searchTerm, filterCriteria, sortField, sortOrder]);

  // Paginated employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

  const addEmployee = (employeeData: EmployeeFormData) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map(e => e.id)) + 1,
    };
    setEmployees(prev => [...prev, newEmployee]);
    setCurrentPage(1); // Reset to first page after adding
  };

  const updateEmployee = (id: number, employeeData: EmployeeFormData) => {
    setEmployees(prev =>
      prev.map(employee =>
        employee.id === id ? { ...employee, ...employeeData } : employee
      )
    );
  };

  const deleteEmployee = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(employee => employee.id !== id));
      
      // Adjust current page if necessary
      const newFilteredCount = filteredAndSortedEmployees.filter(e => e.id !== id).length;
      const newTotalPages = Math.ceil(newFilteredCount / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const getEmployee = (id: number) => {
    return employees.find(employee => employee.id === id);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCriteria({ firstName: '', department: '', role: '' });
    setCurrentPage(1);
  };

  return {
    employees: paginatedEmployees,
    allEmployees: employees,
    totalEmployees: filteredAndSortedEmployees.length,
    searchTerm,
    setSearchTerm,
    filterCriteria,
    setFilterCriteria,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    resetFilters,
  };
};