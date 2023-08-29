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
import {useBinder, useBinderNode} from "@hilla/react-form";
import EmployeeModel from "Frontend/generated/com/example/application/EmployeeModel";
import {Notification} from "@hilla/react-components/Notification";

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
 * 6. Disable the submit button when the form is invalid
 * 7. Disable the reset button if the form has not been modified
 */

interface EmployeeFormProps {
    selectedEmployee: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = (props) => {
    const binder = useBinder(EmployeeModel, {
        onSubmit: async (employee) => {
            await EmployeeEndpoint.saveEmployee(employee);
            Notification.show(`Submitted: ${JSON.stringify(employee)}`);
        }
    });
    const emailNode = useBinderNode(binder.model.email);

    // Custom validation
    useEffect(() => {
        // Validate email ends with @vaadin.com
        emailNode.addValidator({
            message: "Email must end with @vaadin.com",
            validate: (value: string) => typeof value === "string" && value.endsWith("@vaadin.com")
        })
        // Validate first name and last name are different
        binder.addValidator({
            message: 'First name and last name must be different',
            validate: (employee: Employee) => {
                if (employee.firstname === employee.lastname) {
                    return [{property: binder.model.firstname}, {property: binder.model.lastname}];
                } else {
                    return [];
                }
            }
        })
    }, []);

    // Handle employee selection
    const {selectedEmployee} = props;
    useEffect(() => {
        // Called whenever the selected employee changes
        binder.read(selectedEmployee || {});
    }, [selectedEmployee]);

    return <div className="p-m">
        <FormLayout>
            <TextField label="First name" {...binder.field(binder.model.firstname)}/>
            <TextField label="Last name" {...binder.field(binder.model.lastname)}/>
            <EmailField label="Email" {...binder.field(binder.model.email)}/>
        </FormLayout>
        <HorizontalLayout id="button-layout" theme="spacing">
            <Button theme="tertiary" onClick={binder.reset} disabled={!binder.dirty}>Reset</Button>
            <Button theme="primary" onClick={binder.submit} disabled={binder.invalid}>Save</Button>
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
