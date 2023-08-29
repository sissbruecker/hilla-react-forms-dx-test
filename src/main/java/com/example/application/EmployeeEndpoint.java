package com.example.application;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import dev.hilla.Endpoint;

import dev.hilla.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;

import com.vaadin.flow.server.auth.AnonymousAllowed;

/**
 * The endpoint for the client-side List View.
 */
@Endpoint
@AnonymousAllowed
public class EmployeeEndpoint {

    @Autowired
    private EmployeeService service;

    public int countEmployees(){
        return service.getEmployees().size();
    }

    public @Nonnull EmployeesData getEmployeesData(int offset, int limit) {
        List<Employee> allEmployees = service.getEmployees();
        List<Employee> employees = allEmployees.stream().skip(offset).limit(limit).collect(Collectors.toList());
        int totalSize = allEmployees.size();
        return new EmployeesData(employees, totalSize);
    }

    public void saveEmployee(Employee employee){
        service.saveEmployee(employee);
    }

    public static class EmployeesData {
        private @Nonnull List<@Nonnull Employee> employees;
        private @Nonnull int totalSize;

        public EmployeesData(List<Employee> employees, int totalSize){
            this.employees = new ArrayList<>(employees);
            this.totalSize = totalSize;
        }

        public List<Employee> getEmployees(){
            return employees;
        }

        public int getTotalSize(){
            return totalSize;
        }
    }

}
