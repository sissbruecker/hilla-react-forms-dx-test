# Hilla React Form DX Test

Contains task and solution for the Hilla React forms DX test.

You have been given a simple React application that contains a view for adding and editing employees.
Your task it to make the employee form in that view functional:
1. Make the submit button functional, so that it saves the form data to the backend, via the `EmployeeEndpoint.saveEmployee` endpoint method.
2. Add a client-side validation constraint that checks that the email ends with `@vaadin.com`.
3. Add a client-side validation constraint that checks that the first name and last name are different.
4. Make the employee selection functional, so that the form is populated with the data of the selected employee.
5. Make the reset button functional, so that it resets the form data

To start with the task:
- Clone this repository
- Run the application with `mvnw` (Windows), or `./mvnw` (Mac & Linux)
- Open http://localhost:8080 in your browser
- Open `frontend/views/task/EmployeeView.tsx` in your IDE to start with the tasks
