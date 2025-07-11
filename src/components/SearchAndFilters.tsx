import { useState } from 'react';
import { FilterCriteria, SortField, SortOrder } from '@/hooks/useEmployees';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterCriteria: FilterCriteria;
  onFilterChange: (criteria: FilterCriteria) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  onResetFilters: () => void;
  totalEmployees: number;
}

const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Operations'];

export const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  filterCriteria,
  onFilterChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
  totalEmployees,
}: SearchAndFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchTerm || filterCriteria.firstName || filterCriteria.department || filterCriteria.role;
  const activeFilterCount = [
    searchTerm,
    filterCriteria.firstName,
    filterCriteria.department,
    filterCriteria.role,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortField} onValueChange={(value: SortField) => onSortFieldChange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="department">Department</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {totalEmployees} employee{totalEmployees !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">First Name</label>
                <Input
                  placeholder="Filter by first name"
                  value={filterCriteria.firstName}
                  onChange={(e) => onFilterChange({ ...filterCriteria, firstName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select
                  value={filterCriteria.department}
                  onValueChange={(value) => onFilterChange({ ...filterCriteria, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Input
                  placeholder="Filter by role"
                  value={filterCriteria.role}
                  onChange={(e) => onFilterChange({ ...filterCriteria, role: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};