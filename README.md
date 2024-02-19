# Refund-Calculator-Tool
Description
This project is an Electron application that includes a function to calculate a refund amount based on an original price, tax rate, original discount rate, and new discount rate. The application also includes lifecycle events for the Electron app and IPC (Inter-Process Communication) events to communicate between the main and renderer processes.

The main features of the application are:

Refund Calculation: The application calculates the refund amount based on the original price, tax rate, original discount rate, and new discount rate. The calculation is performed in the main process and the result is sent back to the renderer process.

IPC Events: The application uses IPC events to communicate between the main and renderer processes. The 'calculate-refund' event is used to trigger the refund calculation in the main process.

App Lifecycle Events: The application handles various app lifecycle events such as 'ready', 'activate', 'window-all-closed', 'before-quit', 'will-quit', and 'quit'.

Window Management: The application creates a new window when the app is ready or activated with no windows open. It also handles the 'ready-to-show' and 'closed' events for the window.

Installation
Run the included installer file. This will then place a desktop icon you can use to open the app. 

Usage
Customer service representatives can use this tool to easily calculate the difference in sales price and provide a quick refund amount. 

Contributing
Not really sure how this works yet. 

License
Aint got one, I'm broke but you're welcome for the functional tool!