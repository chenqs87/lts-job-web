import axios from 'axios';

export const getAllFlows = (pageNum, pageSize) => {
    return axios.get(`/console/flow/getAllFlows`, {params: {pageNum: pageNum, pageSize: pageSize}})
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

export const getAllJobs = (params) => {
    return axios.get(`/console/flow/getAllJobs`, {params: params})
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

export const killFlowTask = (flowTaskId) => {
    return axios.post(`/console/flow/killFlowTask?flowTaskId=${flowTaskId}`).then(res => res.data);
};

export const getAllFlowTasks = (pageNum, pageSize) => {
    return axios.get(`/console/flow/getAllFlowTasks?pageNum=${pageNum}&pageSize=${pageSize}`).then(res => res.data);
};

export const getFlowTasksByFlowId = (flowId, pageNum, pageSize) => {
    return axios.get(`/console/flow/getFlowTasksByFlowId?flowId=${flowId}&pageNum=${pageNum}&pageSize=${pageSize}`)
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

export const queryLog = (host, flowTaskId, taskId, shardStatus) => {
    return axios.get(`http://${host}/executor/query/logs?flowTaskId=${flowTaskId}&taskId=${taskId}&shardStatus=${shardStatus}`)
        .then(res => res.data);
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
