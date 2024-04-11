import axios from 'axios';
import { client } from "@devrev/typescript-sdk";

async function fetchWorkItems(API_BASE: string, devrevPAT: string) {
  try {
    console.log('Fetching work items in the triage stage...');
    const workListResponse = await axios.get(`${API_BASE}/works.list?stage.name=triage`, {
      headers: {
        Authorization: `Bearer ${devrevPAT}`,
        'Content-Type': 'application/json',
      }
    });
    const workList = workListResponse.data.works;
    console.log(`Fetched ${workList.length} work items in the triage stage.`);
    return workList;
  } catch (error) {
    console.error('Error fetching work items:', error);
    throw error; // Rethrow the error for higher-level handling
  }
}

async function fetchTimelineEntries(workItemId: string, devrevPAT: string) {
  try {
    const response = await axios.get(`https://api.devrev.ai/timeline-entries.list?object=${workItemId}`, {
      headers: {
        Authorization: `Bearer ${devrevPAT}`
      }
    });

    const timelineEntries = response.data.timeline_entries || [];
    
    const bodyArray=timelineEntries.map((entry: { body: string }) => entry.body);
    console.info("body........")
    console.info(bodyArray)
    console.info("body........")
    return bodyArray;
  } catch (error) {
    console.info(error);
    return [];
  }
}

async function updateWorkItemState(workItemType: string, workItemId: string, ownerId: string, newPriorityLevel: string, display_id: string, devrevPAT: string, devrevSDK: any) {
  try {
      await axios.post(`https://api.devrev.ai/works.update`, {
          type: workItemType,
          id: workItemId,
          priority:newPriorityLevel
      }, {
          headers: {
              Authorization: `Bearer ${devrevPAT}`,
              'Content-Type': 'application/json',
          }
      });
      console.log(`Work item ${workItemId} state updated to ${newPriorityLevel}`);

      // Send a notification to the owner
      // const workItem = await fetchWorkItems(workItemId, devrevPAT);
      // const ownerId = workItem.owned_by[0]?.id || '';
      const message = `Hey <${ownerId}>, the work item ${display_id} has been moved to priority level p1.`;

      const body = {
          type: 'timeline_comment',
          object: workItemId,
          body: message
      };
      await devrevSDK.timelineEntriesCreate(body);
      console.log(`Notification sent to ${ownerId} for work item ${workItemId}.`);
  } catch (error) {
      console.error('Error updating work item state:', error);
      // Handle the error as needed
  }
}


async function createAndSendNotifications(workList: any[], devrevSDK: any, notifiedCount: number,devrevPAT:string) {
  let notificationsToSend = [];
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000); // Calculate 1 hour ago
 

  for (const workItem of workList) {
    
      if (
          workItem.created_date &&
          new Date(workItem.created_date) < oneHourAgo &&
          workItem.owned_by
      ) {
        const ownerId = workItem.owned_by[0]?.id || '';
          
          const message = `Hey <${ownerId}>, work item is in triage state from long time`;

          const timelineEntries = await fetchTimelineEntries(workItem.id, devrevPAT);
          let similarMessage = false; // Flag to track if similar message is found

          // Iterate over timelineEntries using traditional for loop
          for (let i = 0; i < timelineEntries.length; i++) {
              const entry = timelineEntries[i];
              if (entry === message) {
                  similarMessage = true;
                  break; // Exit the loop if similar message is found
              }
          }

          if (!similarMessage) {
              const body = {
                  type: 'timeline_comment',
                  object: workItem.id,
                  body: message
              };
              notificationsToSend.push(body);
              notifiedCount++; // Increment notify count when adding a notification
          }
      }
      
      else {
        const ownerId = workItem.owned_by[0]?.id || '';
        const display_id = workItem.display_id || '';
        const priority = workItem.priority || ''; 

        if (priority === 'p2' || priority === 'p3') {
            await updateWorkItemState(workItem.type, workItem.id, ownerId, 'p1', display_id, devrevPAT, devrevSDK);
        }
    }
  }

  // Send all collected notifications
  for (const notification of notificationsToSend) {
      try {
          await devrevSDK.timelineEntriesCreate(notification);
      } catch (error) {
          console.error('Error sending notification:', error);
          // Handle the error as needed
      }
  }

  console.log(`Notified ${notifiedCount} work item owners.`);
}


async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const API_BASE = event.execution_metadata.devrev_endpoint;
  const devrevSDK = client.setup({
    endpoint: API_BASE,
    token: devrevPAT,
  });

  try {
    const workList = await fetchWorkItems(API_BASE, devrevPAT);
    await createAndSendNotifications(workList, devrevSDK, 0, devrevPAT); // Start with notifiedCount 0
    console.log('Task completed: Fetch and notify triaged work items.');
  } catch (error) {
    console.error('Error handling event:', error);
  }
}

export const run = async (events: any[]) => {
  console.info('events', JSON.stringify(events), '\n\n\n');
  for (let event of events) {
    await handleEvent(event);
  }
};

export default run;
