import {Button} from "@hilla/react-components/Button.js";
import {EmailField} from "@hilla/react-components/EmailField.js";
import {FormLayout} from "@hilla/react-components/FormLayout.js";
import {Grid, GridDataProviderCallback, GridDataProviderParams} from "@hilla/react-components/Grid.js";
import {GridColumn} from "@hilla/react-components/GridColumn.js";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout.js";
import {SplitLayout} from "@hilla/react-components/SplitLayout.js";
import {TextField} from "@hilla/react-components/TextField.js";
import Employee from "Frontend/generated/com/example/application/Employee";
import {EmployeeEndpoint} from "Frontend/generated/endpoints";
import React, {useEffect, useMemo, useState} from "react";

/*
 * Tasks:
 * 1. Make the submit button functional, so that it saves the form data to the
 *    backend, via the `EmployeeEndpoint.saveEmployee` endpoint method.
 * 2. Add a client-side validation constraint that checks that the email ends
 *    with `@vaadin.com`.
 * 3. Add a client-side validation constraint that checks that the first name
 *    and last name are different.
 * 4. Make the employee selection functional, so that the form is populated with
 *    the data of the selected employee.
 * 5. Make the reset button functional, so that it resets the form data
 */

interface EmployeeFormProps {
    selectedEmployee: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = (props) => {

    // Handle employee selection
    const {selectedEmployee} = props;
    useEffect(() => {
        // Called whenever the selected employee changes
    }, [selectedEmployee]);

    return <div className="p-m">
        <FormLayout>
            <TextField label="First name"/>
            <TextField label="Last name"/>
            <EmailField label="Email"/>
        </FormLayout>
        <HorizontalLayout id="button-layout" theme="spacing">
            <Button theme="tertiary">Reset</Button>
            <Button theme="primary">Save</Button>
        </HorizontalLayout>
    </div>
}

interface EmployeeGridProps {
    selectedEmployees: Employee[];
    onSelectEmployee: (employee: Employee | null) => void;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = (props) => {
    const {selectedEmployees, onSelectEmployee} = props;

    const dataProvider = useMemo(() => async (
        params: GridDataProviderParams<Employee>,
        callback: GridDataProviderCallback<Employee>
    ) => {
        const {page, pageSize} = params;

        const data = await EmployeeEndpoint.getEmployeesData(
            page * pageSize,
            pageSize,
        );

        callback(data.employees, data.totalSize);
    }, []);

    return <Grid
        theme="no-border"
        dataProvider={dataProvider}
        selectedItems={selectedEmployees}
        onActiveItemChanged={({detail: {value}}) => {
            onSelectEmployee(value || null);
        }}
    >
        <GridColumn path="firstname"/>
        <GridColumn path="lastname"/>
        <GridColumn path="email"/>
    </Grid>
}

export default function EmployeeView() {
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

    return (
        <SplitLayout className="h-full" orientation="vertical">
            <EmployeeForm selectedEmployee={selectedEmployees[0] || null}/>
            <EmployeeGrid selectedEmployees={selectedEmployees}
                          onSelectEmployee={(employee) => setSelectedEmployees(employee ? [employee] : [])}/>
        </SplitLayout>
    );
}
