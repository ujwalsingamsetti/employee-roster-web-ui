import { useState } from 'react';
import { Employee } from '@/types/employee';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeCard } from '@/components/EmployeeCard';
import { EmployeeForm } from '@/components/EmployeeForm';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const { toast } = useToast();

  const {
    employees,
    totalEmployees,
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
    resetFilters,
  } = useEmployees();

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleSaveEmployee = (employeeData: any) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
      toast({
        title: "Employee updated",
        description: `${employeeData.firstName} ${employeeData.lastName} has been updated successfully.`,
      });
    } else {
      addEmployee(employeeData);
      toast({
        title: "Employee added",
        description: `${employeeData.firstName} ${employeeData.lastName} has been added successfully.`,
      });
    }
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleDeleteEmployee = (id: number) => {
    deleteEmployee(id);
    toast({
      title: "Employee deleted",
      description: "Employee has been deleted successfully.",
      variant: "destructive",
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Employee Directory</h1>
              <p className="text-muted-foreground">Manage your team members</p>
            </div>
          </div>
          
          <Button onClick={handleAddEmployee} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterCriteria={filterCriteria}
          onFilterChange={setFilterCriteria}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onResetFilters={resetFilters}
          totalEmployees={totalEmployees}
        />

        {/* Employee Grid */}
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">
              {totalEmployees === 0 
                ? "Get started by adding your first employee."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {totalEmployees === 0 && (
              <Button onClick={handleAddEmployee}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={totalEmployees}
        />

        {/* Employee Form Modal */}
        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSaveEmployee}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
