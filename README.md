# Assignment: Snap-in Development Challenge 

## Step 1:Utilizing the DevRev API
I have used POST https://api.devrev.ai/works.create API to create a work item. I have implemented it using JavaScript.

Link to code:[a link](https://github.com/user/repo/blob/branch/other_file.md)
Link to screenshot:![Alt text](/screenshots/WorkItem_Creation.jpeg/?raw=true "Optional Title")

## Step 2:Creating a Snap-in
### Triage Resolution Optimizer Snap-in

### Overview
The Triage Resolution Optimizer is a Snapin designed to streamline issue management within the triage stage of your workflow. This tool automates reminders and priority adjustments to ensure timely resolution of issues and enhance overall efficiency.

### Features
1. **Reminder Automation**: A Bot automatically sends reminders to the assigned owner if an issue remains in the triage state for more than 3 days.

2. **Priority Escalation**: Escalates the priority level of issues in the triage state for more than 4 days and notifies the owner for immediate attention.

3. **Efficiency Improvement**: Promotes accountability, reduces response times, and ensures a proactive approach to issue resolution.

Link to screenshot:![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")

## Getting Started 

### Adding external dependencies
You can also add dependencies on external packages in package.json under the "dependencies" key. These dependencies will be made available to your function at runtime and testing.

### Packaging the code
Once you are done with the testing,
Run
```
npm run build
npm run package
```
and ensure it succeeds.

You will see a `build.tar.gz` file is created and you can provide it while creating the snap_in_version.

### Snap-in Installation Steps
Follow these steps to install the Triage Resolution Optimizer Snap-in:

1. Log in to DevRev for authentication. To authenticate, run the following command:

```
devrev profiles authenticate -o <dev-org-slug> -u youremail@yourdomain.com
```

2. Create a snap-in package by running the following command:

```
devrev snap_in_package create-one --slug <name for snap-in> | jq .
```

3. Create a snap-in version with the created package using:

```
devrev snap_in_version create-one --path ./devrev-snaps-typescript-template | jq .
```

4. Install the snap-in in draft state by running:

```
devrev snap_in draft
```
5. Configure the snap-in using the URL generated by the draft command or by navigating to the snap-ins page in the DevRev app.

6. Deploy the snap-in by clicking the Deploy snap-in button in the UI. The snap-in should now be active and ready to use.

7. To delete the snap-in, you can use the following command or delete it from the UI:

```
devrev snap_in delete-one [snap-in id]
```

8. If you need to upgrade the snap-in, use the following command:

```
devrev snap_in_version upgrade --path ./
```


