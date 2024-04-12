import axios from 'axios';
import { client } from "@devrev/typescript-sdk";

//List all the work items which are present in Triage stage
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
    throw error; 
  }
}


//Update the work item target date if it is in triage state for more than 3 days
async function updateWorkItemTargetDate(workItemType: string, workItemId: string, ownerId: string, targetCloseDate: string, display_id: string, devrevPAT: string, devrevSDK: any) {

  try {
      await axios.post(`https://api.devrev.ai/works.update`, {
          type: workItemType,
          id: workItemId,
          target_close_date:targetCloseDate
      }, {
          headers: {
              Authorization: `Bearer ${devrevPAT}`,
              'Content-Type': 'application/json',
          }
      });
     
      const message = `Hey <${ownerId}>,the work item is in triage state from past 3 days.Please take a look.`;

      const body = {
          type: 'timeline_comment',
          object: workItemId,
          body: message
      };
  
      await devrevSDK.timelineEntriesCreate(body);
      console.log(`Notification sent to ${ownerId} for work item ${workItemId}.`);

  } catch (error) {
      console.error('Error updating work item state:', error);
      
  }
}

// Update the priority level of work item to P1 if work item is in triage state for more than 4 days
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
      
  }
}

//Send a message to the owner of the work item 
async function createAndSendNotifications(workList: any[], devrevSDK: any, notifiedCount: number,devrevPAT:string) {
 
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // Calculate 3 days ago
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // Calculate 4 days ago
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); 
  const nextWeekFormatted = nextWeek.toISOString();
 
  for (const workItem of workList) {
    
      if (
          workItem.created_date &&
          new Date(workItem.created_date) < threeDaysAgo &&
          workItem.owned_by
      ) {
        const ownerId = workItem.owned_by[0]?.id || '';
        const target_close_date = workItem.target_close_date; 
        
          
        const display_id = workItem.display_id || '';
          if(target_close_date==null || target_close_date==undefined){
            await updateWorkItemTargetDate(workItem.type, workItem.id, ownerId, nextWeekFormatted, display_id, devrevPAT, devrevSDK);   
              
          }
    
      }
      
      if(workItem.created_date &&
        new Date(workItem.created_date) < fourDaysAgo &&
        workItem.owned_by){
        const ownerId = workItem.owned_by[0]?.id || '';
        const display_id = workItem.display_id || '';
        const priority = workItem.priority || ''; 

        if (priority === 'p2' || priority === 'p3') {
            await updateWorkItemState(workItem.type, workItem.id, ownerId, 'p1', display_id, devrevPAT, devrevSDK);
        }
    }
  }
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
