import axios from 'axios';

// 根据用户name查询Flow
export const getAllFlowsByUser = (pageNum, pageSize) => {
    return axios.get(`/console/flow/getAllFlowsByUser`, {params: {pageNum: pageNum, pageSize: pageSize}})
        .then(res => res.data);
};
// 根据用户group查询Flow
export const getAllFlowsByGroup = (pageNum, pageSize) => {
    return axios.get(`/console/flow/getAllFlowsByGroup`, {params: {pageNum: pageNum, pageSize: pageSize}})
        .then(res => res.data);
};

export const getFlow = (flowId) => {
    return axios.get(`/console/flow/getFlow?flowId=${flowId}`)
        .then(res => res.data);
};

export const updateFlow = params => {
    return axios.post('/console/flow/flow', params)
        .then(res => res.data);
};

export const deleteFlow = flowId => {
    return axios.delete('/console/flow/flow?flowId=' + flowId).then(res => res.data);
};

export const newFlow = params => {
    return axios.put('/console/flow/flow', params).then(res => res.data);
};

export const getAllJobsByUser = (params) => {
    return axios.get(`/console/flow/getAllJobsByUser`, {params: params})
        .then(res => res.data);
};


export const getAllJobsByGroup = (params) => {
    return axios.get(`/console/flow/getAllJobsByGroup`, {params: params})
        .then(res => res.data);
};

export const updateJob = params => {
    return axios.post('/console/flow/job', params).then(res => res.data);
};

export const deleteJob = jobId => {
    return axios.delete('/console/flow/job?jobId=' + jobId).then(res => res.data);
};

export const newJob = params => {
    return axios.put('/console/flow/job', params).then(res => res.data);
};

export const triggerFlow = (flowId, params) => {
    return axios.post(`/console/flow/triggerFlow?flowId=${flowId}&params=${params}`).then(res => res.data);
};

export const reTriggerFlow = (flowId, flowTaskId, params) => {
    return axios.post(`/console/flow/reTriggerFlow?flowId=${flowId}&flowTaskId=${flowTaskId}&params=${params}`).then(res => res.data);
};

export const killFlowTask = (flowId,flowTaskId) => {
    return axios.post(`/console/flow/killFlowTask?flowId=${flowId}&flowTaskId=${flowTaskId}`).then(res => res.data);
};

export const getAllFlowTasks = (pageNum, pageSize) => {
    return axios.get(`/console/flow/getAllFlowTasks?pageNum=${pageNum}&pageSize=${pageSize}`).then(res => res.data);
};

export const getFlowTasksByFlowId = (flowId, pageNum, pageSize) => {
    return axios.get(`/console/flow/getFlowTasksByFlowId?flowId=${flowId}&pageNum=${pageNum}&pageSize=${pageSize}`)
        .then(res => res.data);
};

export const getFlowTasksByStatus = (status, pageNum, pageSize) => {
    return axios.get(`/console/flow/getFlowTasksByStatus?status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`)
        .then(res => res.data);
};

export const getTasks = (flowTaskId, pageNum, pageSize) => {
    return axios.get(`/console/flow/getTasks?flowTaskId=${flowTaskId}&pageNum=${pageNum}&pageSize=${pageSize}`)
        .then(res => res.data);
};

export const dataFormat = date => {
    if (date == null) {
        return null;
    }
    return date.substr(0, 19).replace("T", " ");
};

export const queryLog = (host, flowTaskId, taskId, shardStatus, logName) => {
    return axios.get(`/console/flow/query/logs?host=${host}&flowTaskId=${flowTaskId}&taskId=${taskId}&shardStatus=${shardStatus}&logName=${logName}`).then(res => res.data);
};

export const getActiveHandlers = () => {
    return axios.get("/console/flow/getHandlers").then(res => res.data);
};

export const startCronFlow = (flowId) => {
    return axios.post(`/console/flow/cronFlow?flowId=${flowId}`).then(res => res.data);
};

export const stopCronFlow = (flowId) => {
    return axios.delete(`/console/flow/cronFlow?flowId=${flowId}`).then(res => res.data);
};


export const getUsers = (pageNum, pageSize) => {
    return axios.get("/console/manager/getAllUsers", {params: {pageNum: pageNum, pageSize: pageSize}}).then(res => res.data);
};

export const getGroups = (pageNum, pageSize) => {
    return axios.get("/console/manager/getAllGroups",  {params: {pageNum: pageNum, pageSize: pageSize}}).then(res => res.data);
};

export const newUser = params => {
    return axios.put('/console/manager/addUser', params).then(res => res.data);
};

export const newGroup = params => {
    return axios.put('/console/manager/addGroup', params).then(res => res.data);
};

export const updateUser = (user) => {
    return axios.post(`/console/manager/updateUser`,  user).then(res => res.data);
};

export const updateGroup = (group) => {
    return axios.post(`/console/manager/updateGroup`, group).then(res => res.data);
};

export const deleteUser = (userName) => {
    return axios.delete(`/console/manager/deleteUser?userName=${userName}`).then(res => res.data);
};

export const deleteGroup = (groupName) => {
    return axios.delete(`/console/manager/deleteGroup?groupName=${groupName}`).then(res => res.data);
};

export const getJobPermit = () => {
    return axios.get(`/console/manager/getJobPermit`).then(res => res.data);
};

export const getFlowPermit = () => {
    return axios.get(`/console/manager/getFlowPermit`).then(res => res.data);
};

export const getAllUsers = () => {
    return axios.get(`/console/manager/getUsers`).then(res => res.data);
};

export const getAllGroups = () => {
    return axios.get(`/console/manager/getGroups`).then(res => res.data);
};

export const getResourcePermit = (userOrGroup, name, resource, resourceType) => {
    return axios.get(`/console/manager/getResourcePermit`,
            { params: {
                userOrGroup: userOrGroup,
                name: name,
                resource: resource,
                resourceType: resourceType
            }})
        .then(res => res.data);
};

export const updatePermit = (userOrGroup, name, resource, resourceType, permit) => {
    return axios.post(`/console/manager/updatePermit`, {
            userOrGroup: userOrGroup,
            name: name,
            resource: resource,
            resourceType: resourceType,
            permit: permit
        }).then(res => res.data);
};

export const getAlertConfig = (flowId) => {
    return axios.get(`/console/flow/getAlertConfig?flowId=${flowId}`).then(res => res.data);
};

export const getFlowTaskStatus = () => {
    return axios.get(`/console/flow/getFlowTaskStatus`).then(res => res.data);
};

export const getFlowScheduleLog = (flowTaskId) => {
    return axios.get(`/console/flow/getFlowScheduleLog?flowTaskId=${flowTaskId}`).then(res => res.data);
};

export const importConfig = [
    {
        "type": "scylla",
        "config": {
            "keySpace": "rec",
            "tableName": "book_support_version",
            "ttl": "-1",
            "columns": "version_id,is_best_book,is_cartoon,is_scroll,is_serial_epub",
            "types": "int,int,int,int,int"
        },
        "input": "hdfs://nn1/warehouse/external.db/t_external_online_version_d/*",
    }
];
